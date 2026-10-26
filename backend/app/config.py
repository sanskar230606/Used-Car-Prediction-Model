import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Based Used Car Price Prediction & Valuation"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "ml", "artifacts")
    MODEL_PATH: str = os.path.join(ARTIFACTS_DIR, "car_price_model.joblib")
    METADATA_PATH: str = os.path.join(ARTIFACTS_DIR, "metadata.json")
    METRICS_PATH: str = os.path.join(ARTIFACTS_DIR, "metrics.json")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
