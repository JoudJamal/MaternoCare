# backend/ml_risk.py

import numpy as np
import pandas as pd
from pathlib import Path
from typing import Optional, Dict, Any, List
import joblib

# Paths
_BASE_DIR = Path(__file__).resolve().parent
_MODELS_DIR = _BASE_DIR / "models"
_MODEL_PATH = _MODELS_DIR / "drkhaled_rf.pkl"

# Cache for loaded model artifact
_RF_ARTIFACT: Optional[Dict[str, Any]] = None


def _load_rf_artifact() -> Optional[Dict[str, Any]]:
    """
    Load the Random Forest artifact (model + threshold + medians) once.
    """
    global _RF_ARTIFACT
    if _RF_ARTIFACT is not None:
        return _RF_ARTIFACT

    if not _MODEL_PATH.exists():
        print(f"[ml_risk] RF model not found at: {_MODEL_PATH}")
        return None

    try:
        _RF_ARTIFACT = joblib.load(_MODEL_PATH)
        print(f"[ml_risk] RF model loaded from: {_MODEL_PATH}")
        return _RF_ARTIFACT
    except Exception as e:
        print(f"[ml_risk] Failed to load RF model: {e}")
        _RF_ARTIFACT = None
        return None


def maybe_add_ml_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Use the RF model to:
      - add ML_Prob (probability)
      - add ML_Label (High / Low ML risk)
      - create Final_Status which upgrades Status using ML

    If the model is missing or broken, we just copy Status → Final_Status
    and return the dataframe.
    """
    df = df.copy()

    artifact = _load_rf_artifact()
    if artifact is None:
        # No model available: ensure Final_Status exists and return
        if "Status" in df.columns and "Final_Status" not in df.columns:
            df["Final_Status"] = df["Status"]
        return df

    model = artifact["model"]
    feature_names: List[str] = artifact.get("feature_names", [])
    feature_medians: Dict[str, float] = artifact.get("feature_medians", {})
    threshold: float = float(artifact.get("threshold", 0.5))

    # Check required feature columns
    missing = [f for f in feature_names if f not in df.columns]
    if missing:
        print(f"[ml_risk] Missing features in DF, skipping ML: {missing}")
        if "Status" in df.columns and "Final_Status" not in df.columns:
            df["Final_Status"] = df["Status"]
        return df

    # Build feature matrix X in correct order
    X = df[feature_names].copy()
    for col in feature_names:
        X[col] = pd.to_numeric(X[col], errors="coerce")
        X[col] = X[col].fillna(feature_medians.get(col, X[col].median()))

    # Some rows might still be invalid (all NaN)
    invalid_mask = X.isna().any(axis=1)
    valid_mask = ~invalid_mask

    ml_prob = np.full(len(df), np.nan, dtype=float)
    ml_label = np.array(["Unknown"] * len(df), dtype=object)

    if valid_mask.sum() > 0:
        probs = model.predict_proba(X.loc[valid_mask])[:, 1]
        ml_prob[valid_mask] = probs
        ml_label[valid_mask] = np.where(
            probs >= threshold, "High ML risk", "Low ML risk"
        )

    df["ML_Prob"] = ml_prob
    df["ML_Label"] = ml_label

    # Combine TK Status + ML_Label into Final_Status
    if "Status" in df.columns:
        def combine(row):
            base = row["Status"]
            ml = row["ML_Label"]

            if ml == "High ML risk":
                if base == "Safe":
                    return "Needs Monitoring (ML)"
                elif base == "Needs Monitoring":
                    return "Critical Risk (ML)"
                else:
                    return "Critical Risk"
            else:
                # Low ML risk or Unknown → keep TK status
                return base

        df["Final_Status"] = df.apply(combine, axis=1)
    elif "Final_Status" not in df.columns:
        # Fallback if Status does not exist for some reason
        df["Final_Status"] = "Unknown"

    return df
