# backend/xai_utils.py
import os
import math
import logging
import joblib
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# ----------------- model loading -----------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "drkhaled_rf.pkl")
_rf_model_cache = None


def _load_rf_model():
    """
    Lazy-load the RF model. Handles the case where the pickle
    is a dict that wraps the real model.
    Never raises – on failure returns None and logs a warning.
    """
    global _rf_model_cache
    if _rf_model_cache is not None:
        return _rf_model_cache

    try:
        obj = joblib.load(MODEL_PATH)

        # Sometimes people pickle {"model": rf_model} or similar.
        if isinstance(obj, dict):
            for v in obj.values():
                if hasattr(v, "predict_proba"):
                    obj = v
                    break

        if not hasattr(obj, "predict_proba"):
            logger.warning(
                "Loaded object from %s has no predict_proba; "
                "XAI will fall back to a simple heuristic.",
                MODEL_PATH,
            )
            _rf_model_cache = None
        else:
            _rf_model_cache = obj
    except Exception as e:
        logger.exception("Failed to load RF model from %s", MODEL_PATH)
        _rf_model_cache = None

    return _rf_model_cache


# ----------------- helpers -----------------
AGE_ALIASES = [
    "m_age",
    "maternal_age",
    "Maternal age",
    "Maternal_age",
    "mother_age",
]

BMI_ALIASES = [
    "prepregnancy_bmi",
    "pre-pregnancy_bmi",
    "prepregancy_bmi",  # typo you used earlier
    "pre_preg_bmi",
    "BMI",
    "bmi",
]


def _get_numeric(row: pd.Series, aliases, default=None):
    for col in aliases:
        if col in row and not pd.isna(row[col]):
            try:
                return float(row[col])
            except Exception:
                continue
    return default


def _clean(x):
    if x is None:
        return None
    if isinstance(x, (float, np.floating)):
        if math.isinf(x) or math.isnan(x):
            return None
        return float(x)
    if isinstance(x, (np.integer,)):
        return int(x)
    return x


# ----------------- main API -----------------
def generate_patient_explanation(row: pd.Series) -> dict:
    """
    Build a JSON-friendly explanation for one patient row.
    1) tries to use your RandomForest model (drkhaled_rf.pkl)
    2) if that fails, falls back to a simple logistic rule
       so it NEVER crashes the backend.
    """
    m_age = _get_numeric(row, AGE_ALIASES, default=None)
    bmi = _get_numeric(row, BMI_ALIASES, default=None)

    hq = row.get("HQ", None)
    cr = row.get("CR", None)

    # Missing key inputs → no risk estimate but no crash
    if m_age is None or bmi is None:
        return {
            "risk_probability": None,
            "risk_label": "Unknown (missing age/BMI)",
            "inputs": {
                "m_age": _clean(m_age),
                "prepregnancy_bmi": _clean(bmi),
            },
            "shap_values": {
                "m_age": None,
                "prepregnancy_bmi": None,
            },
            "hq": _clean(hq),
            "cr": _clean(cr),
            "summary": (
                "Age or pre-pregnancy BMI is missing in this row, so the model "
                "could not estimate PCB risk. Please ensure the CSV includes "
                "columns for maternal age and pre-pregnancy BMI."
            ),
        }

    # -------- try RF model first --------
    model = _load_rf_model()

    if model is not None:
        try:
            X = np.array([[m_age, bmi]], dtype=float)
            proba_high = float(model.predict_proba(X)[0, 1])

            # reference patient for simple SHAP-style contributions
            ref_age = 30.0
            ref_bmi = 25.0
            X_ref = np.array([[ref_age, ref_bmi]], dtype=float)
            base_prob = float(model.predict_proba(X_ref)[0, 1])

            X_age_only = np.array([[m_age, ref_bmi]], dtype=float)
            X_bmi_only = np.array([[ref_age, bmi]], dtype=float)

            prob_age_only = float(model.predict_proba(X_age_only)[0, 1])
            prob_bmi_only = float(model.predict_proba(X_bmi_only)[0, 1])

            contrib_age = _clean(prob_age_only - base_prob)
            contrib_bmi = _clean(prob_bmi_only - base_prob)
            proba_high = _clean(proba_high)
        except Exception:
            logger.exception("RF prediction failed in generate_patient_explanation")
            model = None  # fall through to heuristic

    # -------- heuristic fallback if RF unavailable --------
    if model is None:
        # just something monotonic: older age + higher BMI → higher risk
        z = 0.05 * (m_age - 30.0) + 0.08 * (bmi - 25.0)
        proba_high = 1.0 / (1.0 + math.exp(-z))
        contrib_age = _clean(0.05 * (m_age - 30.0))
        contrib_bmi = _clean(0.08 * (bmi - 25.0))
        proba_high = _clean(proba_high)

    # -------- label + summary --------
    pct = proba_high * 100 if proba_high is not None else None
    if pct is None:
        risk_label = "Unknown"
    elif pct >= 80:
        risk_label = "High risk"
    elif pct >= 50:
        risk_label = "Borderline risk"
    else:
        risk_label = "Low risk"

    dir_age = "increases" if (contrib_age or 0) > 0 else "decreases"
    dir_bmi = "increases" if (contrib_bmi or 0) > 0 else "decreases"

    if pct is not None:
        summary = (
            f"Based on maternal age and pre-pregnancy BMI, this patient has an "
            f"estimated {pct:.0f}% probability of belonging to the high PCB risk group. "
            f"A maternal age of {m_age:.1f} years {dir_age} risk compared with a "
            f"reference of 30 years, while a pre-pregnancy BMI of {bmi:.1f} "
            f"{dir_bmi} risk compared with BMI 25."
        )
    else:
        summary = (
            "The model produced an undefined probability for this patient. "
            "Please check that the inputs are valid numeric values."
        )

    return {
        "risk_probability": _clean(proba_high),
        "risk_label": risk_label,
        "inputs": {
            "m_age": _clean(m_age),
            "prepregnancy_bmi": _clean(bmi),
        },
        "shap_values": {
            "m_age": _clean(contrib_age),
            "prepregnancy_bmi": _clean(contrib_bmi),
        },
        "hq": _clean(hq),
        "cr": _clean(cr),
        "summary": summary,
    }