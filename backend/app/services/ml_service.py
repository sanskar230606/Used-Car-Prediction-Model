import json
import os
import joblib
import numpy as np
import pandas as pd
from app.config import settings
from app.schemas import (
    DepreciationPoint,
    FeatureContribution,
    MileagePoint,
    PredictionRequest,
    PredictionResponse,
    PriceRange,
)
from app.utils.formatters import format_inr, format_inr_exact

class MLService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.metrics = None
        self.load_artifacts()

    def load_artifacts(self):
        if os.path.exists(settings.MODEL_PATH):
            self.model = joblib.load(settings.MODEL_PATH)
            print(f"Loaded trained ML pipeline from: {settings.MODEL_PATH}")
        else:
            raise FileNotFoundError(f"Model file not found at {settings.MODEL_PATH}. Train the model first.")

        if os.path.exists(settings.METADATA_PATH):
            with open(settings.METADATA_PATH, "r") as f:
                self.metadata = json.load(f)
            print(f"Loaded metadata from: {settings.METADATA_PATH}")
        else:
            raise FileNotFoundError(f"Metadata file not found at {settings.METADATA_PATH}.")

        if os.path.exists(settings.METRICS_PATH):
            with open(settings.METRICS_PATH, "r") as f:
                self.metrics = json.load(f)
            print(f"Loaded metrics from: {settings.METRICS_PATH}")
        else:
            raise FileNotFoundError(f"Metrics file not found at {settings.METRICS_PATH}.")

    def _build_dataframe(self, data_dict: dict) -> pd.DataFrame:
        """Create single or multi-row DataFrame with required columns."""
        cols = [
            "year",
            "km_driven",
            "mileage",
            "engine",
            "max_power",
            "seats",
            "brand",
            "model",
            "fuel",
            "seller_type",
            "transmission",
            "owner",
        ]
        return pd.DataFrame([data_dict])[cols]

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        base_dict = req.model_dump()
        df = self._build_dataframe(base_dict)

        # 1. Primary Prediction
        raw_pred = float(self.model.predict(df)[0])
        # Ensure positive and rounded
        predicted_price = max(15000.0, round(raw_pred, -2))

        # 2. Valuation Range (using empirical model error band ±8.5%)
        error_ratio = 0.085
        low_val = max(10000.0, round(predicted_price * (1 - error_ratio), -2))
        high_val = round(predicted_price * (1 + error_ratio), -2)

        # 3. Dynamic Depreciation Simulation using genuine model predictions
        # Evaluate car value across different manufacturing years
        current_year = 2024
        target_years = sorted(list(set([
            max(2005, req.year - 4),
            max(2006, req.year - 2),
            req.year,
            min(2022, req.year + 2),
            min(2024, req.year + 4)
        ])))

        depreciation_curve: list[DepreciationPoint] = []
        for yr in target_years:
            temp_dict = base_dict.copy()
            temp_dict["year"] = yr
            temp_df = self._build_dataframe(temp_dict)
            sim_pred = float(self.model.predict(temp_df)[0])
            sim_pred = max(10000.0, round(sim_pred, -2))
            depreciation_curve.append(
                DepreciationPoint(
                    year=yr,
                    age=current_year - yr,
                    estimated_price=sim_pred,
                    formatted_price=format_inr(sim_pred)
                )
            )

        # Sort chronologically
        depreciation_curve.sort(key=lambda x: x.year)

        # 4. Dynamic Mileage Impact Curve (varying km_driven)
        milestones = [15000, 40000, 75000, 110000, 160000]
        if req.km_driven not in milestones:
            milestones.append(req.km_driven)
        milestones.sort()

        mileage_curve: list[MileagePoint] = []
        for km in milestones:
            temp_dict = base_dict.copy()
            temp_dict["km_driven"] = km
            temp_df = self._build_dataframe(temp_dict)
            sim_pred = float(self.model.predict(temp_df)[0])
            sim_pred = max(10000.0, round(sim_pred, -2))
            mileage_curve.append(
                MileagePoint(
                    km_driven=km,
                    estimated_price=sim_pred,
                    formatted_price=format_inr(sim_pred)
                )
            )

        # 5. Explanatory Feature Contributions
        contributions: list[FeatureContribution] = []
        median_year = self.metadata["ranges"]["year"]["median"]
        if req.year > median_year:
            contributions.append(
                FeatureContribution(
                    feature="Manufacturing Year",
                    impact="Positive",
                    description=f"Newer model ({req.year}) commands a strong price premium over older cohort."
                )
            )
        else:
            contributions.append(
                FeatureContribution(
                    feature="Manufacturing Year",
                    impact="Depreciation",
                    description=f"Age discount reflects normal vehicle wear and generational depreciation."
                )
            )

        median_power = self.metadata["ranges"]["max_power"]["median"]
        if req.max_power >= median_power * 1.15:
            contributions.append(
                FeatureContribution(
                    feature="Engine Output & Power",
                    impact="High Positive",
                    description=f"{req.max_power} bhp delivers strong performance tier valuation."
                )
            )
        else:
            contributions.append(
                FeatureContribution(
                    feature="Engine Output & Power",
                    impact="Neutral / Moderate",
                    description=f"Standard power output ({req.max_power} bhp) oriented toward commuter efficiency."
                )
            )

        median_km = self.metadata["ranges"]["km_driven"]["median"]
        if req.km_driven < median_km * 0.7:
            contributions.append(
                FeatureContribution(
                    feature="Odometer Reading",
                    impact="Positive",
                    description=f"Low mileage ({req.km_driven:,} km) significantly increases buyer appeal."
                )
            )
        elif req.km_driven > median_km * 1.4:
            contributions.append(
                FeatureContribution(
                    feature="Odometer Reading",
                    impact="Depreciation",
                    description=f"High mileage ({req.km_driven:,} km) leads to increased maintenance factor discount."
                )
            )
        else:
            contributions.append(
                FeatureContribution(
                    feature="Odometer Reading",
                    impact="Neutral",
                    description=f"Average usage pattern for its class and age category."
                )
            )

        if req.transmission.lower() == "automatic":
            contributions.append(
                FeatureContribution(
                    feature="Transmission",
                    impact="Positive",
                    description="Automatic transmission commands higher resale liquidity and urban demand."
                )
            )

        return PredictionResponse(
            predicted_price=predicted_price,
            formatted_price=format_inr(predicted_price),
            formatted_exact=format_inr_exact(predicted_price),
            price_range=PriceRange(
                low=low_val,
                high=high_val,
                formatted_low=format_inr(low_val),
                formatted_high=format_inr(high_val),
            ),
            depreciation_curve=depreciation_curve,
            mileage_curve=mileage_curve,
            feature_contributions=contributions,
            input_summary=base_dict,
        )

ml_service = MLService()
