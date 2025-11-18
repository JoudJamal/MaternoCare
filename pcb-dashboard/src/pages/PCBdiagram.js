import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

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
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
    padding: "4rem 1.5rem 3rem 1.5rem",
  },

  headerBlock: {
    textAlign: "center",
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
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  titleAccent: {
    background: "linear-gradient(to right,#7c3aed,#2563eb 60%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: 800,
  },
  subtitleText: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#4b5563",
    maxWidth: "700px",
    margin: "0.75rem auto 0 auto",
  },
  headerDivider: {
    width: "4rem",
    height: "4px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "9999px",
    margin: "1.5rem auto 0 auto",
    animation: "pulse 2s ease-in-out infinite",
  },

  warningCallout: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124,58,237,0.12)",
    padding: "1rem 1rem",
    maxWidth: "650px",
    margin: "2rem auto 2.5rem auto",
    textAlign: "left",
  },
  warningIconBubble: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(124,58,237,0.25)",
    flexShrink: 0,
  },
  warningTextWrap: {
    flex: 1,
  },
  warningTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 1.4,
    marginBottom: "0.4rem",
  },
  warningDesc: {
    fontSize: "0.9rem",
    color: "#4b5563",
    lineHeight: 1.5,
  },

  diagramCard: {
    position: "relative",
    margin: "0 auto",
    maxWidth: "1000px",
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "2px solid rgba(124,58,237,0.08)",
    boxShadow: "0 20px 35px rgba(0,0,0,0.12)",
    padding: "1rem",
  },

  diagramInner: {
    position: "relative",
    borderRadius: "0.75rem",
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  bottomNote: {
    textAlign: "center",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#4b5563",
    marginTop: "2rem",
  },

  calculatorLink: {
    fontWeight: "600",
    color: "#7c3aed",
    textDecoration: "none",
  },
};

// shared keyframes for page motion and hotspot pulse
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; box-shadow:0 0 8px rgba(124,58,237,0.4); }
    50% { opacity:.8; box-shadow:0 0 16px rgba(124,58,237,0.7); }
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

const PCBDiagram = () => {
  const [hovered, setHovered] = useState(null);

  const hotspots = [
    {
      id: "air",
      top: "21%",
      left: "14%",
      text: (
        <>
          <strong>Air &amp; Water Exposure</strong>
          <br />
          PCBs can be absorbed through:
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>Breathing contaminated air</li>
            <li>Drinking polluted water</li>
          </ul>
          These exposures increase cumulative risk, especially in areas with
          legacy PCB pollution.
        </>
      ),
    },
    {
      id: "food",
      top: "40.5%",
      left: "10.5%",
      text: (
        <>
          <strong>Dietary Intake</strong>
          <br />
          PCBs are commonly found in:
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>Fish (especially fatty fish)</li>
            <li>Liver and other high-fat foods</li>
          </ul>
          These are major exposure routes for pregnant women.
        </>
      ),
    },
    {
      id: "bmi",
      top: "58.5%",
      left: "15.5%",
      text: (
        <>
          <strong>Maternal BMI</strong>
          <br />
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>Higher BMI → More PCBs stored in fat</li>
            <li>Lower BMI → Greater PCB circulation &amp; effect</li>
          </ul>
          BMI affects how PCBs are distributed and how much reaches the fetus.
        </>
      ),
    },
    {
      id: "pregnant",
      top: "44.5%",
      left: "34%",
      text: (
        <>
          <strong>Placental Transfer</strong>
          <br />
          PCBs in maternal blood can cross into the fetus.
          <br />
          <br />
          Exposure may lead to:
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>Neurodevelopmental changes</li>
            <li>Hormonal disruptions</li>
            <li>Low birth weight</li>
          </ul>
        </>
      ),
    },
    {
      id: "molecule",
      top: "34.5%",
      left: "51.5%",
      text: (
        <>
          <strong>AI Risk Assessment</strong>
          <br />
          This node represents the machine learning model trained on maternal
          PCB exposure data.
          <br />
          <br />
          The model:
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>
              Predicts <strong>cancer &amp; non-cancer risk</strong>
            </li>
            <li>
              Uses maternal factors (diet, BMI, blood, etc.)
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "riskOutput",
      top: "67%",
      left: "79.4%",
      text: (
        <>
          <strong>Combined Risk Evaluation</strong>
          <br />
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>
              If <strong>both CR &gt; 10⁻⁶</strong> and{" "}
              <strong>HQ &gt; 1</strong> → High-risk exposure
            </li>
            <li>
              If <strong>only one</strong> exceeds threshold → Toxic or
              carcinogenic concern
            </li>
          </ul>
          This logic determines total exposure severity per individual.
        </>
      ),
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* keyframes for animation */}
      <style>{keyframes}</style>

      {/* animated background blobs */}
      <FloatingBlob
        size="220px"
        color="#e9d5ff"
        top="10%"
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
        {/* Header */}
        <div style={styles.headerBlock}>
          <div style={styles.titleRow}>
            <span>How PCB Exposure Reaches</span>
            <span style={styles.titleAccent}>You &amp; Baby</span>
          </div>
          <p style={styles.subtitleText}>
            Every dot in the diagram below represents a real pathway: how PCBs
            get into the body, how they move through blood and stored fat, how
            they cross the placenta, and how we estimate actual risk.
          </p>
          <div style={styles.headerDivider} />
        </div>

        {/* Warning / context */}
        <div style={styles.warningCallout}>
          <div style={styles.warningIconBubble}>
            <AlertTriangle
              size={18}
              style={{ animation: "pulse 3s ease-in-out infinite" }}
            />
          </div>
          <div style={styles.warningTextWrap}>
            <div style={styles.warningTitle}>
              Hover or tap the glowing points in the diagram
            </div>
            <div style={styles.warningDesc}>
              The info is personalized for pregnancy: diet, BMI, fetal
              transfer, and how our AI model flags potential carcinogenic and
              non-carcinogenic risks.
            </div>
          </div>
        </div>

        {/* Diagram card */}
        <div style={styles.diagramCard}>
          <div style={styles.diagramInner}>
            <img
              src="/pcbfinal.svg"
              alt="PCB Diagram"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "0.5rem",
              }}
            />

            {/* Hotspots */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                onMouseEnter={() => setHovered(spot)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() =>
                  setHovered((prev) => (prev?.id === spot.id ? null : spot))
                }
                style={{
                  position: "absolute",
                  top: spot.top,
                  left: spot.left,
                  width: "18px",
                  height: "18px",
                  backgroundColor: "#7c3aed",
                  borderRadius: "50%",
                  border: "2px solid white",
                  animation:
                    hovered?.id === spot.id
                      ? "pulse 1.5s ease-in-out infinite"
                      : "pulse 3s ease-in-out infinite",
                  boxShadow:
                    hovered?.id === spot.id
                      ? "0 0 16px rgba(124,58,237,0.7)"
                      : "0 0 8px rgba(124,58,237,0.4)",
                  cursor: "pointer",
                  zIndex: 5,
                  transition: "all 0.15s ease-in-out",
                }}
              />
            ))}

            {/* Tooltip */}
            {hovered && (
              <div
                style={{
                  position: "absolute",
                  top: `calc(${hovered.top} - 10px)`,
                  left: `calc(${hovered.left} + 30px)`,
                  minWidth: "250px",
                  maxWidth: "260px",
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "2px solid rgba(124,58,237,0.12)",
                  boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
                  padding: "0.75rem 1rem",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  color: "#1f2937",
                  zIndex: 10,
                }}
              >
                {hovered.text}
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <div style={styles.bottomNote}>
          Check your personal scenario using{" "}
          <a href="/calculator" style={styles.calculatorLink}>
            the MaternoCare risk calculator
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PCBDiagram;
