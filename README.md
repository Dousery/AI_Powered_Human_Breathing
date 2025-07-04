# 🫁 COPD Prediction - AI-Powered Health Application

A modern AI-powered web application for detecting **COPD (Chronic Obstructive Pulmonary Disease)** using sensor data, built with **FastAPI** (backend) and **React** (frontend).

---

## 🚀 Features

- 🤖 **AI-Powered Prediction**: Risk analysis using a trained machine learning model  
- 💻 **Modern Web Interface**: Responsive design with React + Tailwind CSS  
- 🔐 **Secure API**: Built with FastAPI  
- 📈 **Visual Analytics**: Interactive result charts via Recharts  
- 🩺 **Health Info**: Informative COPD-related content  
- 👨‍⚕️ **User-Friendly**: Simple and intuitive UI

---

## 🏗️ Project Structure

```
AI_Powered_Human_Breathing/
├── backend/                 # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── frontend/                # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── model/                   # Trained ML models
│   ├── best_model.joblib
│   ├── feature_selector.joblib
│   ├── scaler.joblib
│   └── selected_features.pkl
├── app_interface.py         # (Deprecated) Streamlit app
└── README.md                # This file
```

---

## 🛠️ Installation & Setup

### 🔧 Backend (FastAPI)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

> Runs at: [http://localhost:8000](http://localhost:8000)

---

### 🖥️ Frontend (React)

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start frontend
npm start
```

> Runs at: [http://localhost:3000](http://localhost:3000)

---

## 📊 API Endpoints

| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| GET    | `/`              | Homepage                       |
| GET    | `/health`        | Health check                   |
| POST   | `/predict`       | COPD prediction                |
| GET    | `/health-info`   | Information about COPD         |
| GET    | `/model-info`    | Details about ML model         |

---

## 🎯 How to Use

1. **Homepage**: Introduction to the app  
2. **Prediction**: Upload files and analyze:
   - `column1.txt`: Breath sensor data  
   - `column3.txt`: Audio sensor data  
   - `metadata.txt`: Patient info  
3. **Health Info**: Learn about COPD  
4. **About**: Team and project background

---

## 🔬 Technical Details

### AI Model
- **Type**: Ensemble Model  
- **Features**: 17 selected features  
- **Classes**: 3 (Normal, Moderate Risk, High Risk)  
- **Analysis Time**: < 30 seconds

### Input Data
- 📈 Breath sensor (pattern, force)
- 🔊 Audio sensor (breathing sounds)
- 🧍 Patient info (age, smoking)
- ⚙️ Signal processing (FFT, MFCC, statistics)

### Technology Stack

| Layer     | Tools                                              |
|-----------|----------------------------------------------------|
| Backend   | FastAPI, Python, Scikit-learn, NumPy, SciPy        |
| Frontend  | React, Tailwind CSS, Recharts, Axios               |
| AI/ML     | Ensemble models, Feature Engineering, Signal Processing |

---

## 🎨 UI Design

- **Theme**: Health & Respiratory
- **Colors**: Light blue, white
- **Responsive**: Mobile & Desktop ready
- **Style**: Clean, minimal, user-friendly

---

## 🤝 Contributing

We welcome contributions!  

```bash
# Fork the repo
# Create a new branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push your branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

Licensed under the **MIT License**.  
See `LICENSE` for more information.

---

## ⚠️ Disclaimer

> This app is **not intended for medical diagnosis**.  
> Results are for informational purposes only.  
> Always consult a healthcare professional for medical advice.

---

## 📞 Contact

For project-related inquiries:

- 🛠️ Technical Support: Backend & Frontend issues  
- 🩺 Health Questions: COPD-related content and suggestions

---

**COPD AI** – Empowering Health with Artificial Intelligence 🧠🫁
