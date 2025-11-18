# backend/train_rf_model.py

from pathlib import Path
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score, precision_recall_curve
from imblearn.over_sampling import SMOTE
import joblib

# -------- paths --------
BASE_DIR = Path(__file__).resolve().parent              # .../backend
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

DATA_PATH = MODELS_DIR / "cMother_Chemical data_25.3.2025.csv"

print(f"Loading data from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

# -------- 1) prepare data --------
pcb_cols = [col for col in df.columns if "mPCB" in col and ("ng" in col or "PCB" in col)]
df[pcb_cols] = df[pcb_cols].apply(pd.to_numeric, errors="coerce")

df["Total_PCB"] = df[pcb_cols].sum(axis=1)
df["final_hq"] = (df["Total_PCB"] * 0.001) / (df["prepregancy_bmi"] + 1)
df["final_cr"] = (df["Total_PCB"] * 0.0001) / (df["m_age"] + 1)
df["total_risk"] = df["final_hq"] + df["final_cr"]
df["high_risk"] = (df["total_risk"] > 0.005).astype(int)

FEATURES = ["m_age", "prepregancy_bmi"]
X = df[FEATURES].apply(pd.to_numeric, errors="coerce")
X = X.dropna()
y = df["high_risk"].loc[X.index]

feature_medians = X.median().to_dict()

# -------- 2) train RF --------
smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X, y)

X_train, X_test, y_train, y_test = train_test_split(
    X_balanced, y_balanced, test_size=0.2, stratify=y_balanced, random_state=42
)

rf = RandomForestClassifier(
    n_estimators=100,
    class_weight="balanced",
    random_state=42,
)
rf.fit(X_train, y_train)

y_probs = rf.predict_proba(X_test)[:, 1]
roc = roc_auc_score(y_test, y_probs)
print("ROC-AUC:", round(roc, 3))

precision, recall, thresholds = precision_recall_curve(y_test, y_probs)
f1_scores = 2 * (precision * recall) / (precision + recall + 1e-6)
best_idx = np.argmax(f1_scores)
best_threshold = float(thresholds[best_idx])
print("Best threshold:", best_threshold)

# -------- 3) save artifact --------
artifact = {
    "model": rf,
    "threshold": best_threshold,
    "feature_names": FEATURES,
    "feature_medians": feature_medians,
}

model_path = MODELS_DIR / "drkhaled_rf.pkl"
joblib.dump(artifact, model_path)
print(f"Saved model to: {model_path}")
