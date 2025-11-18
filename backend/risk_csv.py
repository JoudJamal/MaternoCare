import pandas as pd
import numpy as np
import re
from typing import List, Tuple

from ml_risk import maybe_add_ml_columns


"""
risk_csv.py

1) Detect PCB columns
2) Compute TK-style risk metrics based on Abass et al.:
      - Total_PCB
      - ADD (average daily dose, mg/kg-day)
      - LADD (lifetime average daily dose, mg/kg-day)
      - HQ (non-cancer hazard quotient)
      - CR (cancer risk)
3) Classify Status (Safe / Monitoring / Critical)
4) Add ML-based risk columns + Final_Status
"""


# ================== COLUMN DETECTION ================== #
def detect_sample_column(columns: List[str]) -> str:
    patterns = [
        r"sample", r"id", r"patient", r"subject", r"case",
        r"no", r"number", r"code"
    ]
    for col in columns:
        lower = col.lower()
        if any(re.search(p, lower) for p in patterns):
            return col
    return columns[0]


def detect_pcb_columns(columns: List[str]) -> List[str]:
    """
    PCB columns contain: ng/g_lipid_LOD
    """
    return [col for col in columns if "ng/g_lipid_LOD" in col]


# ================== TOXICOKINETIC RISK FORMULA ================== #
def calculate_realistic_risk(
    age: float,
    bmi: float,
    pcb_sum_ng_per_g_lipid: float,
    food_intake_per_week: float = 150.0,
) -> Tuple[float, float, float, bool, float, float]:
    """
    TK-inspired risk calculation based on Abass et al. (2013).

    - pcb_sum is in ng/g_lipid (your dataset)
    - Convert exposure to mg/kg-day (correct units for HQ and CR)

    Returns:
        HQ, CR, total_risk, high_risk_flag, ADD, LADD
        ADD  = average daily dose (mg/kg-day)
        LADD = lifetime average daily dose (mg/kg-day)
    """

    # approximate maternal weight from BMI
    height_m = 1.6
    weight_kg = bmi * (height_m ** 2)
    if weight_kg <= 0:
        weight_kg = 60.0

    # g/day intake
    food_per_day = food_intake_per_week / 7.0

    # ng/kg-day = (g/day * ng/g) / kg
    daily_dose_ng_per_kg_day = (food_per_day * pcb_sum_ng_per_g_lipid) / max(weight_kg, 1e-6)

    # convert ng → mg
    daily_dose_mg_per_kg_day = daily_dose_ng_per_kg_day * 1e-6
    ADD = daily_dose_mg_per_kg_day  # this is the ADD in mg/kg-day

    # TK parameters from Abass et al.
    RfD = 2e-5        # mg/kg-day
    CSF = 2.0         # per mg/kg-day
    lifetime = 70.0   # years

    # HQ for non-cancer effects
    HQ = ADD / RfD

    # LADD & CR for cancer
    LADD = (ADD * age) / lifetime
    CR = LADD * CSF

    total_risk = HQ + CR

    # high-risk flag following paper interpretation:
    high_risk = (HQ > 1.0) or (CR > 1e-4)

    return HQ, CR, total_risk, high_risk, ADD, LADD


# ================== PER-ROW RISK METRICS ================== #
def compute_pcb_risk(df: pd.DataFrame, pcb_cols: List[str]) -> pd.DataFrame:
    df = df.copy()

    # numeric PCB columns
    df[pcb_cols] = df[pcb_cols].apply(pd.to_numeric, errors="coerce")

    # Total PCB load
    df["Total_PCB"] = df[pcb_cols].sum(axis=1)

    # initialise columns
    df["ADD"] = np.nan
    df["LADD"] = np.nan
    df["HQ"] = np.nan
    df["CR"] = np.nan
    df["Status"] = "Unknown"

    for idx, row in df.iterrows():
        try:
            age = float(row.get("m_age"))
            bmi = float(row.get("prepregancy_bmi"))
            pcb_sum = float(row["Total_PCB"])

            if pd.isna(age) or pd.isna(bmi) or pd.isna(pcb_sum):
                raise ValueError("Missing age/BMI/PCB")

            hq, cr, total_risk, high_risk, add, ladd = calculate_realistic_risk(
                age=age,
                bmi=bmi,
                pcb_sum_ng_per_g_lipid=pcb_sum,
            )

            df.at[idx, "ADD"] = add
            df.at[idx, "LADD"] = ladd
            df.at[idx, "HQ"] = hq
            df.at[idx, "CR"] = cr

            # classification following HQ & CR interpretation in paper
            if hq > 1.0 or cr > 1e-4:
                status = "Critical Risk"
            elif (0.1 <= hq <= 1.0) or (1e-6 <= cr <= 1e-4):
                status = "Needs Monitoring"
            else:
                status = "Safe"

            df.at[idx, "Status"] = status

        except Exception:
            df.at[idx, "Status"] = "Error"

    return df


# ================== MAIN ENTRY FUNCTION ================== #
def parse_csv_and_analyze(df: pd.DataFrame):
    if df is None or df.empty:
        raise ValueError("Empty dataframe passed to parse_csv_and_analyze")

    cols = df.columns.tolist()

    sample_col = detect_sample_column(cols)
    pcb_cols = detect_pcb_columns(cols)

    if not pcb_cols:
        raise ValueError("Could not find any PCB ng/g_lipid_LOD columns")

    # rename ID column
    df = df.rename(columns={sample_col: "sample_id"})

    # Step 1: TK-based risk metrics
    result_df = compute_pcb_risk(df, pcb_cols)

    # Step 2: Add ML probabilities + Final_Status (if model exists)
    result_df = maybe_add_ml_columns(result_df)

    # Final status for summaries
    status_col = "Final_Status" if "Final_Status" in result_df.columns else "Status"

    # Step 3: Summary
    summary = {
        "total_samples": int(len(result_df)),
        "status_distribution": result_df[status_col].value_counts(dropna=False).to_dict(),
    }

    # Step 4: Stats
    stats = {
        "mean_ADD": float(result_df["ADD"].mean(skipna=True)),
        "mean_LADD": float(result_df["LADD"].mean(skipna=True)),
        "mean_HQ": float(result_df["HQ"].mean(skipna=True)),
        "mean_CR": float(result_df["CR"].mean(skipna=True)),
    }

    if "ML_Prob" in result_df.columns:
        stats["mean_ML_Prob"] = float(result_df["ML_Prob"].mean(skipna=True))
        summary["ml_label_distribution"] = result_df["ML_Label"].value_counts(dropna=False).to_dict()

    return result_df, summary, stats
