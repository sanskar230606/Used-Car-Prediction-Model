"""
Data cleaning and feature engineering script for Used Car Price Prediction.
"""
import os
import re
import numpy as np
import pandas as pd

RAW_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "car_details_v3.csv")
PROCESSED_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "processed", "cleaned_cars.csv")

def extract_number(val):
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip()
    match = re.search(r"([0-9]+(?:\.[0-9]+)?)", val_str)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return np.nan
    return np.nan

def clean_data(input_path=RAW_DATA_PATH, output_path=PROCESSED_DATA_PATH):
    print(f"Loading raw data from: {input_path}")
    df = pd.read_csv(input_path)
    initial_shape = df.shape
    print(f"Initial shape: {initial_shape}")

    # 1. Extract brand and model from 'name'
    df["brand"] = df["name"].apply(lambda x: str(x).split()[0].strip())
    df["model"] = df["name"].apply(lambda x: str(x).split()[1].strip() if len(str(x).split()) > 1 else "Other")

    # Group rare brands (< 5 cars) into 'Other'
    brand_counts = df["brand"].value_counts()
    valid_brands = brand_counts[brand_counts >= 5].index.tolist()
    df["brand"] = df["brand"].apply(lambda b: b if b in valid_brands else "Other")

    # Group rare models (< 5 cars) into 'Other'
    model_counts = df["model"].value_counts()
    valid_models = model_counts[model_counts >= 5].index.tolist()
    df["model"] = df["model"].apply(lambda m: m if m in valid_models else "Other")

    # 2. Extract numeric values from strings
    df["mileage_num"] = df["mileage"].apply(extract_number)
    df["engine_num"] = df["engine"].apply(extract_number)
    df["max_power_num"] = df["max_power"].apply(extract_number)

    # 3. Handle seats
    df["seats_num"] = pd.to_numeric(df["seats"], errors="coerce")

    # 4. Filter obvious outliers / bad data
    # Selling price between 30,000 and 1.5 Crore
    df = df[(df["selling_price"] >= 25000) & (df["selling_price"] <= 15000000)].copy()
    # km_driven between 500 and 500,000 km
    df = df[(df["km_driven"] >= 500) & (df["km_driven"] <= 500000)].copy()
    # year between 1995 and 2024
    df = df[(df["year"] >= 1995) & (df["year"] <= 2024)].copy()

    # 5. Impute missing values smartly using median by (brand, model) or overall median
    for col in ["mileage_num", "engine_num", "max_power_num", "seats_num"]:
        overall_median = df[col].median()
        df[col] = df.groupby(["brand", "model"])[col].transform(lambda x: x.fillna(x.median()))
        df[col] = df[col].fillna(overall_median)

    # Convert seats and engine to clean int
    df["seats"] = df["seats_num"].round().astype(int)
    df["engine"] = df["engine_num"].round().astype(int)
    df["mileage"] = df["mileage_num"].round(2)
    df["max_power"] = df["max_power_num"].round(2)

    # Drop intermediate columns
    df = df.drop(columns=["mileage_num", "engine_num", "max_power_num", "seats_num", "torque"])

    # 6. Normalize categories
    df["fuel"] = df["fuel"].str.strip().str.capitalize()
    df["seller_type"] = df["seller_type"].str.strip()
    df["transmission"] = df["transmission"].str.strip().str.capitalize()
    df["owner"] = df["owner"].str.strip()

    # Create processed directory if not exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Cleaned dataset saved to: {output_path}")
    print(f"Final shape: {df.shape}")
    print(df.head(3))
    return df

if __name__ == "__main__":
    clean_data()
