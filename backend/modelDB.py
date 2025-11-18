# backend/modelDB.py
from sqlalchemy import Column, Integer, String, Float, DateTime, text
from database import Base

class PCBResult(Base):
    __tablename__ = "pcb_results"

    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(String(255), index=True, nullable=False)

    total_pcb = Column(Float, nullable=True)  # Total_PCB
    add = Column(Float, nullable=True)        # ADD
    ladd = Column(Float, nullable=True)       # LADD
    hq = Column(Float, nullable=True)         # HQ
    cr = Column(Float, nullable=True)         # CR
    status = Column(String(50), nullable=True)  # Status

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )


class PCBRecord(Base):
    __tablename__ = "pcb_records"

    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(String, index=True)
    coegener_level = Column(Float)
    age = Column(Float)
    bmi = Column(Float)
    hazard_quotient = Column(Float)
    cancer_risk = Column(Float)
    total_risk = Column(Float)
    high_risk = Column(Integer)  # 0 or 1


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
