// src/pages/components/PatientXaiCard.js
import React from "react";
import { Progress, Tag } from "antd";
import { Activity, AlertCircle, Brain, Baby, ShieldAlert } from "lucide-react";

const formatPercent = (raw) => {
  if (raw == null) return null;
  let p = raw;
  if (p <= 1) p = p * 100;
  if (!Number.isFinite(p)) return null;
  return p.toFixed(0);
};

const PatientXaiCard = ({ patient, onClose }) => {
  if (!patient) return null;

  const pct = formatPercent(
    patient.risk_probability ??
      patient.risk_prob ??
      patient.probability ??
      patient.pcb_risk_probability
  );

  const riskLabel =
    patient.risk_label ||
    (pct != null && pct >= 80
      ? "High risk"
      : pct != null && pct >= 50
      ? "Borderline risk"
      : "Low risk");

  const hq = patient.hq ?? patient.HQ;
  const cr = patient.cr ?? patient.CR;

  const inputs =
    patient.inputs ||
    patient.input_features || {
      m_age: patient.m_age ?? patient.maternal_age,
      prepregnancy_bmi: patient.prepregnancy_bmi ?? patient.bmi,
    };

  const shapVals =
    patient.shap_values ||
    patient.feature_contributions || {
      m_age:
        patient.shap_m_age ??
        patient.shap_age ??
        (patient.shap && patient.shap.m_age),
      prepregnancy_bmi:
        patient.shap_prepregnancy_bmi ??
        patient.shap_bmi ??
        (patient.shap && patient.shap.prepregnancy_bmi),
    };

  const explanationText =
    patient.summary ||
    patient.explanation ||
    patient.ai_summary ||
    "This explanation is generated from the Random Forest model and SHAP values for maternal age and pre-pregnancy BMI. It is for research and screening purposes only and does not replace clinical judgement or specialist consultation.";

  const patientLabel = patient.patient_id || "Patient";

  const featureRows = [
    { key: "m_age", label: "Maternal age (m_age)" },
    { key: "prepregnancy_bmi", label: "Pre-pregnancy BMI" },
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={20} />
            <h2 style={{ margin: 0, fontSize: 20 }}>
              {patientLabel} — PCB Risk Profile
            </h2>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#666",
              marginTop: 4,
              maxWidth: 480,
            }}
          >
            Random forest model with SHAP explanations (m_age + pre-pregnancy
            BMI)
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 10px",
              cursor: "pointer",
              background: "#f5f5f5",
              minWidth: 32,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Top row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Probability box */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            minHeight: 170,
          }}
        >
          <div style={{ fontSize: 13, color: "#777", marginBottom: 4 }}>
            Predicted probability of high PCB risk
          </div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
            Threshold ~54%
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 90, textAlign: "center", flexShrink: 0 }}>
              <Progress
                type="circle"
                percent={pct != null ? Number(pct) : 0}
                width={80}
                strokeColor={
                  pct != null && Number(pct) >= 54 ? "#ff4d4f" : "#52c41a"
                }
              />
              <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
                {pct != null ? `${pct}%` : "N/A"}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Tag
                color={pct != null && Number(pct) >= 54 ? "red" : "green"}
                style={{
                  marginBottom: 8,
                  display: "inline-block",
                  whiteSpace: "normal",
                }}
              >
                {pct != null && Number(pct) >= 54
                  ? "High PCB risk (above threshold)"
                  : "Below PCB risk threshold"}
              </Tag>
              <div
                style={{
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                The model estimates a{" "}
                <b>{pct != null ? `${pct}%` : "—"}</b> chance this patient falls
                into the “high PCB risk” group based on age and pre-pregnancy
                BMI.
              </div>
            </div>
          </div>
        </div>

        {/* Exposure metrics */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#777",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ShieldAlert size={16} />
            Exposure metrics
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
              fontSize: 13,
            }}
          >
            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
                minHeight: 60,
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>
                Total PCB (ng/g lipid)
              </div>
              <div style={{ fontWeight: 600 }}>
                {patient.total_pcb ?? patient.total_pcb_ng_g_lipid ?? "—"}
              </div>
            </div>

            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
                minHeight: 60,
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>Risk label</div>
              <div style={{ fontWeight: 600 }}>{riskLabel}</div>
            </div>

            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
                minHeight: 60,
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>
                Hazard Quotient (HQ)
              </div>
              <div style={{ fontWeight: 600 }}>
                {hq == null ? "—" : Number(hq).toExponential(2)}
              </div>
            </div>

            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
                minHeight: 60,
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>Cancer Risk (CR)</div>
              <div style={{ fontWeight: 600 }}>
                {cr == null ? "—" : Number(cr).toExponential(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#777",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Baby size={16} />
            Why did the model make this call?
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              gap: 8,
              fontSize: 13,
            }}
          >
            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>
                Maternal age (m_age)
              </div>
              <div style={{ fontWeight: 600 }}>
                {inputs?.m_age != null ? inputs.m_age : "—"}
              </div>
            </div>

            <div
              style={{
                borderRadius: 10,
                padding: 10,
                background: "#fafafa",
              }}
            >
              <div style={{ color: "#888", marginBottom: 4 }}>
                Pre-pregnancy BMI
              </div>
              <div style={{ fontWeight: 600 }}>
                {inputs?.prepregnancy_bmi != null
                  ? inputs.prepregnancy_bmi
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP-style feature contributions */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#777",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Brain size={16} />
          Feature contributions (SHAP-style)
        </div>

        {featureRows.map((f) => {
          const value = shapVals?.[f.key];
          if (value == null || !Number.isFinite(Number(value))) {
            return (
              <div
                key={f.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 13,
                }}
              >
                <span>{f.label}</span>
                <span style={{ color: "#aaa" }}>n/a</span>
              </div>
            );
          }

          const v = Number(value);
          const pushesUp = v > 0;
          const magnitude = Math.min(Math.abs(v) * 200, 100); // scale to 0–100 for bar

          return (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                <span>{f.label}</span>
                <span>{v.toFixed(4)}</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "#f0f0f0",
                }}
              >
                <div
                  style={{
                    width: `${magnitude}%`,
                    height: "100%",
                    background: pushesUp ? "#ff7875" : "#95de64",
                  }}
                />
              </div>
              <div style={{ marginTop: 4, fontSize: 11 }}>
                <Tag color={pushesUp ? "red" : "green"} style={{ fontSize: 11 }}>
                  {pushesUp ? "pushes risk ↑" : "pushes risk ↓"}
                </Tag>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI summary area */}
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 12,
          padding: 16,
          background: "#fafafa",
          display: "flex",
          gap: 10,
        }}
      >
        <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: 12, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Explainable AI summary
          </div>
          <div style={{ marginBottom: 8 }}>{explanationText}</div>
          <div style={{ color: "#999" }}>
            This explanation is meant for research and screening use. It
            highlights how age and BMI shape the model’s decision but does not
            replace clinical judgement, toxicology consultation, or patient-
            specific assessment.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientXaiCard;