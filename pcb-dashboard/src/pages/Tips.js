// pages/Tips.js
import React, { useState } from "react";
import { ShieldAlert, Baby, AlertTriangle } from "lucide-react";

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
  contentWrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
    padding: "4rem 1.5rem 3rem 1.5rem",
  },

  // top alert / hero
  alertCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124,58,237,0.12)",
    padding: "1.25rem 1rem",
    marginBottom: "2rem",
    animation: "fadeIn 0.8s ease-out",
  },
  alertIconBubble: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(124,58,237,0.25)",
    flexShrink: 0,
  },
  alertTextWrap: {
    flex: 1,
  },
  alertTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 1.4,
    marginBottom: "0.4rem",
  },
  alertDesc: {
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: 1.5,
  },

  headerBlock: {
    textAlign: "left",
    marginBottom: "2rem",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  headerAccent: {
    background: "linear-gradient(to right,#7c3aed,#2563eb 60%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: 800,
  },
  headerDivider: {
    width: "4rem",
    height: "4px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "9999px",
    marginTop: "1rem",
    animation: "pulse 2s ease-in-out infinite",
  },

  // category cards (Diet, Environment, Healthcare)
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  categoryCard: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124, 58, 237, 0.08)",
    padding: "1.5rem",
    transition: "all 0.3s ease",
  },
  categoryTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  categoryTitleText: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
  },
  tipGroup: {
    marginBottom: "1rem",
    borderRadius: "0.75rem",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  tipSummary: {
    cursor: "pointer",
    padding: "0.9rem 1rem",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#1f2937",
    backgroundColor: "rgba(124,58,237,0.05)",
    border: "none",
    outline: "none",
  },
  tipDetail: {
    padding: "0.75rem 1rem 1rem 1rem",
    backgroundColor: "#fff",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#4b5563",
    borderTop: "1px solid #e5e7eb",
  },

  // trimester block
  trimesterSectionWrapper: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124,58,237,0.12)",
    padding: "1.5rem",
  },
  trimesterHeaderRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: "1rem",
    marginBottom: "1.5rem",
  },
  trimesterTitleBlock: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  trimesterTitleText: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 1.3,
  },
  trimesterButtonsRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  trimesterButton: (active) => ({
    padding: "0.6rem 1rem",
    borderRadius: "0.75rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    border: active
      ? "2px solid rgba(124,58,237,0.4)"
      : "2px solid transparent",
    backgroundColor: active ? "#7c3aed" : "#e5e7eb",
    color: active ? "#fff" : "#1f2937",
    boxShadow: active
      ? "0 10px 20px rgba(124,58,237,0.4)"
      : "0 4px 10px rgba(0,0,0,0.08)",
    transition: "all 0.25s ease",
  }),
  trimesterCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    padding: "1rem 1.25rem",
    boxShadow: "inset 0 0 20px rgba(124,58,237,0.05)",
    transition: "all 0.3s ease",
  },
  trimesterList: {
    paddingLeft: "1.25rem",
    margin: 0,
    color: "#374151",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
};

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

const Tips = () => {
  const [selectedTrimester, setSelectedTrimester] = useState("First");
  const [hoveredCard, setHoveredCard] = useState(null);

  // original content, preserved
  const tips = {
    Diet: [
      {
        tip: "Limit intake of fatty fish or seafood known to accumulate PCBs.",
        detail:
          "Large fish like tuna and swordfish accumulate more PCBs due to bioaccumulation.",
      },
      {
        tip: "Wash fruits and vegetables thoroughly.",
        detail:
          "This reduces intake of pesticide-bound and soil-residue PCBs.",
      },
    ],
    Environment: [
      {
        tip: "Avoid using old or industrial-grade electrical appliances.",
        detail:
          "These may still contain PCB-based parts or coolants.",
      },
      {
        tip: "Check local advisories about contaminated water or soil.",
        detail:
          "Local governments often publish maps of known PCB-contaminated areas.",
      },
    ],
    Healthcare: [
      {
        tip: "Consult your healthcare provider if you suspect exposure.",
        detail:
          "They can arrange blood lipid tests or risk counseling if necessary.",
      },
    ],
  };

  const trimesterTips = {
    First: [
      "Emphasize avoiding raw seafood and high-PCB fish.",
      "Get blood tests if you live in high-risk areas.",
    ],
    Second: [
      "Continue reducing exposure via diet and environment.",
      "Ask your doctor before starting any detox-type supplements.",
    ],
    Third: [
      "Keep fish intake low to protect thyroid and fetal brain.",
      "Prepare your home for postnatal exposure reduction (clean dust, remove old capacitors/ballasts).",
    ],
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{keyframes}</style>

      {/* background blobs like other pages */}
      <FloatingBlob
        size="220px"
        color="#e9d5ff"
        top="5%"
        left="5%"
        delay="0s"
      />
      <FloatingBlob
        size="260px"
        color="#bfdbfe"
        top="40%"
        left="75%"
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
        {/* ALERT / CONTEXT */}
        <div style={styles.alertCard}>
          <div style={styles.alertIconBubble}>
            <ShieldAlert
              size={20}
              style={{ animation: "pulse 3s ease-in-out infinite" }}
            />
          </div>
          <div style={styles.alertTextWrap}>
            <div style={styles.alertTitle}>
              Pregnancy + PCB exposure needs special attention
            </div>
            <div style={styles.alertDesc}>
              Pregnant women can be more vulnerable to PCB-related developmental
              risks. If you think you were exposed, talk to your clinician —
              they may order blood lipid PCB analysis or help you plan diet and
              environment changes.
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div style={styles.headerBlock}>
          <div style={styles.headerTitle}>
            Tips for{" "}
            <span style={styles.headerAccent}>Pregnant Women</span>
            <Baby
              size={24}
              color="#7c3aed"
              style={{ animation: "pulse 3s ease-in-out infinite" }}
            />
          </div>
          <div style={styles.headerDivider} />
        </div>

        {/* CATEGORY CARDS */}
        <div style={styles.categoriesGrid}>
          {Object.entries(tips).map(([category, tipsArr], idx) => (
            <div
              key={category}
              style={{
                ...styles.categoryCard,
                transform:
                  hoveredCard === idx
                    ? "translateY(-4px) scale(1.02)"
                    : "translateY(0) scale(1)",
                boxShadow:
                  hoveredCard === idx
                    ? "0 20px 35px rgba(0,0,0,0.15)"
                    : "0 10px 20px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.categoryTitleRow}>
                {category === "Diet" && (
                  <div style={styles.alertIconBubble}>
                    <AlertTriangle
                      size={18}
                      style={{ animation: "pulse 3s ease-in-out infinite" }}
                    />
                  </div>
                )}
                {category === "Environment" && (
                  <div style={styles.alertIconBubble}>
                    <ShieldAlert
                      size={18}
                      style={{ animation: "pulse 3s ease-in-out infinite" }}
                    />
                  </div>
                )}
                {category === "Healthcare" && (
                  <div style={styles.alertIconBubble}>
                    <Baby
                      size={18}
                      style={{ animation: "pulse 3s ease-in-out infinite" }}
                    />
                  </div>
                )}

                <div style={styles.categoryTitleText}>{category}</div>
              </div>

              {tipsArr.map(({ tip, detail }, i) => (
                <details key={i} style={styles.tipGroup}>
                  <summary style={styles.tipSummary}>{tip}</summary>
                  <div style={styles.tipDetail}>{detail}</div>
                </details>
              ))}
            </div>
          ))}
        </div>

        {/* TRIMESTER SECTION */}
        <div style={styles.trimesterSectionWrapper}>
          <div style={styles.trimesterHeaderRow}>
            <div style={styles.trimesterTitleBlock}>
              <div style={styles.alertIconBubble}>
                <Baby
                  size={20}
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
              </div>
              <div style={styles.trimesterTitleText}>
                Trimester-specific guidance
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  Bodies change fast in pregnancy — so do exposure priorities.
                </div>
              </div>
            </div>

            <div style={styles.trimesterButtonsRow}>
              {["First", "Second", "Third"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTrimester(t)}
                  style={styles.trimesterButton(selectedTrimester === t)}
                >
                  {t} Trimester
                </button>
              ))}
            </div>
          </div>

          <div style={styles.trimesterCard}>
            <ul style={styles.trimesterList}>
              {trimesterTips[selectedTrimester].map((item, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: "0.5rem",
                    listStyle: "disc",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tips;
