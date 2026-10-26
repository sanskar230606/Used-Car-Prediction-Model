# Project Description & Academic Blueprint
## AI-Based Used Car Price Prediction and Valuation System Using Machine Learning

---

## 1. Project Overview & Meta Information

- **Project Title**: AI-Based Used Car Price Prediction and Valuation System Using Machine Learning
- **Application Name**: AutoValuate.ai
- **Domain**: Artificial Intelligence, Machine Learning, Applied Data Science, Full-Stack Web Development
- **Target Currency**: Indian Rupees (₹) with Indian Numbering System formatting (Lakhs & Crores)

### Project Team Members
| Sr. No. | Student Name | Roll / Registration No. | Role Allocation |
|---|---|---|---|
| 1 | **Prem Jagtap** | **24123082** | Machine Learning Modeling, Pipeline Optimization & Evaluation |
| 2 | **Sanskar Chavare** | **24113050** | Full-Stack Integration, FastAPI Backend & API Architecture |
| 3 | **Krish Gurjelwar** | **24113068** | Data Preprocessing, Regex Unit Extraction & Feature Engineering |
| 4 | **Rajwardhan Abdule** | **24113021** | Frontend UI/UX, Dynamic Recharts Visualizations & State Management |

---

## 2. Abstract & Problem Statement

### Problem Statement
The Indian pre-owned automobile sector is largely unorganized and fraught with information asymmetry. Traditional car valuation relies on subjective dealer inspections, speculative markup, or outdated thumb rules that fail to account for non-linear depreciation, odometer usage, and brand-specific equity. Buyers often overpay, while individual sellers lose value due to unfair dealer margins.

### Proposed Solution
**AutoValuate.ai** provides an automated, objective, and data-driven car valuation platform. By training a high-performance ensemble **Random Forest Regressor** on a verified real-world dataset of **8,119 Indian car listings**, the system delivers instant fair market estimates. Rather than outputting a single static price, it calculates a **realistic valuation interval (±8.5% confidence)**, simulates a **7-year dynamic depreciation timeline**, generates an **odometer usage penalty curve**, and ranks the **Gini feature importance weights** driving the valuation.

---

## 3. Technology Stack & Component Justifications

### Backend & Machine Learning
- **Language**: Python 3.15
- **Framework**: **FastAPI** (asynchronous, automatic OpenAPI documentation, high concurrency)
- **Data Processing**: **Pandas** and **NumPy** (vectorized cleaning, regex parsing, matrix calculations)
- **Machine Learning Library**: **Scikit-Learn (v1.9+)**
  - `RandomForestRegressor`: Ensemble of 180 decision trees for variance reduction and non-linear regression.
  - `TransformedTargetRegressor`: Wraps target in $\ln(1 + y)$ and inverts with $\exp(y) - 1$.
  - `ColumnTransformer`: Combines numeric and categorical pipelines without data leakage.
  - `RobustScaler`: Scaler based on median and IQR to resist extreme mileage and horsepower outliers.
  - `OneHotEncoder(handle_unknown='ignore')`: Handles unseen model variants smoothly.
- **Model Persistence**: **Joblib** (binary serialization of complete preprocessing and model pipeline)
- **Data Validation**: **Pydantic v2** (strict type constraints, range limits, schema validation)
- **Server**: **Uvicorn** (production ASGI server with reload support)

### Frontend & Data Visualization
- **Framework**: **React 18** scaffolded with **Vite** (fast Hot Module Replacement, modular SPA)
- **Language**: JavaScript (ES6+)
- **Styling**: **Tailwind CSS (v3.4+)** (custom enterprise dark-mode theme, `#090d16` canvas, `#0d131f` card surfaces)
- **Data Visualizations**: **Recharts**
  - Dynamic Depreciation Timeline (`AreaChart`)
  - Usage / Kilometer Impact Curve (`LineChart`)
  - Feature Importance Breakdown (`BarChart`, horizontal layout)
- **Iconography**: **Lucide React** (clean vector automotive and analytics icons)

---

## 4. Dataset & Data Engineering Details

### Dataset Source
- Real Indian used car transaction records based on marketplace listings (`Car details v3.csv`).
- **Initial record count**: 8,128 rows.
- **Cleaned training sample count**: 8,119 rows (80% train = 6,495, 20% test = 1,624).

### Raw Attributes & Sanitization (`backend/ml/clean_data.py`)
1. **`name` $\to$ `brand` & `model`**:
   - Splits vehicle name into manufacturer brand (Maruti, Hyundai, Honda, Toyota, BMW, etc.) and model series (Swift, i20, City, Scorpio, 3-Series).
   - Rare brands and models with fewer than 5 occurrences are clustered under `"Other"` to mitigate high-cardinality noise.
2. **String Unit Extraction via Regex**:
   - `mileage`: e.g. `"23.4 kmpl"` or `"17.3 km/kg"` $\to$ extracted numeric float `23.40`.
   - `engine`: e.g. `"1248 CC"` $\to$ extracted numeric integer `1248`.
   - `max_power`: e.g. `"74 bhp"` $\to$ extracted numeric float `74.0` (handles edge cases like standalone `"bhp"` by coercing to `NaN`).
   - `seats`: parsed to numeric integer.
3. **Smart Group-Wise Imputation**:
   - Missing technical specs (~2.7% of rows) are imputed using the **median of that specific `(brand, model)` group**. If unavailable, the overall dataset median is used.
4. **Outlier Boundaries**:
   - `selling_price`: Filtered between ₹25,000 and ₹1.5 Crore.
   - `km_driven`: Filtered between 500 km and 500,000 km.
   - `year`: Filtered between 1995 and 2024.

---

## 5. Machine Learning Methodology & Mathematical Formulation

### 5.1. Log-Transformed Target Regression
Car prices exhibit strong right-skewness (positive skew). Applying standard Mean Squared Error (MSE) on raw rupee values leads to over-penalizing luxury cars and under-predicting budget hatchbacks, with the catastrophic risk of negative price predictions for older vehicles.

**Solution**:
1. Target transformation:
   $$y_{\text{train\_trans}} = \ln(1 + y)$$
2. The Random Forest fits on $y_{\text{train\_trans}}$.
3. On prediction, outputs are exponentiated:
   $$\hat{y} = \exp(\hat{y}_{\text{pred}}) - 1$$

**Benefits**:
- Strictly guarantees positive valuation ($\hat{y} > 0$).
- Models natural exponential compound depreciation.
- Minimizes relative percentage error (MAPE) proportionally across all vehicle segments.

### 5.2. Hyperparameter Configuration
```python
RandomForestRegressor(
    n_estimators=180,       # 180 trees to stabilize bagging variance
    max_depth=22,           # Captures complex brand-engine-age interactions
    min_samples_split=4,    # Guards against fitting individual outliers
    min_samples_leaf=2,     # Smooths predictions at tree leaf nodes
    random_state=42,        # Deterministic reproducibility
    n_jobs=-1               # Multi-threaded parallel training
)
```

### 5.3. Verified Empirical Evaluation Metrics

| Metric | Score | Interpretation |
|---|---|---|
| **Test $R^2$ Score** | **0.9799 (98.0%)** | Explains 98.0% of price variance on unseen test data |
| **Train $R^2$ Score** | **0.9871 (98.7%)** | High stability; minimal overfitting gap |
| **Mean Absolute Error (MAE)** | **₹63,920** | Average absolute deviation is only ~₹64k across wide price spectrum |
| **Mean Absolute % Error (MAPE)** | **14.29%** | Average percentage error across all price brackets is under 15% |
| **Root Mean Squared Error (RMSE)** | **₹1,18,476** | Strong penalization against extreme prediction blunders |
| **Dataset Split** | **80% / 20%** | 6,495 training rows, 1,624 test evaluation rows |

### 5.4. Feature Importance Weights (Gini Impurity)
1. **Manufacturing Year (Age)**: **48.6%** (Primary driver due to vehicular wear and Indian RTO scrap limits)
2. **Engine Output (Max Power in bhp)**: **38.2%** (Distinguishes commuter cars from luxury/sports tiers)
3. **Engine Displacement (CC)**: **4.6%**
4. **Model Variant**: **2.4%**
5. **Kilometers Driven (Usage)**: **2.1%** (Acts as an intra-tier discount factor)
6. **Brand / Manufacturer**: **1.8%**
7. **Fuel Economy (Mileage kmpl)**: **1.2%**
8. **Transmission, Fuel Type, Owner, Seats**: **1.1%**

---

## 6. Full-Stack System Architecture & API Contract

### Project File Structure
```
AIML-mini-project/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI routing, CORS & exception handling
│   │   ├── config.py                 # Pydantic Settings & artifact path definitions
│   │   ├── schemas.py                # Pydantic request & response validation schemas
│   │   ├── services/
│   │   │   └── ml_service.py         # Pipeline loading, live inference, curve simulations
│   │   └── utils/
│   │       └── formatters.py         # Indian Rupee (₹) Lakhs/Crores formatting logic
│   ├── ml/
│   │   ├── data/
│   │   │   ├── raw/car_details_v3.csv# Authentic 8,100+ car listing dataset
│   │   │   └── processed/cleaned_cars.csv
│   │   ├── artifacts/
│   │   │   ├── car_price_model.joblib# Serialized Scikit-Learn Pipeline bundle
│   │   │   ├── metadata.json         # Feature distributions, bounds, brand-model mappings
│   │   │   └── metrics.json          # Authentic model evaluation metrics
│   │   ├── clean_data.py             # Data parsing, regex unit extraction, imputation
│   │   └── train.py                  # Pipeline fitting, metric calculation, artifact serialization
│   ├── requirements.txt              # Backend dependencies
│   ├── run.sh                        # One-command macOS backend startup script
│   └── venv/                         # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js             # API communication client with error handling
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Sleek enterprise header with live model status
│   │   │   ├── ModelMetricsModal.jsx # College viva dashboard with genuine R², MAE, RMSE
│   │   │   ├── CarInputForm.jsx      # Sliders, cascading brand-model dropdowns, presets
│   │   │   ├── ValuationCard.jsx     # Valuation hero card with 3-tier market spread meter
│   │   │   ├── AnalyticsTabs.jsx     # Unified tabbed analytics station
│   │   │   ├── DepreciationChart.jsx # Recharts area chart for multi-year depreciation
│   │   │   ├── MileageImpactChart.jsx# Recharts line chart for odometer usage curve
│   │   │   ├── FeatureImportanceChart.jsx # Recharts horizontal bar chart of Gini weights
│   │   │   └── FeatureInsights.jsx   # Explainable AI tags (Value Enhancers vs Depreciation)
│   │   ├── utils/currency.js         # Indian Rupee formatter (Lakhs & Crores)
│   │   ├── App.jsx                   # Main application layout and state management
│   │   └── index.css                 # Tailwind CSS directives and custom styling
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                          # VITE_API_BASE_URL=http://localhost:8000
│
├── README.md                         # Project documentation and execution instructions
├── report.md                         # Comprehensive academic report
└── description.md                    # Project blueprint and team reference document
```

### Key API Endpoints
1. **`GET /health`**: Health probe verifying backend status and ML model memory residency.
2. **`GET /api/metadata`**: Dynamic schema returning brand list, cascading brand-to-model map, fuel types, transmissions, and slider min/max/median limits.
3. **`GET /api/model-info`**: Supplies authentic training metrics ($R^2$, MAE, RMSE, MAPE, hyperparameters, train/test counts) to populate the frontend modal.
4. **`POST /api/predict`**: Accepts complete vehicle specs, executes pipeline inference, calculates confidence bounds (±8.5%), and performs dynamic multi-point simulation for depreciation and mileage curves.

---

## 7. Interactive Frontend Features & User Experience

1. **Enterprise Modern Dark-Theme**: Built without noisy, distracting animations; features crisp card surfaces (`#0d131f`), subtle border hierarchy, and clean typography.
2. **Interactive Input Controls**:
   - Dual-input controls (smooth sliders + direct readouts) for Year, Kilometers Driven, Engine CC, Max Power, and Mileage.
   - Cascading dropdowns (selecting Make dynamically filters Model series).
   - Segmented buttons for Fuel Type (`Petrol`, `Diesel`, `CNG`, `LPG`) and Transmission (`Manual`, `Automatic`).
3. **Quick Test Presets**: One-click profile testing:
   - *Maruti Swift 2018* (Budget Commuter)
   - *Hyundai i20 2019* (Premium Hatchback)
   - *Honda City 2017* (Midsize Sedan)
   - *Mahindra Scorpio 2016* (Rugged SUV)
   - *BMW 3 Series 2016* (Luxury Executive)
4. **Three-Tier Market Valuation Meter**:
   - **Buyer Advantage** (Below-market price threshold)
   - **Fair Market Value** (Optimal transaction point)
   - **Dealer Premium** (Retail dealer markup ceiling)
5. **Unified Predictive Analytics Workbench**:
   - Smooth tabbed switching between **Depreciation Timeline**, **Usage Impact**, and **Feature Weights** to prevent vertical scrolling fatigue.
6. **Explainable AI Tags**: Categorizes parameters into *Value Enhancers* (e.g., Automatic transmission, low kilometers, higher power) versus *Depreciation Discounts* (e.g., older year, high odometer reading).
7. **Model Analytics & Viva Modal**: Accessible from the header, showcasing actual test metrics ($R^2 = 0.98$, $\text{MAE} = ₹63,920$, dataset splits, pipeline stages) for academic defense.

---

## 8. Quick Commands for Execution

### Backend
```bash
cd backend
./run.sh
# Server running at http://127.0.0.1:8000
# OpenAPI Swagger documentation at http://127.0.0.1:8000/docs
```

### Frontend
```bash
cd frontend
npm run dev
# Web application active at http://localhost:5173
```

---

## 9. Key Viva & Presentation Talking Points

1. **Why Random Forest over Linear Regression?**
   - Vehicle price depreciation is non-linear and exhibits complex cross-feature interactions (e.g., 50,000 km on a Toyota retains more value than 50,000 km on a lesser-known brand). Linear regression assumes straight-line additive effects, leading to massive error on luxury or older cars. Random Forest's 180 bootstrap trees capture non-linear relationships without high variance.
2. **Why Log1p Target Transformation?**
   - Car prices are right-skewed. Taking $\ln(1 + y)$ normalizes the target distribution, guarantees strictly positive predictions when inverted ($\exp(\hat{y}) - 1$), and optimizes for proportional percentage errors (MAPE) across ₹1 Lakh hatchbacks and ₹60 Lakh luxury cars alike.
3. **How is Data Leakage Prevented?**
   - All transformations (imputation, `RobustScaler`, and `OneHotEncoder`) are encapsulated inside a single `Pipeline`. Scaler parameters are calculated strictly on `X_train` and only applied (not refitted) to `X_test` and production payloads.
4. **Are the Charts Hardcoded?**
   - No. The depreciation timeline and mileage curves are generated via live simulation by the backend: the inference service clones the user's input, steps the target feature (year or kilometers), and queries the trained Random Forest model iteratively.
