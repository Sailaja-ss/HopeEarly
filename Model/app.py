from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Load trained model
try:
    model = joblib.load("breast_cancer_model.pkl")
except Exception as e:
    raise RuntimeError(f"Error loading model: {e}")

app = FastAPI(title="Breast Cancer Prediction API")

# Enable CORS (for frontend calls)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input schema (30 features)
class CancerFeatures(BaseModel):
    radius_mean: float
    texture_mean: float
    perimeter_mean: float
    area_mean: float
    smoothness_mean: float
    compactness_mean: float
    concavity_mean: float
    concave_points_mean: float
    symmetry_mean: float
    fractal_dimension_mean: float
    radius_se: float
    texture_se: float
    perimeter_se: float
    area_se: float
    smoothness_se: float
    compactness_se: float
    concavity_se: float
    concave_points_se: float
    symmetry_se: float
    fractal_dimension_se: float
    radius_worst: float
    texture_worst: float
    perimeter_worst: float
    area_worst: float
    smoothness_worst: float
    compactness_worst: float
    concavity_worst: float
    concave_points_worst: float
    symmetry_worst: float
    fractal_dimension_worst: float

@app.get("/")
def home():
    return {"message": "Breast Cancer Prediction API is running 🚀"}

@app.post("/predict")
def predict(data: CancerFeatures):
    features = np.array([list(data.dict().values())]).reshape(1, -1)
    prediction = model.predict(features)[0]
    probs = model.predict_proba(features)[0]

    result = "Malignant" if prediction == 1 else "Benign"

    return {
        "prediction": result,
        "confidence": round(probs[prediction] * 100, 2),
        "probabilities": {
            "Benign": round(probs[0] * 100, 2),
            "Malignant": round(probs[1] * 100, 2)
        }
    }
