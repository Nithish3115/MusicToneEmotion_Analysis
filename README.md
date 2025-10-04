# 🎵 Music Emotion Recognition System

A full-stack application that analyzes audio files and predicts emotional characteristics using deep learning. The system provides real-time emotion analysis across **8 different dimensions**.

![Music Emotion Recognition](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)

---

## 🌟 Features

- 🎯 **Real-time Emotion Analysis** — Upload audio files and get instant emotion predictions  
- 📊 **8 Emotion Dimensions** — Analyzes valence, energy, tension, anger, fear, happiness, sadness, and tenderness  
- 🎨 **Modern UI** — Beautiful React interface with dark/light theme support  
- ⚡ **Fast Processing** — Optimized neural network for quick predictions  
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile devices  
- 🔄 **Real-time Updates** — Live processing status and results display  

---


## 🚀 Quick Start

### 🧩 Prerequisites

- **Python 3.10+**  
- **Node.js 18+**  
- **npm** or **yarn**

---

### 1. Clone Repository

```bash
git clone https://github.com/Nithish3115/MusicToneEmotion_Analysis.git
cd MusicToneEmotion_Analysis
```
### 2. Backend Setup

```bash

cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python -m app.main
```
Backend will be running at: http://localhost:8000

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be running at: http://localhost:5000

### 4. Open Application
Navigate to http://localhost:5000 in your browser and start analyzing audio files!


### 📁 Project Structure
```bash
music-emotion-recognition/
│
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/routes/        # API endpoints
│   │   ├── core/              # Core business logic
│   │   ├── models/            # ML models and preprocessing
│   │   └── main.py            # FastAPI application
│   ├── best.pth              # Trained model weights
│   ├── test_data/            # Sample audio files
│   └── requirements.txt      # Python dependencies
│
├── Frontend/                   # React + Express Frontend
│   ├── client/src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Application pages
│   │   ├── lib/              # API integration
│   │   └── hooks/            # Custom React hooks
│   ├── server/               # Express server
│   └── package.json          # Node.js dependencies
│
└── README.md                  # This file
```

## 🎯 API Endpoints

**Backend (FastAPI) — Port 8000**


| Method | Endpoint     | Description                              |
|--------|---------------|------------------------------------------|
| GET    | `/`           | API information                          |
| GET    | `/health/`    | Health check and model status            |
| POST   | `/predict/`   | Upload audio file for emotion analysis   |
| GET    | `/docs`       | Interactive API documentation            |

Example API Usage

```
# Health check
curl http://localhost:8000/health/

# Predict emotions
curl -X POST "http://localhost:8000/predict/" \
     -F "file=@path/to/audio.mp3"
```

## Response Format

```
{
  "success": true,
  "filename": "song.mp3",
  "emotions": {
    "valence": 5.23,
    "energy": 6.12,
    "tension": 3.45,
    "anger": 2.11,
    "fear": 1.87,
    "happy": 6.54,
    "sad": 2.34,
    "tender": 4.76
  },
  "processing_time": 1.2,
  "message": "Emotion prediction completed successfully"


}
```


### 🧠 Model Information

## Audio2EmotionModel Architecture

**Base:** VGG-style Convolutional Neural Network  

| Attribute       | Description                                |
|-----------------|--------------------------------------------|
| **Input**       | Audio spectrograms (256 × 1292)            |
| **Output**      | 8 emotion dimensions (scores 1.0 - 7.83)  |
| **Framework**   | PyTorch                                    |
| **Preprocessing** | Log spectrograms using librosa           |


## 🎭 Emotion Dimensions

| Emotion  | Description                  | Range       |
|----------|------------------------------|------------|
| Valence  | Positive vs. Negative emotion | 1.0 - 7.83 |
| Energy   | High vs. Low energy level     | 1.0 - 7.83 |
| Tension  | Stress vs. Relaxation         | 1.0 - 7.83 |
| Anger    | Anger intensity               | 1.0 - 7.83 |
| Fear     | Fear level                    | 1.0 - 7.83 |
| Happy    | Happiness level               | 1.0 - 7.83 |
| Sad      | Sadness level                 | 1.0 - 7.83 |
| Tender   | Tenderness level              | 1.0 - 7.83 |


## 🎵 Supported Audio Formats

| Format | Extension  |
|--------|-----------|
| MP3    | .mp3      |
| WAV    | .wav      |
| FLAC   | .flac     |
| M4A    | .m4a      |
| OGG    | .ogg      |

**Maximum file size:** 50MB


### 🛠️ Technology Stack

## 🖥️ Backend

| Technology | Description                        |
|------------|------------------------------------|
| FastAPI    | Modern Python web framework        |
| PyTorch    | Deep learning framework            |
| Librosa    | Audio processing library           |
| Uvicorn    | ASGI server                        |
| Pydantic   | Data validation                    |

## 🌐 Frontend

| Technology       | Description                        |
|-----------------|------------------------------------|
| React 18         | UI library                         |
| TypeScript       | Type-safe JavaScript               |
| TanStack Query   | Server state management            |
| Tailwind CSS     | Utility-first CSS                  |
| Shadcn/ui        | Modern UI components               |
| Vite             | Build tool                         |
| Express.js       | Node.js server                     |


### 🎨 UI Components

| Feature                   | Description                                      |
|---------------------------|--------------------------------------------------|
| 🌙 Dark/Light Theme        | Toggle between themes with persistence          |
| 📤 Drag & Drop Upload      | Intuitive file upload interface                 |
| 📊 Emotion Cards           | Visual representation of emotion scores        |
| ⏱️ Real-time Processing     | Live updates during analysis                    |
| 📱 Responsive Design       | Mobile-friendly interface                        |
| 🔔 Toast Notifications     | User feedback for actions                        |


### 🧪 Testing

Backend Testing
```
cd backend
python -m pytest tests/
```
Frontend Testing
```
cd Frontend
npm test
```

Manual Testing
```
# Test with sample audio file
curl -X POST "http://localhost:8000/predict/" \
     -F "file=@backend/test_data/Valence.mp3"
```


### 🔧 Configuration

Environment Variables
Create .env files in both backend and frontend directories:

## Backend .env:
```
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
MODEL_PATH=best.pth
LOG_LEVEL=INFO
```

## Frontend .env:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 📈 Performance

| Metric                    | Details                                    |
|----------------------------|--------------------------------------------|
| Model Inference            | ~1-3 seconds per audio file               |
| Memory Usage               | ~500MB (with loaded model)                |
| Supported Concurrent Users | 10+ (depending on hardware)               |
| Audio Processing           | Real-time for files up to 50MB            |



### 🤝 Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request


### 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 🙏 Acknowledgments

- **Original Research:** Jeffrey Luo, Monta Vista High School  
- **Audio Processing:** Built with Librosa  
- **UI Components:** Powered by Shadcn/ui  
- **Model Architecture:** Inspired by VGG networks  

---

### 📦 Release Notes v1.0.0

✅ Initial release with full-stack implementation  
✅ 8-dimension emotion analysis  
✅ Modern React UI with theme support  
✅ Real-time processing and results display  

Made with ❤️ for music emotion analysis


