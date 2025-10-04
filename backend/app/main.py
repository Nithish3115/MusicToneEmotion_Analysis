from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.routes import health, prediction

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        # Load model on startup through the prediction router
        prediction.model_handler.load_model(settings.model_path)
        print("🚀 Server started successfully!")
    except Exception as e:
        print(f"❌ Failed to start server: {str(e)}")
        raise
    
    yield
    
    # Shutdown
    print("🛑 Server shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title=settings.api_title,
    description="Upload audio files to get emotion predictions",
    version=settings.api_version,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(prediction.router)

@app.get("/")
async def root():
    return {
        "message": settings.api_title,
        "status": "running",
        "version": settings.api_version,
        "endpoints": {
            "predict": "POST /predict - Upload audio file to get emotion predictions",
            "health": "GET /health - Check API health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Music Emotion Recognition API...")
    uvicorn.run("app.main:app", host=settings.api_host, port=settings.api_port, reload=settings.debug)