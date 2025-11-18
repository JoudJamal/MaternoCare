# backend/model.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class RiskInput(BaseModel):
    age: float
    bmi: float
    pcb_sum: float

class PCBInput(BaseModel):
    sample_id: str
    coegener_level: float
    age: float
    bmi: float

class PCBRequest(BaseModel):
    samples: List[PCBInput]

class RiskOutput(BaseModel):
    sample_id: str
    coegener_level: float
    hazard_quotient: float
    cancer_risk: float
    total_risk: float
    high_risk: int

# ---------- rows we save / return ----------
class ResultIn(BaseModel):
    sample_id: str
    Total_PCB: Optional[float] = None
    ADD: Optional[float] = None
    LADD: Optional[float] = None
    HQ: Optional[float] = None
    CR: Optional[float] = None
    Status: Optional[str] = None

class ResultOut(BaseModel):
    id: int
    sample_id: str
    total_pcb: Optional[float]
    add: Optional[float]
    ladd: Optional[float]
    hq: Optional[float]
    cr: Optional[float]
    status: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True  # <-- pydantic v2 replacement for orm_mode

# ---------- response model for /upload_json/ ----------
class UploadJSONResponse(BaseModel):
    summary: Dict[str, Any]
    data: List[Dict[str, Any]]
    stats: Dict[str, Any]
