from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    brand: str = Field(..., description="Automobile manufacturer (e.g. Hyundai, Maruti, Honda)")
    model: str = Field(..., description="Car model name (e.g. i20, Swift, City)")
    year: int = Field(..., ge=1995, le=2026, description="Manufacturing year")
    km_driven: int = Field(..., ge=100, le=500000, description="Total kilometers driven")
    fuel: str = Field(..., description="Fuel type (Petrol, Diesel, CNG, LPG)")
    seller_type: str = Field(..., description="Seller category (Individual, Dealer, Trustmark Dealer)")
    transmission: str = Field(..., description="Transmission type (Manual, Automatic)")
    owner: str = Field(..., description="Ownership status (First Owner, Second Owner, etc.)")
    mileage: float = Field(..., ge=5.0, le=45.0, description="Fuel efficiency in kmpl or km/kg")
    engine: int = Field(..., ge=600, le=6000, description="Engine displacement in CC")
    max_power: float = Field(..., ge=25.0, le=600.0, description="Maximum power in bhp")
    seats: int = Field(..., ge=2, le=14, description="Seating capacity")

class PriceRange(BaseModel):
    low: float
    high: float
    formatted_low: str
    formatted_high: str

class DepreciationPoint(BaseModel):
    year: int
    age: int
    estimated_price: float
    formatted_price: str

class MileagePoint(BaseModel):
    km_driven: int
    estimated_price: float
    formatted_price: str

class FeatureContribution(BaseModel):
    feature: str
    impact: str
    description: str

class PredictionResponse(BaseModel):
    predicted_price: float
    formatted_price: str
    formatted_exact: str
    price_range: PriceRange
    depreciation_curve: List[DepreciationPoint]
    mileage_curve: List[MileagePoint]
    feature_contributions: List[FeatureContribution]
    input_summary: Dict[str, Any]

class MetadataResponse(BaseModel):
    dataset_size: int
    brands: List[str]
    brand_models: Dict[str, List[str]]
    fuel_types: List[str]
    seller_types: List[str]
    transmissions: List[str]
    owners: List[str]
    ranges: Dict[str, Dict[str, Any]]
    feature_importances: List[Dict[str, Any]]

class MetricsResponse(BaseModel):
    train_r2: float
    test_r2: float
    test_mae: float
    test_rmse: float
    test_mape: float
    train_samples: int
    test_samples: int
    total_samples: int
    algorithm: str
    hyperparameters: Dict[str, Any]
