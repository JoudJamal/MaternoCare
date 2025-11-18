{/* HEADER: title + badge, stacked */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    marginBottom: "1rem",
  }}
>
  <div
    style={{
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#111827",
      lineHeight: 1.4,
    }}
  >
    Predicted probability of high PCB risk
  </div>

  <div
    style={{
      alignSelf: "flex-start",
      padding: "0.25rem 0.75rem",
      borderRadius: "999px",
      backgroundColor:
        isHighRisk && !belowThreshold ? "#fee2e2" : "#dcfce7",
      color: isHighRisk && !belowThreshold ? "#b91c1c" : "#15803d",
      fontSize: "0.75rem",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    {belowThreshold
      ? "Below PCB risk threshold"
      : isHighRisk
      ? "High Risk (above threshold)"
      : "Around threshold"}
  </div>
</div>