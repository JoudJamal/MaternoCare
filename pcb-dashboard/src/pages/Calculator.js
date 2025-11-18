import React, { useState, useEffect } from "react";
import { Progress, Tooltip, Collapse, Alert } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { InfoCircleOutlined } from "@ant-design/icons";
import PatientXaiCard from "./components/PatientXaiCard";
import axios from "axios";

const { Panel } = Collapse;

// ---------- styles ----------
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom right, #f3e8ff, #ffffff 40%, #dbeafe 80%)",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: "4rem",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  contentWrapper: {
    maxWidth: "1200px",
    width: "100%",
    position: "relative",
    zIndex: 10,
    padding: "4rem 1.5rem 3rem 1.5rem",
  },

  headerBlock: {
    textAlign: "left",
    marginBottom: "2rem",
    animation: "fadeIn 0.8s ease-out",
  },
  titleRow: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  titleAccent: {
    background: "linear-gradient(to right,#7c3aed,#2563eb 60%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: 800,
  },
  subText: {
    marginTop: "0.75rem",
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#4b5563",
    maxWidth: "800px",
  },
  headerDivider: {
    width: "4rem",
    height: "4px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "9999px",
    marginTop: "1.5rem",
    animation: "pulse 2s ease-in-out infinite",
  },

  layoutRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
  },

  cardSection: {
    flex: "1 1 360px",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 20px 35px rgba(0,0,0,0.12)",
    border: "2px solid rgba(124,58,237,0.08)",
    padding: "1.5rem",
    minWidth: "320px",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  inputFieldWrap: {
    marginBottom: "1rem",
  },
  inputLabel: {
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    marginBottom: "0.4rem",
  },
  inputBox: (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "0.6rem",
    border: hasError ? "2px solid #ff4d4f" : "1px solid #d1d5db",
    backgroundColor: "#fff",
    fontSize: "0.95rem",
    lineHeight: 1.4,
    outline: "none",
  }),
  errorText: {
    fontSize: "0.8rem",
    color: "#ff4d4f",
    marginTop: "0.25rem",
  },

  predictButton: (enabled) => ({
    width: "100%",
    background: enabled
      ? "linear-gradient(to right,#7c3aed,#2563eb)"
      : "#aaa",
    boxShadow: enabled ? "0 12px 24px rgba(124,58,237,0.4)" : "none",
    color: "white",
    padding: "0.75rem 1rem",
    marginTop: "1rem",
    border: "none",
    borderRadius: "0.75rem",
    cursor: enabled ? "pointer" : "not-allowed",
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    transition: "all 0.2s ease",
  }),

  resultWrapper: {
    backgroundColor: "#f8f3ff",
    borderRadius: "1rem",
    padding: "1.5rem",
  },

  resultHeader: (color) => ({
    border: `2px solid ${color}`,
    backgroundColor: color + "15",
    boxShadow: `0 0 12px ${color}88`,
    borderRadius: "0.75rem",
    padding: "1rem 1rem",
    marginBottom: "1.5rem",
  }),
  classificationText: (color) => ({
    color,
    fontSize: "1.4rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  metricText: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  metricLabel: {
    fontWeight: "600",
  },

  riskMeterWrap: {
    margin: "2rem 0 1rem 0",
  },

  riskMeterCaption: (color) => ({
    fontSize: "0.8rem",
    marginTop: "0.5rem",
    color,
    lineHeight: 1.5,
    display: "flex",
    flexWrap: "wrap",
    rowGap: "0.5rem",
    columnGap: "0.75rem",
    alignItems: "flex-start",
  }),

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },

  calcCollapse: {
    backgroundColor: "#fff",
    borderRadius: "0.75rem",
    border: "1px solid rgba(124,58,237,0.15)",
    overflow: "hidden",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  },

  contributorsBlock: {
    marginTop: "2rem",
  },
  contributorsTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#111827",
  },

  chartCard: {
    width: "100%",
    height: 260,
    backgroundColor: "#fff",
    borderRadius: "0.75rem",
    border: "1px solid rgba(124,58,237,0.15)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    padding: "1rem",
  },
};

// animated background blobs
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:.8; transform:scale(1.05); }
  }

  @keyframes floatSlow {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    25% { transform: translate(20px,-20px) rotate(4deg); }
    50% { transform: translate(-15px,-35px) rotate(-3deg); }
    75% { transform: translate(-20px,-10px) rotate(2deg); }
  }
`;

const FloatingBlob = ({ size, color, top, left, delay, blur = "40px" }) => {
  const blobStyle = {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "9999px",
    backgroundColor: color,
    opacity: 0.22,
    filter: `blur(${blur})`,
    top,
    left,
    animation: `floatSlow 10s ease-in-out infinite`,
    animationDelay: delay,
    pointerEvents: "none",
  };
  return <div style={blobStyle} />;
};

const RiskCalculator = () => {
  const [inputs, setInputs] = useState({
    age: "",
    bmi: "",
    foodIntake: "",
    bloodLevel: "",
    education: "",
    region: "",
    parity: "",
    pregnant: "",
    smoking: "",
    fishServings: "",
    occupationalExposure: "",
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // 🔹 XAI state (single-patient SHAP)
  const [xaiResult, setXaiResult] = useState(null);
  const [xaiLoading, setXaiLoading] = useState(false);
  const [xaiError, setXaiError] = useState("");

  // validation
  const validate = () => {
    const errs = {};
    const { foodIntake, bloodLevel, bmi, age } = inputs;

    if (!foodIntake || foodIntake < 10 || foodIntake > 300) {
      errs.foodIntake = "10–300 grams/week";
    }
    if (!bloodLevel || bloodLevel < 0 || bloodLevel > 300) {
      errs.bloodLevel = "0–300 ng/g lipid";
    }
    if (!bmi || bmi < 10 || bmi > 50) {
      errs.bmi = "10–50";
    }
    if (!age || age < 10 || age > 45) {
      errs.age = "10–45 years";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    validate();
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 submit now also calls backend XAI
  const handleSubmit = async () => {
    if (!validate()) return;

    setXaiResult(null);
    setXaiError("");
    setXaiLoading(true);

    const age = Number(inputs.age);
    const bmi = Number(inputs.bmi);
    const bloodLevel = Number(inputs.bloodLevel); // ng/g lipid
    const foodIntake = Number(inputs.foodIntake); // g/week

    // approximate body weight from BMI at 1.6m height
    const height_m = 1.6;
    const weight = bmi * height_m * height_m;
    const foodPerDay = foodIntake / 7;

    // --- toxicokinetic model (aligned with backend) ---
    // ng/kg-day = (g/day * ng/g) / kg
    const dailyDoseNgPerKg =
      (foodPerDay * bloodLevel) / Math.max(weight, 1e-6);

    // convert to mg/kg-day
    const dailyDoseMgPerKg = dailyDoseNgPerKg * 1e-6;
    const ADD = dailyDoseMgPerKg; // average daily dose (mg/kg-day)

    const RfD = 2e-5; // reference dose (mg/kg-day)
    const CSF = 2.0; // cancer slope factor
    const lifetime = 70; // years

    const HQ_num = ADD / RfD;
    const LADD = (ADD * age) / lifetime;
    const CR_num = LADD * CSF;
    const totalRisk = HQ_num + CR_num;

    // choose icon + label text based on same thresholds as backend CSV model
    let classificationIcon = (
      <i
        className="fa-solid fa-check"
        style={{ color: "#52c41a", fontSize: "1.1rem" }}
      ></i>
    );
    let classificationText = "Safe";

    if (HQ_num > 1 || CR_num > 1e-4) {
      classificationIcon = (
        <i
          className="fa-solid fa-xmark"
          style={{ color: "#ff4d4f", fontSize: "1.1rem" }}
        ></i>
      );
      classificationText = "Critical Risk";
    } else if (
      (HQ_num >= 0.1 && HQ_num <= 1) ||
      (CR_num >= 1e-6 && CR_num <= 1e-4)
    ) {
      classificationIcon = (
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#faad14", fontSize: "1.1rem" }}
        ></i>
      );
      classificationText = "Requires Monitoring";
    }

    const resultObj = {
      HQ: HQ_num.toFixed(4),
      CR: CR_num.toExponential(2),
      totalRisk,
      classificationIcon,
      classificationText,
      ADDDisplay: ADD.toExponential(4),
      topContributors: [
        { name: "PCB 153", value: 65 },
        { name: "PCB 180", value: 20 },
        { name: "PCB 52", value: 15 },
      ],
    };

    setResult(resultObj);

    // 🔹 call backend SHAP endpoint
    try {
      const payload = {
        m_age: age,
        prepregancy_bmi: bmi,
        HQ: HQ_num,
        CR: CR_num,
        patient_id: "Risk calculator input",
      };

      const res = await axios.post(
        "http://127.0.0.1:8005/xai/from-input",
        payload
      );

      // match shape expected by PatientXaiCard
      const merged = {
        ...res.data,
        hq: HQ_num,
        cr: CR_num,
        patient_id: "Risk calculator input",
      };

      setXaiResult(merged);
    } catch (err) {
      console.error(err);
      setXaiError(
        err.response?.data?.detail ||
          "Explainable AI (SHAP) could not be generated for this input."
      );
    } finally {
      setXaiLoading(false);
    }
  };

  const inputField = (label, name, helper, type = "number") => (
    <div style={styles.inputFieldWrap}>
      <div style={styles.inputLabel}>
        <span>{label}</span>
        {helper && (
          <Tooltip title={helper}>
            <InfoCircleOutlined style={{ color: "#7c3aed" }} />
          </Tooltip>
        )}
      </div>
      <input
        name={name}
        value={inputs[name]}
        onChange={handleChange}
        type={type}
        placeholder={errors[name] ? errors[name] : label}
        style={styles.inputBox(!!errors[name])}
      />
      {errors[name] && (
        <div style={styles.errorText}>{errors[name]}</div>
      )}
    </div>
  );

  const RiskResults = ({ result }) => {
    if (!result) {
      return (
        <div style={styles.resultWrapper}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            No prediction yet
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#4b5563",
              lineHeight: 1.5,
            }}
          >
            Enter your profile (age, BMI, PCB blood level, diet intake) and
            click <strong>Predict Risk</strong> to estimate exposure concern.
          </p>
        </div>
      );
    }

    const {
      HQ,
      CR,
      totalRisk,
      classificationIcon,
      classificationText,
      ADDDisplay,
      topContributors,
    } = result;

    const hqValue = Number(HQ);
    const crValue = Number(CR);

    const getRiskMeterPercent = (HQnum, CRnum) => {
      if (HQnum < 0.1 && CRnum < 1e-6) return 10;
      if (
        (HQnum >= 0.1 && HQnum <= 1) ||
        (CRnum >= 1e-6 && CRnum <= 1e-4)
      )
        return 55;
      return 95;
    };

    let barColor = "#52c41a"; // green
    if (hqValue > 1 || crValue > 1e-4) {
      barColor = "#ff4d4f"; // red
    } else if (
      (hqValue >= 0.1 && hqValue <= 1) ||
      (crValue >= 1e-6 && crValue <= 1e-4)
    ) {
      barColor = "#faad14"; // yellow
    }

    return (
      <div style={styles.resultWrapper}>
        {/* Classification summary */}
        <div style={styles.resultHeader(barColor)}>
          <div style={styles.classificationText(barColor)}>
            {classificationIcon}
            <span>{classificationText}</span>
          </div>

          <div style={styles.metricText}>
            <Tooltip title="Average Daily Dose (ADD) is the estimated dose in mg/kg-day based on diet, body weight, and blood PCB level.">
              <span style={styles.metricLabel}>ADD (mg/kg-day): </span>
              {ADDDisplay} <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div style={styles.metricText}>
            <Tooltip title="Hazard Quotient (HQ) compares your estimated daily intake to a reference 'safe' daily dose.">
              <span style={styles.metricLabel}>Hazard Quotient (HQ): </span>
              {HQ} <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div style={styles.metricText}>
            <Tooltip title="Cancer Risk (CR) is the modeled lifetime extra cancer probability, based on your age and dose.">
              <span style={styles.metricLabel}>Cancer Risk (CR): </span>
              {CR} <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div style={styles.metricText}>
            <Tooltip title="Total Risk is HQ + CR, used to bucket you into Safe / Requires Monitoring / Critical.">
              <span style={styles.metricLabel}>Total Risk: </span>
              {totalRisk.toFixed(4)} <InfoCircleOutlined />
            </Tooltip>
          </div>
        </div>

        {/* Risk Meter */}
        <div style={styles.riskMeterWrap}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Risk Meter
          </div>

          <Tooltip title="This gauge uses the same threshold logic as the CSV model (HQ and CR).">
            <Progress
              percent={getRiskMeterPercent(hqValue, crValue)}
              showInfo
              strokeColor={barColor}
              strokeWidth={22}
              status="active"
            />
          </Tooltip>

          {/* legend at bottom */}
          <div style={styles.riskMeterCaption(barColor)}>
            <div style={styles.legendItem}>
              <i
                className="fa-solid fa-check"
                style={{ color: "#52c41a", fontSize: "0.9rem" }}
              ></i>
              <span>
                Safe (HQ &lt; 0.1 and CR &lt; 1e-6)
              </span>
            </div>

            <span>|</span>

            <div style={styles.legendItem}>
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ color: "#faad14", fontSize: "0.9rem" }}
              ></i>
              <span>
                Requires Monitoring (HQ 0.1–1 or CR 1e-6–1e-4)
              </span>
            </div>

            <span>|</span>

            <div style={styles.legendItem}>
              <i
                className="fa-solid fa-xmark"
                style={{ color: "#ff4d4f", fontSize: "0.9rem" }}
              ></i>
              <span>
                Critical (HQ &gt; 1 or CR &gt; 1e-4)
              </span>
            </div>
          </div>
        </div>

        {/* How we calculated it */}
        <div style={{ marginTop: "1.5rem" }}>
          <Collapse bordered={false} style={styles.calcCollapse}>
            <Panel
              header={
                <span
                  style={{
                    fontWeight: "600",
                    color: "#111827",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  How We Calculated This <InfoCircleOutlined />
                </span>
              }
              key="1"
            >
              <p>
                <strong>Daily Dose (ng/kg-day)</strong> = (Food Intake per day ×
                PCB level in blood) ÷ Body weight
              </p>
              <p>
                Converted to mg/kg-day (× 10⁻⁶), this becomes your{" "}
                <strong>Average Daily Dose (ADD)</strong>, which we compare to
                a reference dose.
              </p>
              <p>
                <strong>HQ</strong> = ADD ÷ RfD
              </p>
              <p>
                <strong>LADD</strong> = (ADD × Age) ÷ Lifetime
              </p>
              <p>
                <strong>CR</strong> = LADD × CSF
              </p>
            </Panel>
          </Collapse>
        </div>

        {/* Top contributors */}
        {topContributors && (
          <div style={styles.contributorsBlock}>
            <div style={styles.contributorsTitle}>Top PCB Contributors</div>
            <div style={styles.chartCard}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topContributors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#7c3aed" barSize={28}>
                    <LabelList
                      dataKey="value"
                      position="right"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fill: "#1f2937",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const essentialValid = ["age", "bmi", "foodIntake", "bloodLevel"].every(
    (key) => inputs[key] !== "" && !errors[key]
  );

  return (
    <div style={styles.pageWrapper}>
      {/* animations for blobs */}
      <style>{keyframes}</style>

      {/* floating backdrop blobs */}
      <FloatingBlob
        size="220px"
        color="#e9d5ff"
        top="8%"
        left="5%"
        delay="0s"
      />
      <FloatingBlob
        size="260px"
        color="#bfdbfe"
        top="45%"
        left="80%"
        delay="2s"
      />
      <FloatingBlob
        size="300px"
        color="#fbcfe8"
        top="75%"
        left="15%"
        delay="4s"
      />

      <div style={styles.contentWrapper}>
        {/* Page header */}
        <div style={styles.headerBlock}>
          <div style={styles.titleRow}>
            <span>PCB Exposure</span>
            <span style={styles.titleAccent}>Risk Calculator</span>
          </div>
          <div style={styles.subText}>
            This tool estimates potential PCB-related exposure concern based on
            diet, blood levels, age, and body mass. It is not a medical
            diagnosis. Please talk to your clinician if you fall in "Requires
            Monitoring" or "Critical".
          </div>
          <div style={styles.headerDivider} />
        </div>

        {/* Two-column layout */}
        <div style={styles.layoutRow}>
          {/* Left Card: inputs */}
          <div style={styles.cardSection}>
            <div style={styles.sectionTitle}>
              <span>Patient Profile / Inputs</span>
              <Tooltip title="We use these to estimate PCB intake per body weight.">
                <InfoCircleOutlined style={{ color: "#7c3aed" }} />
              </Tooltip>
            </div>

            {/* Essential Inputs */}
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#6b7280",
                marginBottom: "0.75rem",
              }}
            >
              Essential Inputs
            </div>

            {inputField("Age (10–45)", "age", "Used for lifetime risk scaling")}
            {inputField(
              "BMI (10–50)",
              "bmi",
              "Used to approximate body weight"
            )}
            {inputField(
              "PCB Blood Level (0–300 ng/g lipid)",
              "bloodLevel",
              "Higher = more circulating PCB burden"
            )}
            {inputField(
              "Food Intake (10–300 g/week fish & high-fat foods)",
              "foodIntake",
              "Diet is the main PCB source in many regions"
            )}

            {/* Additional Inputs */}
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#6b7280",
                margin: "1.5rem 0 0.75rem 0",
              }}
            >
              Additional (context only, not used in the current numeric score)
            </div>

            {inputField("Education Level", "education", null, "text")}
            {inputField(
              "Region",
              "region",
              "Where you live can affect exposure patterns",
              "text"
            )}
            {inputField("Parity", "parity", "Number of previous births")}
            {inputField(
              "Pregnancy Status",
              "pregnant",
              "e.g. 2nd trimester, postpartum, etc.",
              "text"
            )}
            {inputField(
              "Smoking Status",
              "smoking",
              "e.g. non-smoker / former / current",
              "text"
            )}
            {inputField(
              "Fish Servings per Week",
              "fishServings",
              "Approximate number of fish/seafood meals weekly"
            )}
            {inputField(
              "Occupational Exposure",
              "occupationalExposure",
              "e.g. works in industry / lab handling chemicals",
              "text"
            )}

            <button
              onClick={handleSubmit}
              disabled={!essentialValid}
              style={styles.predictButton(essentialValid)}
            >
              Predict Risk
            </button>
          </div>

          {/* Right Card: results + XAI */}
          <div style={styles.cardSection}>
            <div style={styles.sectionTitle}>
              <span>Your Result</span>
            </div>

            <RiskResults result={result} />

            {/* XAI status + card */}
            {xaiLoading && (
              <div style={{ marginTop: "1rem" }}>
                <Alert
                  type="info"
                  showIcon
                  message="Generating explainable AI view for this patient..."
                />
              </div>
            )}

            {xaiError && (
              <div style={{ marginTop: "1rem" }}>
                <Alert type="warning" showIcon message={xaiError} />
              </div>
            )}

            {xaiResult && (
              <div style={{ marginTop: "1.5rem" }}>
                <PatientXaiCard patient={xaiResult} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;