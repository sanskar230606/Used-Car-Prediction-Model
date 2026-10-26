from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    MetadataResponse,
    MetricsResponse,
    PredictionRequest,
    PredictionResponse,
)
from app.services.ml_service import ml_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade ML backend for predicting resale valuation of used cars in India.",
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
def health_check():
    """Liveness probe for backend service."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "model_loaded": ml_service.model is not None,
    }

@app.get("/api/metadata", response_model=MetadataResponse, tags=["Metadata"])
def get_metadata():
    """Retrieve dynamic categorical values and numeric feature ranges."""
    if not ml_service.metadata:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model metadata is unavailable.",
        )
    return ml_service.metadata

@app.get("/api/model-info", response_model=MetricsResponse, tags=["Analytics"])
def get_model_info():
    """Retrieve actual ML model evaluation metrics, R², MAE, RMSE, and hyperparameters."""
    if not ml_service.metrics:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model metrics are unavailable.",
        )
    return ml_service.metrics

@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_price(request: PredictionRequest):
    """
    Predict the valuation of a used car given its specifications using
    the genuine trained RandomForestRegressor pipeline.
    """
    try:
        response = ml_service.predict(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
