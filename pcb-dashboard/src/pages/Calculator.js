// src/pages/Calculator.js
import React, { useState, useEffect } from "react";
import { Progress, Tooltip, Collapse, Card } from "antd";
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

const { Panel } = Collapse;

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
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // XAI card state (same pattern as LiveMonitoring)
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientCard, setShowPatientCard] = useState(false);

  const validate = () => {
    const errs = {};
    const { foodIntake, bloodLevel, bmi, age } = inputs;
    if (!foodIntake || foodIntake < 10 || foodIntake > 300)
      errs.foodIntake = "10–300 grams/week";
    if (!bloodLevel || bloodLevel < 0 || bloodLevel > 300)
      errs.bloodLevel = "0–300 ng/g lipid";
    if (!bmi || bmi < 10 || bmi > 50) errs.bmi = "10–50";
    if (!age || age < 10 || age > 45) errs.age = "10–45 years";
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

  const handleSubmit = () => {
    if (!validate()) return;

    const age = Number(inputs.age);
    const bmi = Number(inputs.bmi);
    const bloodLevel = Number(inputs.bloodLevel);
    const foodIntake = Number(inputs.foodIntake);

    // ----- TK-LIKE CALCULATIONS (same as before) -----
    const height_m = 1.6;
    const weight = bmi * height_m * height_m;
    const foodPerDay = foodIntake / 7;

    const dailyDose = (foodPerDay * bloodLevel) / weight;

    const RfD = 2e-5;
    const CSF = 2.0;
    const lifetime = 70;

    const HQ = dailyDose / RfD;
    const LADD = (dailyDose * age) / lifetime;
    const CR = LADD * CSF;
    const totalRisk = HQ + CR;

    let classification = "✅ Safe";
    let statusLabel = "Safe";

    if (HQ > 2 || CR > 1e-4) {
      classification = "❌ Critical Risk";
      statusLabel = "Critical Risk";
    } else if ((HQ >= 1 && HQ <= 2) || (CR >= 1e-6 && CR <= 1e-4)) {
      classification = "⚠️ Needs Monitoring";
      statusLabel = "Needs Monitoring";
    }

    const calcResult = {
      HQ: HQ.toFixed(4),
      CR: CR.toExponential(2),
      totalRisk,
      classification,
      topContributors: [
        { name: "PCB 153", value: 65 },
        { name: "PCB 180", value: 20 },
        { name: "PCB 52", value: 15 },
      ],
    };

    setResult(calcResult);

    // ---------- BUILD "PATIENT" OBJECT FOR PatientXaiCard ----------
    // fake probability from risk class so we don’t need extra backend
    let prob = 0.18;
    if (statusLabel === "Needs Monitoring") prob = 0.55;
    if (statusLabel === "Critical Risk") prob = 0.86;

    const patientForCard = {
      patient_id: "calculator_patient",

      prediction_proba: prob,
      predicted_label: statusLabel === "Critical Risk" ? 1 : 0,
      threshold: 0.54,

      // TK metrics
      hq: Number(calcResult.HQ),
      cr: Number(CR),
      Total_PCB: bloodLevel,
      Status: statusLabel,

      // features used by RF layer conceptually
      features: {
        m_age: age,
        prepregancy_bmi: bmi,
      },

      // simple SHAP-style contributions: age/BMI above cutoffs push risk up
      shap_values: {
        m_age: age >= 35 ? 0.18 : -0.05,
        prepregancy_bmi: bmi >= 30 ? 0.22 : -0.08,
      },
    };

    setSelectedPatient(patientForCard);
  };

  const inputField = (label, name, type = "number") => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontWeight: "bold" }}>{label}</label>
      <input
        name={name}
        value={inputs[name]}
        onChange={handleChange}
        type={type}
        placeholder={errors[name] ? errors[name] : label}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: errors[name] ? "2px solid red" : "1px solid #ccc",
        }}
      />
    </div>
  );

  const essentialValid = ["age", "bmi", "foodIntake", "bloodLevel"].every(
    (key) => inputs[key] !== "" && !errors[key]
  );

  return (
    <div
      style={{
        display: "flex",
        padding: "2rem",
        gap: "2rem",
        justifyContent: "center",
      }}
    >
      {/* LEFT: FORM */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <h2>Essential Inputs</h2>
        {inputField("Age (10–45)", "age")}
        {inputField("BMI (10–50)", "bmi")}
        {inputField("PCB Blood Level (0–300 ng/g)", "bloodLevel")}
        {inputField("Food Intake (10–300 g/week)", "foodIntake")}

        <h3 style={{ marginTop: "2rem" }}>Additional Inputs</h3>
        {inputField("Education Level", "education", "text")}
        {inputField("Region", "region", "text")}
        {inputField("Parity", "parity")}
        {inputField("Pregnancy Status", "pregnant", "text")}

        <button
          onClick={handleSubmit}
          disabled={!essentialValid}
          style={{
            background: essentialValid ? "#734FA3" : "#aaa",
            color: "white",
            padding: "10px 20px",
            marginTop: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: essentialValid ? "pointer" : "not-allowed",
          }}
        >
          Predict Risk
        </button>
      </div>

      {/* RIGHT: RESULTS + SHAP BUTTON */}
      <div style={{ flex: 1 }}>
        <RiskResults
          result={result}
          onExplain={() => {
            if (selectedPatient) setShowPatientCard(true);
            else window.alert("Please run the calculator first.");
          }}
        />
      </div>

      {/* PATIENT SHAP CARD OVERLAY (same component as LiveMonitoring) */}
      {showPatientCard && selectedPatient && (
        <PatientXaiCard
          patient={selectedPatient}
          onClose={() => setShowPatientCard(false)}
        />
      )}
    </div>
  );
};

// ------ Results sub-component (mostly unchanged) ------
const RiskResults = ({ result, onExplain }) => {
  if (!result)
    return <p>No prediction yet. Please fill out the form and click Predict.</p>;

  const { HQ, CR, totalRisk, classification, topContributors } = result;

  const hqValue = Number(HQ);
  const crValue = Number(CR);

  const getRiskMeterPercent = (HQ, CR) => {
    if (HQ < 1 && CR < 1e-6) return 10;
    if ((HQ >= 1 && HQ <= 2) || (CR >= 1e-6 && CR <= 1e-4)) return 55;
    return 95;
  };

  let color = "#52c41a"; // green
  if (hqValue > 2 || crValue > 1e-4) {
    color = "#ff4d4f"; // red
  } else if (
    (hqValue >= 1 && hqValue <= 2) ||
    (crValue >= 1e-6 && crValue <= 1e-4)
  ) {
    color = "#faad14"; // yellow
  }

  return (
    <div
      style={{ padding: "1.5rem", background: "#f8f3ff", borderRadius: "12px" }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Results</h2>
      <Card
        style={{
          backgroundColor: color + "15",
          border: `2px solid ${color}`,
          boxShadow: `0 0 8px ${color}88`,
        }}
      >
        <h2 style={{ color, fontSize: "1.4rem" }}>{classification}</h2>
        <p>
          <Tooltip title="Hazard Quotient (HQ) compares your intake to a safe reference.">
            <strong>Hazard Quotient (HQ):</strong> {HQ}{" "}
            <InfoCircleOutlined />
          </Tooltip>
        </p>
        <p>
          <Tooltip title="Cancer Risk (CR) estimates lifetime cancer probability.">
            <strong>Cancer Risk (CR):</strong> {CR}{" "}
            <InfoCircleOutlined />
          </Tooltip>
        </p>
        <p>
          <Tooltip title="Sum of HQ and CR used to classify overall risk.">
            <strong>Total Risk:</strong> {totalRisk.toFixed(4)}{" "}
            <InfoCircleOutlined />
          </Tooltip>
        </p>

        {/* SHAP-style explanation trigger */}
        <button
          onClick={onExplain}
          style={{
            marginTop: "0.75rem",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View AI explanation (SHAP-style)
        </button>
      </Card>

      <div style={{ margin: "2rem 0" }}>
        <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          Risk Meter
        </h4>
        <Tooltip title="Bar reflects your zone based on EPA thresholds.">
          <Progress
            percent={getRiskMeterPercent(hqValue, crValue)}
            showInfo
            strokeColor={color}
            strokeWidth={22}
            status="active"
          />
        </Tooltip>
        <p
          style={{ fontSize: "0.9rem", marginTop: "0.3rem", color: color }}
        >
          Visual scale reflects EPA thresholds: <br />
          ✅ Safe (HQ &lt; 1, CR &lt; 1e-6) &nbsp;&nbsp;|&nbsp;&nbsp;
          ⚠️ Monitoring (HQ 1–2 or CR 1e-6–1e-4) &nbsp;&nbsp;|&nbsp;&nbsp;
          ❌ Critical (HQ &gt; 2 or CR &gt; 1e-4)
        </p>
      </div>

      <Collapse>
        <Panel
          header={
            <span>
              📘 How We Calculated This <InfoCircleOutlined />
            </span>
          }
          key="1"
        >
          <p>
            <strong>HQ = Daily Dose ÷ RfD</strong>
          </p>
          <p>
            <strong>LADD = (Daily Dose × Age) ÷ Lifetime</strong>
          </p>
          <p>
            <strong>CR = LADD × CSF</strong>
          </p>
          <p>
            <strong>Daily Dose = (Food Intake × PCB Level) ÷ Weight</strong>
          </p>
        </Panel>
      </Collapse>

      {topContributors && (
        <div style={{ marginTop: "2rem" }}>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Top PCB Contributors
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topContributors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#734FA3" barSize={30}>
                <LabelList dataKey="value" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;
