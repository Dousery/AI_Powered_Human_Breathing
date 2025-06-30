import streamlit as st
import pandas as pd
import numpy as np
import joblib
import pickle
import os
from datetime import datetime

# Streamlit sayfa konfigürasyonu - en başta olmalı
st.set_page_config(page_title="Hasta Durumu Tahminleme", layout="centered")

# Yeni eklenen kütüphaneler ve fonksiyonlar
from scipy.signal import find_peaks
from scipy.stats import skew, kurtosis, entropy
from itertools import groupby
from scipy.fft import fft
from python_speech_features import mfcc # Bu kütüphaneyi kurmanız gerekecek: pip install python_speech_features

# --- Model ve Bileşenleri Yükleme ---
model_dir = os.path.join(os.path.dirname(__file__), 'model') # app.py'nin olduğu dizindeki 'model' klasörü

try:
    ensemble_model = joblib.load(os.path.join(model_dir, 'best_model.joblib'))
    feature_selector = joblib.load(os.path.join(model_dir, 'feature_selector.joblib'))
    scaler = joblib.load(os.path.join(model_dir, 'scaler.joblib'))
    with open(os.path.join(model_dir, 'selected_features.pkl'), 'rb') as f:
        selected_features = pickle.load(f)
    st.sidebar.success("Model ve bileşenler başarıyla yüklendi!")
except FileNotFoundError:
    st.sidebar.error(f"Model dosyaları bulunamadı. Lütfen '{model_dir}' klasörünün doğru konumda olduğundan emin olun.")
    st.stop() # Uygulamayı durdur
except Exception as e:
    st.sidebar.error(f"Model yüklenirken bir hata oluştu: {e}")
    st.stop()

# --- Yeni Özellik Çıkarma Fonksiyonu (Seçili Özellikler İçin) ---
def calculate_selected_features_only(breath_data, audio_data, max_val=4095):
    """Sadece seçili özellikleri hesaplar"""
    
    # Verileri numpy array'e çevir
    sensor_data = np.array(breath_data)
    audio_signal = np.array(audio_data)
    
    # Zirve noktalarını bul
    peaks, _ = find_peaks(sensor_data, height=max_val * 0.8, distance=10)
    peak_values = sensor_data[peaks] if len(peaks) > 0 else [0]
    
    # FFT hesapla (audio için)
    fft_coeffs = np.abs(fft(audio_signal))[:len(audio_signal)//2]
    
    # Tüm özellikleri hesapla
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

def get_scaled_features(breath_data, audio_data):
    """Seçili özellikleri hesaplar ve scaler ile normalize eder"""
    # Tüm özellikleri hesapla
    all_features = calculate_selected_features_only(breath_data, audio_data)
    
    # Seçili özellikleri doğru sırada döndür
    feature_values = [all_features[feature] for feature in selected_features]
    
    # 2D array'e çevir (scaler için gerekli)
    features_2d = np.array(feature_values).reshape(1, -1)
    
    # Scaler'ı yükle ve scale et
    scaled_features = scaler.transform(features_2d)
    
    return scaled_features[0], feature_values, all_features  # Scale edilmiş, ham ve tüm özellikleri döndür

# --- Eski Özellik Çıkarma Fonksiyonu (Geriye Uyumluluk İçin) ---
def extract_all_features(patient_age, patient_smoking, sensor_data, audio_signal, timestamps=None, max_val=4095):
    """KOAH hastalığı tespiti için nefes verisinden özellikler çıkarır"""

    # Sensör verisini NumPy array'e çevir
    sensor_data = np.array(sensor_data)
    audio_signal = np.array(audio_signal)

    # Eğer zaman verisi sağlanmadıysa, indeks numarasını zaman olarak kabul et
    if timestamps is None:
        timestamps = np.arange(len(sensor_data))
    else:
        timestamps = np.array(timestamps)

    # Zirve (peak) ve çukur (trough) noktalarını bul (EĞİTİMDEKİ GİBİ)
    peaks, _ = find_peaks(sensor_data, height=max_val * 0.8, distance=10)
    troughs, _ = find_peaks(max_val - sensor_data, height=max_val * 0.8, distance=10)

    peak_values = sensor_data[peaks] if len(peaks) > 0 else [0]
    trough_values = sensor_data[troughs] if len(troughs) > 0 else [0]

    # FEV1/FVC oranı (EĞİTİMDEKİ GİBİ)
    fev1 = np.percentile(sensor_data, 75)  # Yaklaşık ilk %75'lik değer
    fvc = np.sum(sensor_data)  # Toplam nefes kapasitesi (yaklaşık hesaplama)
    fev1_fvc_ratio = fev1 / fvc if fvc != 0 else 0

    # PEF (Peak Expiratory Flow) - Zirve nefes verme hızı
    pef = np.max(sensor_data)

    # Solunum süresi
    breath_duration = timestamps[-1] - timestamps[0] if len(timestamps) > 1 else 0

    # Eğilim (Trend) hesaplama
    slope = np.polyfit(timestamps, sensor_data, 1)[0] if len(sensor_data) > 1 else 0

    # Frekans alanı analizi (Fourier Transform)
    fft_coeffs = np.abs(fft(sensor_data))[:10]  # İlk 10 bileşeni al

    # FFT hesapla (audio için)
    fft_coeffs = np.abs(fft(audio_signal))[:len(audio_signal)//2]
    fft_probs = fft_coeffs / np.sum(fft_coeffs) if np.sum(fft_coeffs) > 0 else np.ones_like(fft_coeffs)

    features = {
         'patient_age': patient_age,
        'patient_smoking': patient_smoking,

        # Key statistical features for Breath
        'mean_force': np.mean(sensor_data),
        'std_force': np.std(sensor_data),
        'min_force': np.min(sensor_data),
        'max_force': np.max(sensor_data),
        'skewness': skew(sensor_data),
        'kurtosis': kurtosis(sensor_data),

        # Breath wave characteristics
        'num_peaks': len(peaks),
        'num_troughs': len(troughs),
        'avg_peak_height': np.mean(peak_values),
        'avg_trough_depth': np.mean(trough_values),
        'breath_amplitude': np.mean(peak_values) - np.mean(trough_values) if len(peaks) > 0 and len(troughs) > 0 else 0,
        'peak_variability': np.std(peak_values) if len(peaks) > 1 else 0,
        'trough_variability': np.std(trough_values) if len(troughs) > 1 else 0,
        'max_cluster': max(len(list(g)) for k, g in groupby(sensor_data == max_val)) if max_val in sensor_data else 0,

        # Critical features for COPD
        'fev1_fvc_ratio': fev1_fvc_ratio,  # KOAH teşhisi için kritik oran
        'pef': pef,  # Zirve nefes verme hızı
        'breath_duration': breath_duration,  # Nefes süresi
        'slope': slope,  # Nefes gücünün zaman içindeki değişim eğilimi

        # Frequency domain characteristics
        'fft_coeff_1': fft_coeffs[0] if len(fft_coeffs) > 0 else 0,
        'fft_coeff_2': fft_coeffs[1] if len(fft_coeffs) > 1 else 0,
        'fft_coeff_3': fft_coeffs[2] if len(fft_coeffs) > 2 else 0,
        'fft_coeff_4': fft_coeffs[3] if len(fft_coeffs) > 3 else 0,
        'fft_coeff_5': fft_coeffs[4] if len(fft_coeffs) > 4 else 0,

        # Basic statistical features for audio
        'mean_audio': np.mean(audio_signal),
        'std_audio': np.std(audio_signal),
        'max_audio': np.max(audio_signal),
        'min_audio': np.min(audio_signal),

        # Ses için belirli özellikler
        'signal_energy': np.sum(audio_signal**2),
        'rms_energy': np.sqrt(np.mean(audio_signal**2)),
        'zero_crossing_rate': np.mean(np.abs(np.diff(np.sign(audio_signal)))),
        'fft_peak_freq': np.argmax(fft_coeffs),
        'fft_bandwidth': np.std(fft_coeffs),
        'fft_entropy': entropy(fft_probs) if np.all(fft_probs > 0) else 0,
    }

    # MFCC özellikleri (numcep=13 default)
    try:
        mfcc_features = mfcc(audio_signal.astype(np.float32), samplerate=16000, numcep=13)
        mfcc_mean = np.mean(mfcc_features, axis=0)
        for i, val in enumerate(mfcc_mean):
            features[f'mfcc_{i+1}'] = val
    except:
        for i in range(13):
            features[f'mfcc_{i+1}'] = 0

    return features

# --- Streamlit Uygulaması Arayüzü ---
st.title("Hasta Durumu Tahminleme Uygulaması")
st.markdown("Yeni bir hasta için `column1.txt`, `column3.txt` ve `metadata.txt` dosyalarını yükleyerek hastalığı tahmin edin.")

st.info("""
    **Özellik Çıkarımı Bilgisi:**
    Bu uygulama, nefes ve ses sensörü verilerinden **seçili özellikleri** kullanarak tahminleme yapar.
    Model 3 sınıflı sınıflandırma yapar: **0 (Normal)**, **1 (Orta Risk)**, **2 (Yüksek Risk)**
""")

# --- Dosya Yükleyiciler ---
st.subheader("1. Sensör ve Metadata Dosyalarını Yükleyin")

uploaded_col1_file = st.file_uploader("`column1.txt` (Nefes Sensörü Verisi) Yükle", type="txt")
uploaded_col3_file = st.file_uploader("`column3.txt` (Ses Sensörü Verisi) Yükle", type="txt")
uploaded_metadata_file = st.file_uploader("`metadata.txt` (Hasta Bilgileri) Yükle", type="txt")

if st.button("Tahmin Et"):
    if uploaded_col1_file and uploaded_col3_file and uploaded_metadata_file:
        try:
            # column1.txt oku
            breath_sensor_raw_str = uploaded_col1_file.read().decode("utf-8").strip()
            if breath_sensor_raw_str.startswith('[') and breath_sensor_raw_str.endswith(']'):
                breath_sensor_raw_str = breath_sensor_raw_str[1:-1]
            breath_sensor_data = np.array([float(x) for x in breath_sensor_raw_str.split('\n') if x.strip()])
            # column3.txt oku
            audio_sensor_data = np.array([float(x) for x in uploaded_col3_file.read().decode("utf-8").strip().split() if x.strip()])
            # metadata.txt oku
            metadata_lines = [line.strip() for line in uploaded_metadata_file.read().decode("latin-1").split('\n') if line.strip()]
            metadata_dict = {}
            for line in metadata_lines:
                if ":" in line:
                    key, value = line.split(":", 1)
                    metadata_dict[key.strip()] = value.strip()
            if not all(k in metadata_dict for k in ["Patient Name", "Date", "smoking", "age"]):
                st.error("Metadata dosyası eksik veya hatalı formatta. Lütfen tüm alanların (Patient Name, Date, smoking, age) olduğundan emin olun.")
                st.stop()
            patient_name_full = metadata_dict.get("Patient Name", "Bilinmeyen Ad")
            name_parts = patient_name_full.split(" ", 1)
            patient_name = name_parts[0] if name_parts else "Bilinmeyen"
            patient_surname = name_parts[1] if len(name_parts) > 1 else "Bilinmeyen"
            test_date_str = metadata_dict.get("Date", "")
            try:
                test_date = datetime.strptime(test_date_str, '%Y-%m-%d_%H-%M-%S')
            except ValueError:
                st.error(f"Metadata dosyasındaki tarih formatı hatalı: {test_date_str}. Beklenen format: YYYY-MM-DD_HH-MM-SS")
                st.stop()
            is_smoking_status = metadata_dict.get("smoking", "no")
            age_str = metadata_dict.get("age", "0")
            try:
                patient_age = int(age_str)
            except ValueError:
                st.error(f"Metadata dosyasındaki yaş değeri geçersiz: {age_str}. Yaş bir sayı olmalıdır.")
                st.stop()
            st.subheader("2. Hasta Bilgileri ve Veri Analizi")
            col1, col2 = st.columns(2)
            with col1:
                st.write(f"**Hasta Adı:** {patient_name} {patient_surname}")
                st.write(f"**Yaş:** {patient_age}")
            with col2:
                st.write(f"**Test Tarihi:** {test_date.strftime('%Y-%m-%d %H:%M:%S')}")
                st.write(f"**Sigara İçiyor mu?:** {is_smoking_status.capitalize()}")
            st.write(f"**Nefes Sensörü Veri Noktası:** {len(breath_sensor_data)}")
            st.write(f"**Ses Sensörü Veri Noktası:** {len(audio_sensor_data)}")
            # Özellik hesaplama
            st.subheader("3. Özellik Hesaplama ve Analiz")
            with st.spinner("Özellikler hesaplanıyor..."):
                # Ham (unscaled) seçili özellikler
                all_features = calculate_selected_features_only(breath_sensor_data, audio_sensor_data)
                raw_selected_features = [all_features[f] for f in selected_features]
                # Scaled özellikler sadece bilgi için
                features_2d = np.array(raw_selected_features).reshape(1, -1)
                scaled_features = scaler.transform(features_2d)
            st.write("**Hesaplanan Seçili Özellikler (Ham):**")
            st.dataframe(pd.DataFrame([raw_selected_features], columns=selected_features), use_container_width=True)
            st.write("**Hesaplanan Seçili Özellikler (Scale Edilmiş - Sadece Bilgi Amaçlı!):**")
            st.dataframe(pd.DataFrame([scaled_features[0]], columns=selected_features), use_container_width=True)
            # Tahmin Yap (HAM özelliklerle!)
            st.subheader("4. Model Tahmini")
            with st.spinner("Model tahmini yapılıyor..."):
                prediction = ensemble_model.predict([raw_selected_features])
                prediction_proba = ensemble_model.predict_proba([raw_selected_features])
                prediction_value = prediction[0]
                proba_values = prediction_proba[0]
            st.write("**Tahmin Sonucu:**")
            if prediction_value == 0:
                st.success(f"### ✅ **NORMAL DURUM** (Sınıf 0)")
                st.write("Hasta normal solunum fonksiyonlarına sahip görünüyor.")
            elif prediction_value == 1:
                st.warning(f"### ⚠️ **ORTA RİSK** (Sınıf 1)")
                st.write("Hastada hafif solunum problemleri tespit edildi. Takip önerilir.")
            elif prediction_value == 2:
                st.error(f"### 🚨 **YÜKSEK RİSK** (Sınıf 2)")
                st.write("Hastada ciddi solunum problemleri tespit edildi. Acil değerlendirme gerekli.")
            else:
                st.info(f"### Bilinmeyen sınıf: {prediction_value}")
            st.write("**Tahmin Olasılıkları:**")
            proba_df = pd.DataFrame({
                'Sınıf': ['Normal (0)', 'Orta Risk (1)', 'Yüksek Risk (2)'],
                'Olasılık': proba_values,
                'Yüzde': [f"{p*100:.2f}%" for p in proba_values]
            })
            st.dataframe(proba_df, use_container_width=True)
            st.write("**Olasılık Dağılımı:**")
            proba_chart = pd.DataFrame({
                'Sınıf': ['Normal', 'Orta Risk', 'Yüksek Risk'],
                'Olasılık': proba_values
            })
            st.bar_chart(proba_chart.set_index('Sınıf'))
        except Exception as e:
            st.error(f"Dosya işleme veya tahmin sırasında bir hata oluştu: {e}")
            st.exception(e)
    else:
        st.warning("Lütfen tüm `column1.txt`, `column3.txt` ve `metadata.txt` dosyalarını yükleyin.")

st.markdown("---")
st.sidebar.markdown("### Uygulama Bilgisi")
st.sidebar.info("""
Bu uygulama, nefes sensörü, ses sensörü ve hasta metadata verilerini kullanarak 
bir makine öğrenimi modeli aracılığıyla hasta durumunu tahmin eder.

**Sınıflar:**
- **0**: Normal durum
- **1**: Orta risk
- **2**: Yüksek risk

**Seçili Özellikler:** 17 adet
""")

# Seçili özellikleri sidebar'da göster
with st.sidebar.expander("Seçili Özellikler"):
    st.write("Model tarafından kullanılan özellikler:")
    for i, feature in enumerate(selected_features, 1):
        st.write(f"{i}. {feature}")