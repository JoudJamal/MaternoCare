import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const expectedHeaders = ["age", "bmi", "pcb_sum", "foodIntake"];

const UploadGuidelines = () => {
  return (
    <Card style={{ marginBottom: "2rem" }}>
      <Title level={4}>📋 Upload Guidelines</Title>
      <Paragraph>Make sure your CSV includes the following columns:</Paragraph>
      <ul>
        {expectedHeaders.map((col) => (
          <li key={col}><code>{col}</code></li>
        ))}
      </ul>
      <Paragraph style={{ color: "gray" }}>
        Optional columns like <code>education</code>, <code>region</code>, <code>pregnant</code>, <code>parity</code> can be included for future ML enhancements.
      </Paragraph>
    </Card>
  );
};

export default UploadGuidelines;