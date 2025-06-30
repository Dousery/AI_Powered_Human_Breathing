# KOAH Tahminleme API - Backend

Bu FastAPI backend, KOAH hastalığı tespiti için makine öğrenmesi modelini kullanarak tahminleme yapar.

## Kurulum

1. Sanal ortam oluşturun:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate  # Windows
```

2. Gereksinimleri yükleyin:
```bash
pip install -r requirements.txt
```

3. Uygulamayı çalıştırın:
```bash
python main.py
```

API http://localhost:8000 adresinde çalışacaktır.

## API Endpoints

- `GET /` - Ana sayfa
- `GET /health` - Sağlık kontrolü
- `POST /predict` - KOAH tahmini
- `GET /health-info` - KOAH hakkında bilgiler
- `GET /model-info` - Model bilgileri

## Kullanım

API dokümantasyonu için: http://localhost:8000/docs 