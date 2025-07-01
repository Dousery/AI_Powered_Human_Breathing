from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import joblib
import pickle
import os
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import io

# Scipy ve diğer kütüphaneler
from scipy.signal import find_peaks
from scipy.stats import skew, kurtosis, entropy
from itertools import groupby
from scipy.fft import fft
from python_speech_features import mfcc

app = FastAPI(
    title="KOAH Tahminleme API",
    description="KOAH hastalığı tespiti için makine öğrenmesi API'si",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model ve bileşenleri yükleme
model_dir = os.path.join(os.path.dirname(__file__), '..', 'model')

try:
    ensemble_model = joblib.load(os.path.join(model_dir, 'best_model.joblib'))
    feature_selector = joblib.load(os.path.join(model_dir, 'feature_selector.joblib'))
    scaler = joblib.load(os.path.join(model_dir, 'scaler.joblib'))
    with open(os.path.join(model_dir, 'selected_features.pkl'), 'rb') as f:
        selected_features = pickle.load(f)
    print("✅ Model ve bileşenler başarıyla yüklendi!")
except Exception as e:
    print(f"❌ Model yüklenirken hata: {e}")
    raise

# Pydantic modelleri
class PatientInfo(BaseModel):
    name: str
    age: int
    smoking: str
    test_date: str

class PredictionResult(BaseModel):
    prediction: int
    probabilities: List[float]
    risk_level: str
    description: str
    features: dict
    patient_info: dict

class HealthInfo(BaseModel):
    title: str
    content: str
    category: str

# Özellik çıkarma fonksiyonu
def calculate_selected_features_only(breath_data, audio_data, max_val=4095):
    """Sadece seçili özellikleri hesaplar"""
    
    sensor_data = np.array(breath_data)
    audio_signal = np.array(audio_data)
    
    peaks, _ = find_peaks(sensor_data, height=max_val * 0.8, distance=10)
    peak_values = sensor_data[peaks] if len(peaks) > 0 else [0]
    
    fft_coeffs = np.abs(fft(audio_signal))[:len(audio_signal)//2]
    
    all_features = {
        'max_force': float(np.max(sensor_data)),
        'avg_peak_height': float(np.mean(peak_values)),
        'pef': float(np.max(sensor_data)),
        'breath_duration': float(len(sensor_data)),
        'fft_coeff_1': float(fft_coeffs[0] if len(fft_coeffs) > 0 else 0),
        'fft_coeff_4': float(fft_coeffs[3] if len(fft_coeffs) > 3 else 0),
        'mean_audio': float(np.mean(audio_signal)),
        'std_audio': float(np.std(audio_signal)),
        'min_audio': float(np.min(audio_signal)),
        'signal_energy': float(np.sum(audio_signal**2)),
        'rms_energy': float(np.sqrt(np.mean(audio_signal**2))),
        'fft_bandwidth': float(np.std(fft_coeffs)),
    }
    
    # MFCC özellikleri
    try:
        mfcc_features = mfcc(audio_signal.astype(np.float32), samplerate=16000, numcep=13)
        mfcc_mean = np.mean(mfcc_features, axis=0)
        all_features['mfcc_1'] = float(mfcc_mean[0])
        all_features['mfcc_2'] = float(mfcc_mean[1])
        all_features['mfcc_5'] = float(mfcc_mean[4])
        all_features['mfcc_9'] = float(mfcc_mean[8])
        all_features['mfcc_12'] = float(mfcc_mean[11])
    except:
        all_features['mfcc_1'] = 0.0
        all_features['mfcc_2'] = 0.0
        all_features['mfcc_5'] = 0.0
        all_features['mfcc_9'] = 0.0
        all_features['mfcc_12'] = 0.0
    
    return all_features

# API Endpoints
@app.get("/")
async def root():
    return {"message": "KOAH Tahminleme API'si çalışıyor!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict", response_model=PredictionResult)
async def predict_koah(
    breath_file: UploadFile = File(...),
    audio_file: UploadFile = File(...),
    metadata_file: UploadFile = File(...)
):
    try:
        # Dosyaları oku
        breath_content = await breath_file.read()
        audio_content = await audio_file.read()
        metadata_content = await metadata_file.read()
        
        # Breath data parse et
        breath_sensor_raw_str = breath_content.decode("utf-8").strip()
        if breath_sensor_raw_str.startswith('[') and breath_sensor_raw_str.endswith(']'):
            breath_sensor_raw_str = breath_sensor_raw_str[1:-1]
        breath_sensor_data = np.array([float(x) for x in breath_sensor_raw_str.split('\n') if x.strip()])
        
        # Audio data parse et
        audio_sensor_data = np.array([float(x) for x in audio_content.decode("utf-8").strip().split() if x.strip()])
        
        # Metadata parse et
        metadata_lines = [line.strip() for line in metadata_content.decode("latin-1").split('\n') if line.strip()]
        metadata_dict = {}
        for line in metadata_lines:
            if ":" in line:
                key, value = line.split(":", 1)
                metadata_dict[key.strip()] = value.strip()
        
        # Özellikleri hesapla
        all_features = calculate_selected_features_only(breath_sensor_data, audio_sensor_data)
        raw_selected_features = [all_features[f] for f in selected_features]
        
        # Tahmin yap
        prediction = ensemble_model.predict([raw_selected_features])
        prediction_proba = ensemble_model.predict_proba([raw_selected_features])
        
        prediction_value = int(prediction[0])
        proba_values = prediction_proba[0].tolist()
        
        # Risk seviyesi belirle
        risk_levels = {
            0: "Normal",
            1: "Orta Risk", 
            2: "Yüksek Risk"
        }
        
        descriptions = {
            0: "Hasta normal solunum fonksiyonlarına sahip görünüyor.",
            1: "Hastada hafif solunum problemleri tespit edildi. Takip önerilir.",
            2: "Hastada ciddi solunum problemleri tespit edildi. Acil değerlendirme gerekli."
        }
        
        return PredictionResult(
            prediction=prediction_value,
            probabilities=proba_values,
            risk_level=risk_levels[prediction_value],
            description=descriptions[prediction_value],
            features=all_features,
            patient_info={
                "name": metadata_dict.get('Patient Name', ''),
                "age": metadata_dict.get('age', ''),
                "smoking": metadata_dict.get('smoking', ''),
                "test_date": metadata_dict.get('Date', '')
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Tahmin sırasında hata: {str(e)}")

@app.get("/health-info")
async def get_health_info():
    """Informative content about COPD (in English)"""
    
    health_info = [
        {
            "title": "What is COPD?",
            "content": "Chronic Obstructive Pulmonary Disease (COPD) is a chronic disease that causes narrowing of the airways in the lungs. This condition makes breathing difficult and can worsen over time.",
            "category": "general"
        },
        {
            "title": "COPD Symptoms",
            "content": "• Shortness of breath (especially during physical activity)\n• Chronic cough\n• Sputum production\n• Feeling of tightness in the chest\n• Wheezing\n• Fatigue and lack of energy",
            "category": "symptoms"
        },
        {
            "title": "Risk Factors",
            "content": "• Smoking (the most important risk factor)\n• Exposure to secondhand smoke\n• Air pollution\n• Occupational exposure to dust and chemicals\n• Genetic factors\n• Age (over 40 years)",
            "category": "risk"
        },
        {
            "title": "Importance of Early Diagnosis",
            "content": "Early diagnosis of COPD is critical to slow the progression of the disease and maintain quality of life. Early intervention can help control symptoms and prevent complications.",
            "category": "diagnosis"
        },
        {
            "title": "Prevention Methods",
            "content": "• Quit smoking\n• Exercise regularly\n• Eat healthy\n• Avoid air pollution\n• Have regular health check-ups\n• Keep your vaccinations up to date",
            "category": "prevention"
        },
        {
            "title": "Treatment Options",
            "content": "• Medication (bronchodilators, steroids)\n• Pulmonary rehabilitation\n• Oxygen therapy\n• Lifestyle changes\n• Surgical intervention (if necessary)",
            "category": "treatment"
        }
    ]
    
    return {"health_info": health_info}

@app.get("/model-info")
async def get_model_info():
    """Model hakkında bilgi"""
    return {
        "model_type": "Ensemble Model",
        "features_count": len(selected_features),
        "selected_features": selected_features,
        "classes": ["Normal (0)", "Orta Risk (1)", "Yüksek Risk (2)"],
        "accuracy": "Yüksek doğruluk oranı"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 