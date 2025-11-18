# backend/main.py
import io
import math
import logging

import numpy as np
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from fastapi import Body
import pandas as pd
import math
import numpy as np

from database import Base, engine, get_db
from modelDB import PCBResult
from model import RiskInput, ResultIn, ResultOut, UploadJSONResponse
from risk_csv import (
    parse_csv_and_analyze,
    detect_sample_column,
    detect_pcb_columns,
    compute_pcb_risk,
    calculate_realistic_risk,
)
from auth import router as auth_router
from xai_utils import generate_patient_explanation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Unified PCB API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create DB tables
Base.metadata.create_all(bind=engine)

# auth routes
app.include_router(auth_router)


# ---------- BASIC HEALTH ENDPOINTS ----------

@app.get("/")
def root():
    return {"message": "Unified PCB Risk API running."}


@app.get("/debug")
def debug():
    return {"routes": [route.path for route in app.routes]}


# ---------- CSV → JSON FOR LIVE MONITORING TABLE ----------

@app.post(
    "/upload_json/",
    response_model=UploadJSONResponse,
    summary="Upload CSV & return JSON",
    tags=["Uploads"],
)
async def upload_json_csv(
    file: UploadFile = File(...),
    save: bool = Query(default=False, description="If true, save results to DB"),
    db: Session = Depends(get_db),
):
    """
    Main endpoint used by the Live Monitoring dashboard, tab = "Clinical Metrics".
    """
    try:
        raw_bytes = await file.read()
        df = pd.read_csv(io.BytesIO(raw_bytes))

        result_df, summary, stats = parse_csv_and_analyze(df)

        safe_df = (
            result_df.replace([float("inf"), float("-inf")], pd.NA)
            .astype(object)
            .where(pd.notnull(result_df), None)
        )

        keep_cols = ["sample_id", "Total_PCB", "ADD", "LADD", "HQ", "CR", "Status"]
        rows = safe_df[keep_cols].to_dict(orient="records")

        if save:
            for r in rows:
                rec = PCBResult(
                    sample_id=str(r.get("sample_id")),
                    total_pcb=r.get("Total_PCB"),
                    add=r.get("ADD"),
                    ladd=r.get("LADD"),
                    hq=r.get("HQ"),
                    cr=r.get("CR"),
                    status=r.get("Status"),
                )
                db.add(rec)
            db.commit()

        return {
            "summary": summary,
            "data": rows,
            "stats": stats,
        }

    except Exception as e:
        logger.exception("upload_json_csv failed")
        raise HTTPException(status_code=500, detail=f"Backend error: {str(e)}")


# ---------- CSV → ANALYZED CSV BLOB FOR DOWNLOAD ----------

@app.post(
    "/upload/",
    summary="Upload CSV & return CSV",
    tags=["Uploads"],
)
async def upload(file: UploadFile = File(...)):
    """
    Same CSV as /upload_json/, but returns an analyzed CSV file
    that the dashboard can download.
    """
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty CSV file")

        sample_col = detect_sample_column(df.columns.tolist())
        pcb_cols = detect_pcb_columns(df.columns.tolist())
        df = df.rename(columns={sample_col: "sample_id"})
        result_df = compute_pcb_risk(df, pcb_cols)

        keep_cols = ["sample_id", "Total_PCB", "ADD", "LADD", "HQ", "CR", "Status"]

        out_buf = io.StringIO()
        result_df[keep_cols].to_csv(out_buf, index=False)
        out_buf.seek(0)

        return StreamingResponse(
            out_buf,
            media_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="pcb_analysis.csv"'},
        )

    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        logger.exception("upload failed")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


# ---------- AI-LIKE SUMMARY FOR TAB = "ai" ----------

@app.post(
    "/deepseek/",
    summary="Generate interpretive summary for clinicians",
    tags=["AI"],
)
async def deepseek_like_summary(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        result_df, summary, stats = parse_csv_and_analyze(df)

        status_counts = summary["status_distribution"]

        critical_cases = (
            result_df[result_df["Status"] == "Critical Risk"]
            .nlargest(5, "HQ")
            [["sample_id", "HQ", "CR", "Total_PCB", "Status"]]
            .to_dict(orient="records")
        )

        narrative = {
            "overview": {
                "total_samples": summary["total_samples"],
                "status_distribution": status_counts,
                "mean_HQ": stats["mean_HQ"],
                "mean_CR": stats["mean_CR"],
            },
            "critical_cases_preview": critical_cases,
            "clinical_note": (
                "Patients labeled 'Critical Risk' exceed internal PCB exposure "
                "thresholds (HQ>2 or CR>1e-4). This is research-only, not a diagnosis."
            ),
        }

        return JSONResponse(content=narrative)

    except Exception as e:
        logger.exception("deepseek_like_summary failed")
        raise HTTPException(status_code=500, detail=f"AI summary error: {str(e)}")


# ---------- SINGLE-PATIENT MATH CALCULATOR (NO CSV) ----------

@app.post(
    "/calculate_math_risk",
    summary="Calculate Math Risk",
    tags=["Risk"],
)
def calc_single_user(data: RiskInput):
    try:
        hq, cr, total_risk, high_risk = calculate_realistic_risk(
            age=data.age,
            bmi=data.bmi,
            pcb_sum_ng_per_g_lipid=data.pcb_sum,
            food_intake_per_week=150,
        )
        return {
            "hq": round(hq, 6),
            "cr": round(cr, 6),
            "total_risk": round(total_risk, 6),
            "high_risk": high_risk,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------- DATABASE PERSISTENCE / RETRIEVAL ----------

@app.post("/results", response_model=ResultOut, tags=["Database"])
def save_result(payload: ResultIn, db: Session = Depends(get_db)):
    rec = PCBResult(
        sample_id=payload.sample_id,
        total_pcb=payload.Total_PCB,
        add=payload.ADD,
        ladd=payload.LADD,
        hq=payload.HQ,
        cr=payload.CR,
        status=payload.Status,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


@app.get("/results", response_model=list[ResultOut], tags=["Database"])
def list_results(limit: int = 50, db: Session = Depends(get_db)):
    q = (
        db.query(PCBResult)
        .order_by(PCBResult.id.desc())
        .limit(limit)
        .all()
    )
    return q


# ---------- helpers ----------

def _make_json_safe(x):
    if isinstance(x, (float, np.floating)):
        if math.isinf(x) or math.isnan(x):
            return None
        return float(x)
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, dict):
        return {k: _make_json_safe(v) for k, v in x.items()}
    if isinstance(x, (list, tuple, np.ndarray)):
        return [_make_json_safe(v) for v in x]
    return x


# ---------- XAI: CSV -> per-patient explanation ----------

@app.post("/xai/analyze-csv", tags=["XAI"])
async def analyze_csv_with_xai(file: UploadFile = File(...)):
    """
    Upload a CSV where each row is one patient and return per-patient explanations.
    Required columns:
      - m_age
      - prepregancy_bmi
    Optional:
      - sample_id / patient_id
      - HQ
      - CR
    """
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty CSV file")

        results = []
        for idx, (_, row) in enumerate(df.iterrows()):
            explanation = generate_patient_explanation(row)
            explanation = _make_json_safe(explanation)

            patient_record = {
                "patient_id": row.get("sample_id")
                or row.get("patient_id")
                or f"{idx + 1}",
                "hq": row.get("HQ", None),
                "cr": row.get("CR", None),
                **explanation,
            }
            results.append(_make_json_safe(patient_record))

        return {"patients": results}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("analyze_csv_with_xai failed")
        raise HTTPException(
            status_code=500,
            detail=f"XAI analysis error: {e}",
        )

# ---------- helper to make JSON-safe ----------
def make_json_safe(x):
    if isinstance(x, (float, np.floating)):
        if math.isinf(x) or math.isnan(x):
            return None
        return float(x)
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, dict):
        return {k: make_json_safe(v) for k, v in x.items()}
    if isinstance(x, (list, tuple)):
        return [make_json_safe(v) for v in x]
    return x


# ---------- XAI: single-patient from JSON input ----------
@app.post("/xai/from-input")
async def explain_single_patient(payload: dict = Body(...)):
    """
    Take the SAME fields you send from the risk calculator (one patient),
    run SHAP on the RF model, and return an explanation.

    Example payload:
    {
      "m_age": 32,
      "prepregancy_bmi": 27.5,
      ...
    }
    """
    try:
        # Turn the JSON body into a "row" for generate_patient_explanation
        row = pd.Series(payload)

        explanation = generate_patient_explanation(row)
        explanation = make_json_safe(explanation)

        # Optional: label to show in the card
        explanation["patient_id"] = payload.get("patient_id", "Risk calculator input")

        return explanation

    except Exception as e:
        logger.exception("explain_single_patient failed")
        raise HTTPException(
            status_code=500,
            detail=f"XAI analysis error (single patient): {e}",
        )
    
    