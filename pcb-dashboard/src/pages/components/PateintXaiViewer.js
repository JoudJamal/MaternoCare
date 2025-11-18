// src/pages/components/PateintXaiViewer.js
import React, { useState } from "react";
import { Upload, Button, Table, Tooltip, message, Spin } from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import PatientXaiCard from "./PatientXaiCard";

const PateintXaiViewer = () => {
  const [fileList, setFileList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://127.0.0.1:8005/xai/analyze-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const list = res.data?.patients || [];
      setPatients(list);
      if (!list.length) {
        message.warning("No patients found in CSV.");
      } else {
        message.success(`Loaded ${list.length} patients.`);
      }
    } catch (err) {
      console.error(err);
      message.error(
        err?.response?.data?.detail ||
          "Error running XAI analysis. Check backend logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      setFileList([file]);
      handleUpload(file);
      return false; // prevent auto-upload by AntD
    },
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "patient_id",
      key: "patient_id",
      render: (val, _record, index) => val || `Patient ${index + 1}`,
    },
    {
      title: "High PCB Risk Probability",
      dataIndex: "risk_probability",
      key: "risk_probability",
      render: (_, record) => {
        let p =
          record.risk_probability ??
          record.risk_prob ??
          record.probability ??
          record.pcb_risk_probability;

        if (p == null) return "—";

        if (p <= 1) p = p * 100;
        const pct = Number.isFinite(p) ? p.toFixed(0) : "—";
        return `${pct}%`;
      },
    },
    {
      title: "Risk label",
      dataIndex: "risk_label",
      key: "risk_label",
      render: (val) => val || "—",
    },
    {
      title: "HQ",
      dataIndex: "hq",
      key: "hq",
      render: (val) =>
        val === null || val === undefined ? "—" : Number(val).toExponential(2),
    },
    {
      title: "CR",
      dataIndex: "cr",
      key: "cr",
      render: (val) =>
        val === null || val === undefined ? "—" : Number(val).toExponential(2),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Open detailed PCB risk profile">
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => setSelectedPatient(record)}
          >
            View profile
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>Explainable PCB Risk (per patient)</h2>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          background: "#fafafa",
        }}
      >
        <p style={{ marginBottom: 8 }}>
          Upload a CSV where each row is a patient (with <b>m_age</b> and{" "}
          <b>prepregnancy_bmi</b>). The backend will run the Random Forest +
          SHAP analysis and return a per-patient explanation.
        </p>

        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload patient CSV</Button>
        </Upload>

        {fileList[0] && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Selected file: <b>{fileList[0].name}</b>
          </div>
        )}

        <Button
          style={{ marginTop: 12 }}
          icon={<DownloadOutlined />}
          href="/example_patient_xai.csv"
          target="_blank"
        >
          Download example CSV
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && patients.length > 0 && (
        <Table
          rowKey={(row, idx) => row.patient_id || idx}
          columns={columns}
          dataSource={patients}
          pagination={{ pageSize: 8 }}
        />
      )}

      {/* Inline “modal-style” card – shows only when a row is selected */}
      {selectedPatient && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedPatient(null)}
        >
          <div
            style={{
              width: "min(960px, 95%)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PatientXaiCard
              patient={selectedPatient}
              onClose={() => setSelectedPatient(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PateintXaiViewer;