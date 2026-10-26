# AI-Based Used Car Price Prediction and Valuation System

An end-to-end Machine Learning web application designed to predict the fair resale valuation of used cars in the Indian automotive market in **Indian Rupees (₹)**. Built with a genuinely trained **Scikit-Learn Random Forest Regressor**, **FastAPI** backend, and an interactive **React + Vite + Tailwind CSS** frontend with **Recharts** data visualizations.

---

## 🌟 Key Features

- **Genuine Machine Learning Model**:
  - Algorithm: `RandomForestRegressor` with target log-transformation (`log1p`/`expm1`)
  - **Test $R^2$ Score**: **0.9799 (98.0% variance explained)**
  - **Mean Absolute Error (MAE)**: **₹63,920**
  - **Test MAPE**: **14.29%**
  - Dataset: 8,119 real automobile sales records from Indian car platforms
- **Full Preprocessing Pipeline**:
  - Handles string unit parsing (`kmpl`, `CC`, `bhp`)
  - `RobustScaler` for numerical attributes (resistant to outliers)
  - `OneHotEncoder(handle_unknown='ignore')` for categorical attributes
  - Fully serialized with `joblib` into a reusable inference pipeline
- **Interactive Visualizations (Recharts)**:
  - **Dynamic Depreciation Timeline**: Simulates model resale projections across manufacturing years
  - **Odometer Usage Impact**: Analyzes how kilometers driven discounts the vehicle
  - **Feature Importance Breakdown**: Real Gini importance weights from the trained ensemble
  - **Qualitative Driver Tags**: Explains value drivers vs depreciation discounts
- **Rich User Experience**:
  - Quick-test Presets (Swift, i20, City, Scorpio, BMW 3 Series)
  - Dual slider & number inputs for interactive adjustments
  - Indian Rupee (₹) denomination formatting (Lakhs & Crores)
  - College Viva / Model Analytics inspection modal

---

## 🏗️ Architecture & Technology Stack

```
AIML-mini-project/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI application & endpoints
│   │   ├── config.py                 # Pydantic configuration & CORS
│   │   ├── schemas.py                # Request/response validation models
│   │   ├── services/
│   │   │   └── ml_service.py         # Pipeline loader, inference, & dynamic curves
│   │   └── utils/
│   │       └── formatters.py         # Indian Rupee (₹) formatter
│   ├── ml/
│   │   ├── data/
│   │   │   ├── raw/car_details_v3.csv# Authentic 8,100+ car listing dataset
│   │   │   └── processed/cleaned_cars.csv
│   │   ├── artifacts/
│   │   │   ├── car_price_model.joblib# Serialized Scikit-Learn Pipeline
│   │   │   ├── metadata.json         # Feature distributions & bounds
│   │   │   └── metrics.json          # Authentic evaluation metrics
│   │   ├── clean_data.py             # Data parsing & feature engineering
│   │   └── train.py                  # Model training & metrics export
│   ├── requirements.txt              # Backend dependencies
│   ├── run.sh                        # Fast startup script
│   └── venv/                         # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js             # API communication client
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header & Model Analytics trigger
│   │   │   ├── ModelMetricsModal.jsx # Academic ML evaluation dashboard
│   │   │   ├── CarInputForm.jsx      # Sliders, cascading dropdowns, presets
│   │   │   ├── ValuationCard.jsx     # Hero valuation card & confidence range
│   │   │   ├── DepreciationChart.jsx # Recharts area chart
│   │   │   ├── MileageImpactChart.jsx# Recharts usage curve
│   │   │   ├── FeatureImportanceChart.jsx # Bar chart of feature weights
│   │   │   └── FeatureInsights.jsx   # Explainable AI tags
│   │   ├── utils/currency.js         # Indian Rupee formatter
│   │   ├── App.jsx                   # Main dashboard layout
│   │   └── index.css                 # Tailwind & glassmorphism styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                          # VITE_API_BASE_URL=http://localhost:8000
└── README.md
```

---

## 🚀 Quick Start Guide (macOS)

### 1. Backend Setup & Run

Open a terminal window and navigate to the project root:

```bash
cd backend

# The virtual environment is pre-configured. To launch:
./run.sh
```

Alternatively, launch manually:
```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Backend Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend Setup & Run

Open a second terminal window:

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

- **Frontend Application**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Retraining the Machine Learning Model

If you wish to re-run the end-to-end data processing and model training:

```bash
cd backend
source venv/bin/activate

# Step 1: Clean raw CSV and extract units (kmpl, CC, bhp)
python3 ml/clean_data.py

# Step 2: Train RandomForestRegressor with TransformedTargetRegressor
python3 ml/train.py
```

The script outputs training and validation metrics, and updates `car_price_model.joblib`, `metadata.json`, and `metrics.json`.

---

## 📊 Model Evaluation Summary

| Metric | Score | Note |
|---|---|---|
| **$R^2$ Score (Test)** | **0.9799 (98.0%)** | Explains 98% of price variance |
| **$R^2$ Score (Train)** | **0.9871 (98.7%)** | Consistent, low variance |
| **Mean Absolute Error (MAE)** | **₹63,920** | Average absolute deviation |
| **MAPE** | **14.29%** | Highly accurate across price tiers |
| **RMSE** | **₹1,18,476** | Low root-mean-square error |
| **Total Samples** | **8,119** | 80% Train (6,495), 20% Test (1,624) |
