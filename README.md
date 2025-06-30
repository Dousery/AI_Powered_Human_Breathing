# KOAH Tahminleme - AI Destekli Sağlık Uygulaması

Bu proje, KOAH (Kronik Obstrüktif Akciğer Hastalığı) tespiti için yapay zeka destekli modern bir web uygulamasıdır. FastAPI backend ve React frontend ile geliştirilmiştir.

## 🚀 Özellikler

- **AI Destekli Tahminleme**: Makine öğrenmesi modeli ile KOAH risk analizi
- **Modern Web Arayüzü**: React ve Tailwind CSS ile responsive tasarım
- **Güvenli API**: FastAPI ile güçlü backend servisleri
- **Görsel Analiz**: Recharts ile interaktif sonuç grafikleri
- **Sağlık Bilgileri**: KOAH hakkında kapsamlı bilgilendirme içeriği
- **Kullanıcı Dostu**: Sade ve anlaşılır arayüz

## 🏗️ Proje Yapısı

```
AI_Powered_Human_Breathing/
├── backend/                 # FastAPI backend
│   ├── main.py             # Ana API dosyası
│   ├── requirements.txt    # Python bağımlılıkları
│   └── README.md          # Backend dokümantasyonu
├── frontend/               # React frontend
│   ├── src/               # React kaynak kodları
│   ├── public/            # Statik dosyalar
│   ├── package.json       # Node.js bağımlılıkları
│   └── README.md          # Frontend dokümantasyonu
├── model/                 # Eğitilmiş ML modelleri
│   ├── best_model.joblib
│   ├── feature_selector.joblib
│   ├── scaler.joblib
│   └── selected_features.pkl
├── app_interface.py       # Streamlit uygulaması (eski)
└── README.md             # Bu dosya
```

## 🛠️ Kurulum

### Backend Kurulumu

1. Python sanal ortamı oluşturun:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate     # Windows
```

2. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

3. Backend'i çalıştırın:
```bash
python main.py
```

Backend http://localhost:8000 adresinde çalışacaktır.

### Frontend Kurulumu

1. Node.js bağımlılıklarını yükleyin:
```bash
cd frontend
npm install
```

2. Frontend'i çalıştırın:
```bash
npm start
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 📊 API Endpoints

- `GET /` - Ana sayfa
- `GET /health` - Sağlık kontrolü
- `POST /predict` - KOAH tahmini
- `GET /health-info` - KOAH hakkında bilgiler
- `GET /model-info` - Model bilgileri

## 🎯 Kullanım

1. **Ana Sayfa**: Uygulama hakkında genel bilgiler
2. **KOAH Tahmini**: Dosya yükleme ve analiz
   - `column1.txt` (nefes sensörü verisi)
   - `column3.txt` (ses sensörü verisi)
   - `metadata.txt` (hasta bilgileri)
3. **Sağlık Bilgileri**: KOAH hakkında detaylı bilgiler
4. **Hakkında**: Proje ve ekip bilgileri

## 🔬 Teknik Detaylar

### AI Model
- **Model Tipi**: Ensemble Model
- **Özellik Sayısı**: 17 seçili özellik
- **Sınıflar**: 3 (Normal, Orta Risk, Yüksek Risk)
- **Analiz Süresi**: < 30 saniye

### Analiz Edilen Veriler
- Nefes sensörü verisi (solunum gücü ve paterni)
- Ses sensörü verisi (solunum sesleri)
- Hasta bilgileri (yaş, sigara durumu)
- Sinyal işleme (FFT, MFCC, istatistiksel özellikler)

### Teknoloji Stack
- **Backend**: FastAPI, Python, Scikit-learn, NumPy, SciPy
- **Frontend**: React, Tailwind CSS, Recharts, Axios
- **AI/ML**: Ensemble Models, Feature Engineering, Signal Processing

## 🎨 Tasarım

- **Tema**: Sağlık ve nefes konsepti
- **Renkler**: Açık mavi, beyaz tonlar
- **Responsive**: Mobil ve desktop uyumlu
- **Modern UI**: Temiz ve kullanıcı dostu arayüz

## 📱 Ekran Görüntüleri

- Ana sayfa: Modern hero section ve özellikler
- Tahmin sayfası: Dosya yükleme ve sonuç analizi
- Sağlık bilgileri: KOAH hakkında kapsamlı bilgiler
- Responsive tasarım: Mobil ve tablet uyumlu

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## ⚠️ Önemli Not

Bu uygulama tıbbi teşhis yerine geçmez. Sonuçlar sadece bilgilendirme amaçlıdır. 
Sağlık sorunlarınız için mutlaka bir sağlık profesyoneline başvurun.

## 📞 İletişim

Proje hakkında sorularınız için:
- Teknik destek: Backend ve frontend sorunları
- Sağlık danışmanlığı: KOAH hakkında bilgi ve öneriler

---

**KOAH AI** - Yapay Zeka Destekli Sağlık Teknolojisi
