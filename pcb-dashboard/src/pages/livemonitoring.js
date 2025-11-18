import React, { useState } from "react";
import { Upload, Button, Tabs, Table, Tooltip, Progress } from "antd";
import {
  UploadOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
  DownloadOutlined,
} from "@ant-design/icons";
import { Activity, AlertCircle, Brain, ShieldAlert, Baby } from "lucide-react";
import axios from "axios";
import PatientXaiCard from "./components/PatientXaiCard";

const { TabPane } = Tabs;

// ---------- SHARED STYLE LANGUAGE ----------
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
  },
  inner: {
    maxWidth: "1200px",
    padding: "4rem 1.5rem",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
  },

  // header
  heroBlock: {
    textAlign: "center",
    marginBottom: "3rem",
    animation: "fadeIn 0.8s ease-out",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "1rem",
    lineHeight: 1.2,
    animation: "slideInLeft 0.6s ease-out",
  },
  heroSub: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#4b5563",
    maxWidth: "700px",
    margin: "0 auto",
  },
  dividerPulse: {
    width: "5rem",
    height: "4px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "9999px",
    margin: "1.25rem auto 0",
    animation: "pulse 2s ease-in-out infinite",
  },

  // step cards
  cardShell: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124, 58, 237, 0.08)",
    padding: "1.5rem",
    transition: "all 0.3s ease",
  },

  sectionHeader: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.5rem",
    lineHeight: 1.3,
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
  },
  stepBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#7c3aed",
    backgroundColor: "#f3e8ff",
    padding: "0.25rem .5rem",
    borderRadius: "9999px",
    lineHeight: 1.2,
  },

  subText: {
    fontSize: ".9rem",
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: "1rem",
  },

  twoColWrap: {
    display: "grid",
    gridTemplateColumns: "minmax(260px,1fr) minmax(260px,1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
  },

  smallInfoList: {
    fontSize: ".9rem",
    color: "#4b5563",
    lineHeight: 1.5,
    margin: 0,
    paddingLeft: "1.25rem",
  },

  // status alert block
  statusShell: {
    marginBottom: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 20px 35px rgba(0,0,0,0.12)",
    overflow: "hidden",
    border: "2px solid transparent",
  },
  statusInner: {
    padding: "1rem 1.25rem 1.25rem",
  },

  // table section
  resultsSectionShell: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  resultsTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
  },
  resultsSubtitle: {
    fontSize: ".8rem",
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: "1rem",
  },

  // expandable interpretation
  faqButton: {
    width: "100%",
    padding: "1.25rem 1rem",
    textAlign: "left",
    backgroundColor: "white",
    border: "2px solid #e9d5ff",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqLeftRow: {
    display: "flex",
    alignItems: "center",
    gap: ".75rem",
  },
  faqQuestion: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#7c3aed",
  },
  faqContentWrap: {
    overflow: "hidden",
    transition: "max-height 0.5s ease, opacity 0.5s ease",
    maxHeight: 0,
    opacity: 0,
  },
  faqContentOpen: {
    maxHeight: "400px",
    opacity: 1,
  },
  faqInner: {
    backgroundColor: "#f3e8ff",
    borderRadius: "1rem",
    padding: "1rem 1.25rem",
    color: "#374151",
    lineHeight: 1.6,
    fontSize: ".9rem",
  },

  // AI summary block
  aiShell: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124, 58, 237, 0.08)",
    padding: "1.5rem",
    marginTop: "2rem",
  },
  aiTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
    fontWeight: 700,
    color: "#111827",
    fontSize: "1.1rem",
    marginBottom: ".5rem",
  },
  aiSub: {
    color: "#6b7280",
    fontSize: ".8rem",
    lineHeight: 1.4,
    marginBottom: "1rem",
  },
  aiPre: {
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    fontSize: ".8rem",
    lineHeight: 1.5,
    overflowX: "auto",
    boxShadow:
      "0 30px 50px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)",
  },

  // mini legend row
  legendWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    fontSize: ".8rem",
    color: "#4b5563",
    lineHeight: 1.4,
    marginTop: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    padding: "0.75rem 1rem",
  },

  pill: (bg, textColor, shadow) => ({
    display: "inline-block",
    fontWeight: 600,
    fontSize: ".75rem",
    borderRadius: "9999px",
    padding: ".25rem .6rem",
    lineHeight: 1.2,
    backgroundColor: bg,
    color: textColor,
    boxShadow: shadow,
    minWidth: "6rem",
    textAlign: "center",
  }),
};

// animated floaters
const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
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
  const s = {
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
  return <div style={s} />;
};

// ----------------------------------------------------------------

const LiveMonitoring = () => {
  // data / state
  const [file, setFile] = useState(null);
  const [tab, setTab] = useState("raw");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadResult, setUploadResult] = useState(null); // {success, message, downloadUrl?}
  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [jsonTableData, setJsonTableData] = useState([]);
  const [jsonTableColumns, setJsonTableColumns] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState(null);

  // XAI: per-patient explanations and selected patient card
  const [xaiBySampleId, setXaiBySampleId] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientCard, setShowPatientCard] = useState(false);

  const baseURL = "http://localhost:8005";

  // choose file
  const handleFileChange = (info) => {
    let selected = info?.file?.originFileObj || info?.file;
    if (!selected || !selected.name) {
      setFile(null);
      setUploadResult({
        success: false,
        message: "Please select a CSV file only.",
      });
      return;
    }
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setUploadResult({
        success: false,
        message: "Please select a CSV file only.",
      });
      return;
    }
    setFile(selected);
    setUploadResult(null);
  };

  // upload + analyze
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    setAIAnalysis(null);
    setJsonTableData([]);
    setJsonTableColumns([]);
    setXaiBySampleId({});
    setSelectedPatient(null);
    setShowPatientCard(false);

    try {
      if (tab === "ai") {
        // AI narrative mode (existing /deepseek/ endpoint)
        const response = await axios.post(`${baseURL}/deepseek/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setUploadProgress(Math.round((e.loaded / e.total) * 100)),
        });

        setAIAnalysis(response.data);
        setUploadResult({
          success: true,
          message: "AI analysis completed successfully!",
        });
      } else {
        // clinical metrics mode + XAI per patient
        const [jsonResponse, blobResponse, xaiResponse] = await Promise.all([
          axios.post(`${baseURL}/upload_json/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          axios.post(`${baseURL}/upload/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob",
          }),
          axios.post(`${baseURL}/xai/analyze-csv`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        ]);

        // ---- METRICS TABLE ----
        const data = jsonResponse.data.data.map((item, idx) => ({
          ...item,
          sample_id: String(item.sample_id),
          key: idx,
        }));
        setJsonTableData(data);

        const columns = [
          {
            title: "Patient",
            dataIndex: "sample_id",
            key: "sample_id",
            sorter: (a, b) => a.sample_id.localeCompare(b.sample_id),
          },
          {
            title: "Total PCB",
            dataIndex: "Total_PCB",
            key: "Total_PCB",
            render: (v) => (v != null ? v.toFixed(2) : "—"),
            sorter: (a, b) => a.Total_PCB - b.Total_PCB,
          },
          {
            title: (
              <Tooltip title="Average Daily Dose — daily exposure based on PCB levels">
                ADD
              </Tooltip>
            ),
            dataIndex: "ADD",
            key: "ADD",
            render: (v) => (v != null ? Number(v).toExponential(4) : "—"),
            sorter: (a, b) => a.ADD - b.ADD,
          },
          {
            title: (
              <Tooltip title="Lifetime Average Daily Dose — adjusted over 70 years">
                LADD
              </Tooltip>
            ),
            dataIndex: "LADD",
            key: "LADD",
            render: (v) => (v != null ? Number(v).toExponential(4) : "—"),
            sorter: (a, b) => a.LADD - b.LADD,
          },
          {
            title: (
              <Tooltip title="Hazard Quotient — risk of non-cancer effects">
                HQ
              </Tooltip>
            ),
            dataIndex: "HQ",
            key: "HQ",
            render: (v) => (v != null ? Number(v).toExponential(4) : "—"),
            sorter: (a, b) => a.HQ - b.HQ,
          },
          {
            title: (
              <Tooltip title="Cancer Risk — probability estimate over lifetime">
                CR
              </Tooltip>
            ),
            dataIndex: "CR",
            key: "CR",
            render: (v) => (v != null ? Number(v).toExponential(4) : "—"),
            sorter: (a, b) => a.CR - b.CR,
          },
          {
            title: "Risk Level",
            dataIndex: "Status",
            key: "Status",
            render: (text) => {
              let bg = "rgba(16,185,129,0.12)";
              let color = "#065f46";
              if (text === "Critical Risk") {
                bg = "rgba(239,68,68,0.12)";
                color = "#7f1d1d";
              } else if (text === "Needs Monitoring") {
                bg = "rgba(250,204,21,0.18)";
                color = "#713f12";
              }

              return (
                <div
                  style={{
                    display: "inline-block",
                    minWidth: "6rem",
                    textAlign: "center",
                    padding: ".35rem .6rem",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    fontSize: ".75rem",
                    lineHeight: 1.2,
                    backgroundColor: bg,
                    color,
                    boxShadow:
                      "0 10px 20px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {text}
                </div>
              );
            },
            sorter: (a, b) => a.Status.localeCompare(b.Status),
          },
        ];
        setJsonTableColumns(columns);

        // ---- XAI MAP ----
        const xaiPatients = xaiResponse.data.patients || [];
        const xaiMap = {};
        xaiPatients.forEach((p) => {
          const key = String(p.patient_id ?? p.sample_id ?? p.sampleId ?? "");
          if (key) xaiMap[key] = p;
        });
        setXaiBySampleId(xaiMap);

        setUploadResult({
          success: true,
          message: "Risk analysis complete!",
          downloadUrl: window.URL.createObjectURL(
            new Blob([blobResponse.data], {
              type: "text/csv",
            })
          ),
        });
      }
    } catch (err) {
      let detail = "Something went wrong.";
      try {
        if (err.response?.data instanceof Blob) {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          detail = parsed.detail || parsed.message || detail;
        } else if (typeof err.response?.data === "object") {
          detail =
            err.response.data.detail ||
            err.response.data.message ||
            detail;
        }
      } catch (e) {
        detail = "Failed to parse error from server.";
      }
      setUploadResult({ success: false, message: detail });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // download CSV from analysis
  const handleDownload = () => {
    if (!uploadResult?.downloadUrl) return;
    const a = document.createElement("a");
    a.href = uploadResult.downloadUrl;
    a.download = "pcb_analysis.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{keyframes}</style>

      {/* floating blobs */}
      <FloatingBlob
        size="220px"
        color="#e9d5ff"
        top="10%"
        left="5%"
        delay="0s"
      />
      <FloatingBlob
        size="280px"
        color="#bfdbfe"
        top="55%"
        left="80%"
        delay="2s"
      />
      <FloatingBlob
        size="320px"
        color="#fbcfe8"
        top="75%"
        left="10%"
        delay="4s"
      />

      <div style={styles.inner}>
        {/* HEADER / HERO */}
        <section style={styles.heroBlock}>
          <h1 style={styles.heroTitle}>
            Live Monitoring Dashboard
            <span style={{ color: "#7c3aed" }}>.</span>
          </h1>
          <div style={styles.dividerPulse} />
          <p style={styles.heroSub}>
            Upload multiple patient samples, generate exposure risk metrics
            for each patient, and optionally get an AI summary. This is
            designed for clinicians and researchers tracking PCB exposure
            during pregnancy.
          </p>
        </section>

        {/* STEP BLOCKS */}
        <section style={styles.twoColWrap}>
          {/* STEP 1 / 2 / UPLOAD PANEL */}
          <div
            style={{
              ...styles.cardShell,
              borderLeft: "4px solid #7c3aed",
              transform:
                hoveredBlock === "upload" ? "scale(1.03)" : "scale(1)",
              boxShadow:
                hoveredBlock === "upload"
                  ? "0 20px 30px rgba(0,0,0,0.15)"
                  : styles.cardShell.boxShadow,
            }}
            onMouseEnter={() => setHoveredBlock("upload")}
            onMouseLeave={() => setHoveredBlock(null)}
          >
            <div style={styles.sectionHeader}>
              <span style={styles.stepBadge}>Step 1</span>
              <span>Upload CSV</span>
            </div>
            <div style={styles.subText}>
              Each row is one patient/sample. CSV only.
            </div>

            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
              accept=".csv"
            >
              <Button
                icon={<UploadOutlined />}
                disabled={isUploading}
                style={{
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {file ? "Choose Different File" : "Select CSV File"}
              </Button>
            </Upload>

            {file && (
              <div
                style={{
                  marginTop: ".75rem",
                  fontSize: ".85rem",
                  color: "#374151",
                  wordBreak: "break-all",
                }}
              >
                <strong>Selected:</strong> {file.name}
              </div>
            )}

            {isUploading && (
              <div style={{ marginTop: "1rem" }}>
                <Progress percent={uploadProgress} />
              </div>
            )}

            <div
              style={{
                ...styles.sectionHeader,
                marginTop: "1.5rem",
              }}
            >
              <span style={styles.stepBadge}>Step 2</span>
              <span>Choose Output Mode</span>
            </div>

            <Tabs
              activeKey={tab}
              onChange={setTab}
              size="large"
              style={{ marginBottom: ".5rem" }}
            >
              <TabPane
                tab="Clinical Metrics"
                key="raw"
                style={{ fontSize: ".9rem" }}
              />
              <TabPane
                tab="AI Narrative Review"
                key="ai"
                style={{ fontSize: ".9rem" }}
              />
            </Tabs>

            <div
              style={{
                fontSize: ".8rem",
                color: "#6b7280",
                lineHeight: 1.5,
                marginBottom: "1rem",
              }}
            >
              <div>
                • <b>Clinical Metrics</b>: table of per-patient exposure
                (ADD / LADD / HQ / CR).
              </div>
              <div>
                • <b>AI Narrative Review</b>: plain-English summary for
                charting / notes.
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleUpload}
              disabled={!file || isUploading}
              style={{
                width: "100%",
                height: "3rem",
                borderRadius: "0.75rem",
                fontWeight: 600,
                fontSize: "1rem",
                background:
                  "linear-gradient(to right,#7c3aed,#2563eb 60%)",
                border: "none",
                boxShadow:
                  "0 20px 30px rgba(124,58,237,0.25), 0 6px 10px rgba(0,0,0,0.08)",
              }}
            >
              {isUploading ? "Processing..." : "Analyze PCB Risk"}
            </Button>
          </div>

          {/* DATA REQUIREMENTS / CONTEXT PANEL */}
          <div
            style={{
              ...styles.cardShell,
              transform:
                hoveredBlock === "info" ? "scale(1.03)" : "scale(1)",
              boxShadow:
                hoveredBlock === "info"
                  ? "0 20px 30px rgba(0,0,0,0.15)"
                  : styles.cardShell.boxShadow,
            }}
            onMouseEnter={() => setHoveredBlock("info")}
            onMouseLeave={() => setHoveredBlock(null)}
          >
            <div style={styles.sectionHeader}>
              <span style={styles.stepBadge}>About Your Data</span>
              <span>What the model expects</span>
            </div>
            <div style={styles.subText}>
              To generate valid risk metrics, your CSV <b>must</b> include
              the following variables:
            </div>

            <ul style={styles.smallInfoList}>
              <li>
                A patient ID column (for example{" "}
                <code>sample_id</code>, <code>patient_id</code>, or{" "}
                <code>case_no</code>). We normalize this to{" "}
                <code>sample_id</code> for display.
              </li>
              <li>
                <code>m_age</code> &mdash; maternal age in years.
              </li>
              <li>
                <code>prepregancy_bmi</code> &mdash; pre-pregnancy BMI.
              </li>
              <li>
                One or more PCB analyte columns whose header contains{" "}
                <code>ng/g_lipid_LOD</code> (for example{" "}
                <code>PCB153_ng/g_lipid_LOD</code>).
              </li>
            </ul>

            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                padding: "0.75rem 1rem",
                fontSize: ".8rem",
                lineHeight: 1.5,
                color: "#6b7280",
                marginTop: "1rem",
              }}
            >
              Rows where any of these required fields are missing or
              non-numeric will be shown with{" "}
              <strong>Risk Level = “Error”</strong> and will not have ADD,
              LADD, HQ, or CR values calculated.
              <br />
              <br />
              These numbers are for <b>research &amp; screening</b> of PCB
              risk, not direct medical diagnosis. Elevated values should be
              interpreted in clinical context.
            </div>
          </div>
        </section>

        {/* STATUS STRIP */}
        {uploadResult && (
          <section
            style={{
              ...styles.statusShell,
              backgroundColor: uploadResult.success
                ? "rgba(240,253,244,0.8)"
                : "rgba(254,242,242,0.8)",
              borderColor: uploadResult.success
                ? "rgba(16,185,129,0.4)"
                : "rgba(239,68,68,0.4)",
            }}
          >
            <div style={styles.statusInner}>
              <div
                style={{
                  display: "flex",
                  gap: ".75rem",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  {uploadResult.success ? (
                    <CheckCircleTwoTone twoToneColor="#10b981" />
                  ) : (
                    <WarningTwoTone twoToneColor="#ef4444" />
                  )}
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      lineHeight: 1.3,
                      color: uploadResult.success
                        ? "#065f46"
                        : "#7f1d1d",
                    }}
                  >
                    {uploadResult.success
                      ? "Analysis Complete"
                      : "Upload Failed"}
                  </div>
                  <div
                    style={{
                      fontSize: ".9rem",
                      color: uploadResult.success
                        ? "#065f46"
                        : "#7f1d1d",
                      lineHeight: 1.4,
                      marginTop: ".25rem",
                    }}
                  >
                    {uploadResult.message}
                  </div>

                  {uploadResult?.success &&
                    uploadResult.downloadUrl && (
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                        style={{
                          marginTop: "0.75rem",
                          borderRadius: "0.5rem",
                          fontWeight: 500,
                          boxShadow:
                            "0 12px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        Download Results CSV
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI SUMMARY SECTION (old /deepseek/ tab) */}
        {aiAnalysis && tab === "ai" && (
          <section style={styles.aiShell}>
            <div style={styles.aiTitleRow}>
              <Brain size={20} color="#7c3aed" />
              <span>AI Narrative Review</span>
            </div>
            <div style={styles.aiSub}>
              Machine-generated overview. Use for notes / chart review,
              not final clinical judgement.
            </div>

            <pre style={styles.aiPre}>
              {JSON.stringify(aiAnalysis, null, 2)}
            </pre>
          </section>
        )}

        {/* TABLE + INTERPRETATION SECTION */}
        {jsonTableData.length > 0 && tab === "raw" && (
          <>
            <section style={styles.resultsSectionShell}>
              <div style={styles.resultsTitle}>
                <Activity size={20} color="#2563eb" />
                <span>Patient Risk Summary</span>
              </div>
              <div style={styles.resultsSubtitle}>
                Each row = one patient/sample. Values are modeled exposure
                metrics derived from PCB concentration. Click a row to view
                a detailed AI explanation and SHAP-style factor breakdown.
              </div>

             <Table
  columns={jsonTableColumns}
  dataSource={jsonTableData}
  pagination={{
    showSizeChanger: true,
    defaultPageSize: 5,
    pageSizeOptions: ["5", "10", "25", "50"],
  }}
  bordered
  rowKey="sample_id"
  onRow={(record) => ({
    onClick: () => {
      const xai = xaiBySampleId[record.sample_id];

      // Always open the card – even if there is no XAI entry
      const mergedPatient = {
        ...(xai || {}),
        // identity
        patient_id: record.sample_id,

        // toxicokinetic metrics
        hq: record.HQ ?? (xai && xai.hq),
        cr: record.CR ?? (xai && xai.cr),
        Total_PCB:
          record.Total_PCB ??
          (xai &&
            (xai.Total_PCB ||
              xai.total_pcb ||
              xai.total_pcb_ng_g_lipid)),

        Status: record.Status,

        // make sure inputs are available to PatientXaiCard
        m_age: record.m_age ?? (xai && (xai.m_age || xai.maternal_age)),
        prepregnancy_bmi:
          record.prepregancy_bmi ??
          record.prepregnancy_bmi ??
          (xai &&
            (xai.prepregnancy_bmi ||
              xai.bmi ||
              xai.prepregancy_bmi)),
      };

      if (!xai) {
        console.warn(
          "No XAI explanation for",
          record.sample_id,
          "- opening card with metrics only"
        );
      }

      setSelectedPatient(mergedPatient);
      setShowPatientCard(true);
    },
  })}
/>

              {/* legend for badges */}
              <div style={styles.legendWrap}>
                <div style={styles.pill("rgba(239,68,68,0.12)", "#7f1d1d")}>
                  Critical Risk
                </div>
                <div
                  style={styles.pill(
                    "rgba(250,204,21,0.18)",
                    "#713f12"
                  )}
                >
                  Needs Monitoring
                </div>
                <div
                  style={styles.pill(
                    "rgba(16,185,129,0.12)",
                    "#065f46"
                  )}
                >
                  Stable / Low
                </div>
              </div>

              {/* “Got an Error?” explanation */}
              <p
                style={{
                  fontSize: ".8rem",
                  color: "#6b7280",
                  marginTop: "0.75rem",
                  lineHeight: 1.5,
                }}
              >
                <strong>Got an “Error” in the Risk Level column?</strong>{" "}
                That means the app couldn’t calculate risk for that
                patient because one or more required variables were
                missing or invalid. This happens when{" "}
                <code>m_age</code> (maternal age),{" "}
                <code>prepregancy_bmi</code> (pre-pregnancy BMI), or all
                PCB measurements (<code>*ng/g_lipid_LOD</code>) are
                missing for that row. Fix those fields in the CSV and
                re-upload to get full ADD, LADD, HQ, and CR values for
                that patient.
              </p>
            </section>

            {/* INTERPRETATION / FAQ STYLE */}
            <section style={{ marginTop: "2rem" }}>
              <button
                onClick={() => setExpandedFaq(!expandedFaq)}
                style={{
                  ...styles.faqButton,
                  boxShadow: expandedFaq
                    ? "0 20px 30px rgba(0,0,0,0.15)"
                    : styles.faqButton.boxShadow,
                  borderColor: expandedFaq ? "#c084fc" : "#e9d5ff",
                }}
              >
                <div style={styles.faqLeftRow}>
                  <Baby
                    size={24}
                    color="#7c3aed"
                    style={{
                      animation: "pulse 3s ease-in-out infinite",
                    }}
                  />
                  <div style={styles.faqQuestion}>
                    How should I interpret “Critical Risk” in pregnancy?
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "#7c3aed",
                    transform: expandedFaq
                      ? "rotate(180deg)"
                      : "rotate(0)",
                    transition: "transform 0.3s ease",
                    display: "inline-block",
                    lineHeight: 1,
                  }}
                >
                  {expandedFaq ? "−" : "+"}
                </span>
              </button>

              <div
                style={{
                  ...styles.faqContentWrap,
                  ...(expandedFaq ? styles.faqContentOpen : {}),
                }}
              >
                <div style={styles.faqInner}>
                  <p style={{ marginTop: 0, marginBottom: "1rem" }}>
                    “Critical Risk” means that the model is estimating
                    relatively high PCB exposure for this sample compared to
                    the reference range we assume. That does <b>not</b> mean
                    confirmed harm. It means: follow-up is recommended.
                  </p>
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    In pregnancy, elevated PCB exposure is linked in research
                    to thyroid disruption, lower birth weight, altered
                    neurodevelopment, and long-term metabolic effects for the
                    child. These findings are strongest for certain congeners
                    and in certain diets (e.g. high fish / dairy intake).
                  </p>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: ".85rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Clinically, this flag says “this sample should be looked
                    at.” It’s a screening tool, not a diagnosis.
                  </p>

                  <div
                    style={{
                      marginTop: "1.25rem",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                      gap: "1rem",
                    }}
                  >
                    <RiskCard
                      icon={<ShieldAlert size={20} />}
                      title="Environmental toxin load"
                      desc="PCBs persist in fat tissue and circulate in the mother’s blood."
                    />
                    <RiskCard
                      icon={<Brain size={20} />}
                      title="Neurodevelopmental concern"
                      desc="Some PCB profiles correlate with cognitive and behavioral differences in early childhood."
                    />
                    <RiskCard
                      icon={<AlertCircle size={20} />}
                      title="Follow-up needed"
                      desc="“Critical” rows are the ones you’d escalate for clinician review, not just routine monitoring."
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* PATIENT XAI OVERLAY CARD */}
        {showPatientCard && selectedPatient && (
          <PatientXaiCard
            patient={selectedPatient}
            onClose={() => setShowPatientCard(false)}
          />
        )}
      </div>
    </div>
  );
};

// small reusable info card for the FAQ section
function RiskCard({ icon, title, desc }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        border: "2px solid rgba(124, 58, 237, 0.08)",
        display: "flex",
        gap: ".75rem",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "9999px",
          backgroundColor: "#f3e8ff",
          color: "#7c3aed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          boxShadow: "0 4px 10px rgba(124,58,237,0.25)",
          flexShrink: 0,
          animation: "pulse 3s ease-in-out infinite",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: ".95rem",
            color: "#111827",
            lineHeight: 1.4,
            marginBottom: ".25rem",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: ".8rem",
            color: "#4b5563",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

export default LiveMonitoring;
