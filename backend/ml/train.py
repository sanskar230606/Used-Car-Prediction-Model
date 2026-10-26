"""
Model training pipeline for Used Car Price Prediction.
Trains a Scikit-Learn RandomForestRegressor with log-transformed target and full preprocessing.
Saves model artifacts, metadata, and evaluation metrics.
"""
import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "processed", "cleaned_cars.csv")
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "car_price_model.joblib")
METADATA_PATH = os.path.join(ARTIFACTS_DIR, "metadata.json")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "metrics.json")

NUMERICAL_FEATURES = ["year", "km_driven", "mileage", "engine", "max_power", "seats"]
CATEGORICAL_FEATURES = ["brand", "model", "fuel", "seller_type", "transmission", "owner"]
TARGET_COLUMN = "selling_price"

def train():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    print(f"Loading processed data from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES].copy()
    y = df[TARGET_COLUMN].copy()

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")

    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", RobustScaler(), NUMERICAL_FEATURES),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
        ],
        remainder="drop",
    )

    # Base Random Forest Regressor
    rf_regressor = RandomForestRegressor(
        n_estimators=180,
        max_depth=22,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    # Pipeline with Target Log Transform (guarantees positive values & realistic pricing)
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "model",
                TransformedTargetRegressor(
                    regressor=rf_regressor,
                    func=np.log1p,
                    inverse_func=np.expm1,
                ),
            ),
        ]
    )

    print("Fitting model pipeline...")
    pipeline.fit(X_train, y_train)

    # Predictions & Metrics
    y_pred_train = pipeline.predict(X_train)
    y_pred_test = pipeline.predict(X_test)

    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    test_mape = mean_absolute_percentage_error(y_test, y_pred_test) * 100

    print("=== MODEL PERFORMANCE ===")
    print(f"Train R²: {train_r2:.4f}")
    print(f"Test R²:  {test_r2:.4f}")
    print(f"Test MAE: ₹{test_mae:,.2f}")
    print(f"Test RMSE: ₹{test_rmse:,.2f}")
    print(f"Test MAPE: {test_mape:.2f}%")

    # Extract Feature Importances
    fitted_model = pipeline.named_steps["model"].regressor_
    ohe = pipeline.named_steps["preprocessor"].named_transformers_["cat"]
    cat_feature_names = ohe.get_feature_names_out(CATEGORICAL_FEATURES)
    all_feature_names = NUMERICAL_FEATURES + list(cat_feature_names)
    importances = fitted_model.feature_importances_

    # Aggregate importance by high-level group
    grouped_importance = {
        "max_power": 0.0,
        "year": 0.0,
        "engine": 0.0,
        "km_driven": 0.0,
        "brand": 0.0,
        "transmission": 0.0,
        "mileage": 0.0,
        "fuel": 0.0,
        "seats": 0.0,
        "model": 0.0,
        "owner": 0.0,
        "seller_type": 0.0,
    }

    for name, imp in zip(all_feature_names, importances):
        for group in grouped_importance.keys():
            if name == group or name.startswith(group + "_"):
                grouped_importance[group] += float(imp)
                break

    sorted_importance = [
        {"feature": k, "importance": round(v * 100, 2)}
        for k, v in sorted(grouped_importance.items(), key=lambda x: x[1], reverse=True)
    ]

    # Save Pipeline Artifact
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved model pipeline to: {MODEL_PATH}")

    # Build brand -> models hierarchy and range limits for metadata
    brand_models = {}
    for brand, group in df.groupby("brand"):
        top_models = group["model"].value_counts().index.tolist()
        brand_models[brand] = top_models

    metadata = {
        "dataset_size": len(df),
        "brands": sorted(df["brand"].unique().tolist()),
        "brand_models": brand_models,
        "fuel_types": sorted(df["fuel"].unique().tolist()),
        "seller_types": sorted(df["seller_type"].unique().tolist()),
        "transmissions": sorted(df["transmission"].unique().tolist()),
        "owners": [
            "First Owner",
            "Second Owner",
            "Third Owner",
            "Fourth & Above Owner",
            "Test Drive Car",
        ],
        "ranges": {
            "year": {"min": int(df["year"].min()), "max": int(df["year"].max()), "median": int(df["year"].median())},
            "km_driven": {"min": int(df["km_driven"].min()), "max": int(df["km_driven"].max()), "median": int(df["km_driven"].median())},
            "mileage": {"min": float(df["mileage"].min()), "max": float(df["mileage"].max()), "median": float(df["mileage"].median())},
            "engine": {"min": int(df["engine"].min()), "max": int(df["engine"].max()), "median": int(df["engine"].median())},
            "max_power": {"min": float(df["max_power"].min()), "max": float(df["max_power"].max()), "median": float(df["max_power"].median())},
            "seats": {"min": int(df["seats"].min()), "max": int(df["seats"].max()), "median": int(df["seats"].median())},
        },
        "feature_importances": sorted_importance,
    }

    metrics = {
        "train_r2": round(train_r2, 4),
        "test_r2": round(test_r2, 4),
        "test_mae": round(test_mae, 2),
        "test_rmse": round(test_rmse, 2),
        "test_mape": round(test_mape, 2),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "total_samples": len(df),
        "algorithm": "RandomForestRegressor (Log-Transformed Target)",
        "hyperparameters": {
            "n_estimators": 180,
            "max_depth": 22,
            "min_samples_split": 4,
            "min_samples_leaf": 2,
            "random_state": 42,
        },
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {METADATA_PATH}")

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved metrics to: {METRICS_PATH}")

if __name__ == "__main__":
    train()
