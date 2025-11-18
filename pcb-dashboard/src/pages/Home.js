import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldAlert, Baby, ArrowRight } from "lucide-react";

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
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
    padding: "4rem 1.5rem 0 1.5rem",
  },
  heroSection: {
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
  heroSubtitle: {
    fontSize: "1.25rem",
    color: "#4b5563",
    maxWidth: "750px",
    margin: "0.5rem auto 0 auto",
    lineHeight: 1.6,
  },
  pulseDivider: {
    width: "5rem",
    height: "4px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "9999px",
    margin: "1.5rem auto 0",
    animation: "pulse 2s ease-in-out infinite",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    textAlign: "left",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    marginBottom: "4rem",
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    padding: "1.5rem",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "2px solid rgba(124, 58, 237, 0.08)", // light lavender border
    transition: "all 0.3s ease",
  },
  featureTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem",
    lineHeight: 1.4,
  },
  featureDesc: {
    color: "#4b5563",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    flexGrow: 1,
  },
  linkRow: {
    marginTop: "1rem",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "500",
    color: "#7c3aed",
    fontSize: "0.95rem",
    textDecoration: "none",
    gap: "0.4rem",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },

  calloutWrapper: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    border: "2px solid rgba(124, 58, 237, 0.08)",
    padding: "1.5rem",
    marginBottom: "4rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  calloutBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  iconBubble: {
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
    fontWeight: "600",
  },
  calloutTextWrap: {
    flexGrow: 1,
  },
  calloutTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.25rem",
    lineHeight: 1.4,
  },
  calloutDesc: {
    fontSize: "0.9rem",
    color: "#4b5563",
    lineHeight: 1.5,
  },

  bannerWrapper: {
    marginTop: "3rem",
    borderRadius: "1rem",
    overflow: "hidden",
    position: "relative",
    minHeight: "360px",
    boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    minHeight: "360px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.9)",
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "2rem",
  },
  bannerTextBlock: {
    maxWidth: "800px",
    fontFamily: "Cinzel, serif",
    fontStyle: "italic",
    fontWeight: "600",
    fontSize: "2rem",
    lineHeight: 1.3,
    color: "#3C1C56",
    textShadow: "0 1px 2px rgba(255,255,255,0.8)",
  },
};

// animated background blobs like in WhatIsPCB
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

// soft animated gradient blobs in background
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

const Home = () => {
  // hover state to animate cards on hover
  const [hoveredCard, setHoveredCard] = useState(null);

  // cards from your original design
  const cards = [
    {
      title: "What is PCB?",
      description:
        "Learn about the harmful effects of Polychlorinated Biphenyls (PCBs) and how they impact health.",
      link: "/whatispcb",
      buttonText: "Read More",
    },
    {
      title: "Tips for Pregnant Women",
      description:
        "Important safety measures and tips to avoid PCB exposure during pregnancy.",
      link: "/tips",
      buttonText: "Read More",
    },
    {
      title: "PCB Diagram",
      description:
        "How PCB enters the body and what it means for fetal safety. Visual, simple, science-based.",
      link: "/pcbdrawing",
      buttonText: "View Diagram",
    },
    {
      title: "View PCB Compounds",
      description:
        "Explore different PCB compounds and their health risks through 3D molecular models.",
      link: "/viewer",
      buttonText: "View Now",
    },
    {
      title: "Calculate Your Risk",
      description:
        "Input your data and estimate your possible PCB-related health risk using our model.",
      link: "/calculator",
      buttonText: "Start Calculation",
    },
    {
      title: "Live Monitoring (Research Use)",
      description:
        "Upload multiple patient datasets, track risk levels, and view analysis in real time.",
      link: "/livemonitoring",
      buttonText: "Open Dashboard",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* inject keyframes */}
      <style>{keyframes}</style>

      {/* floating background blobs */}
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
        top="50%"
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

      <div style={styles.contentWrapper}>
        {/* HERO */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Welcome to MaternoCare
            <span style={{ color: "#7c3aed" }}>.</span>
          </h1>
          <div style={styles.pulseDivider} />
          <p style={styles.heroSubtitle}>
            We help you understand exposure risks like PCBs during pregnancy,
            interpret what they might mean for maternal and fetal health, and
            take action early — with science backing every step.
          </p>
        </section>

        {/* FEATURE GRID */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={styles.sectionHeader}>
            <span
              style={{
                background:
                  "linear-gradient(to right,#7c3aed,#2563eb 60%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: 700,
              }}
            >
              Explore the platform
            </span>
          </h2>

          <div style={styles.featuresGrid}>
            {cards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.featureCard,
                  transform:
                    hoveredCard === idx ? "translateY(-4px) scale(1.02)" : "none",
                  boxShadow:
                    hoveredCard === idx
                      ? "0 20px 35px rgba(0,0,0,0.15)"
                      : styles.featureCard.boxShadow,
                }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div>
                  <div style={styles.featureTitle}>{card.title}</div>
                  <div style={styles.featureDesc}>{card.description}</div>
                </div>

                <Link
                  to={card.link}
                  style={{
                    ...styles.linkRow,
                    color: hoveredCard === idx ? "#5b21b6" : "#7c3aed",
                  }}
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight
                    size={16}
                    style={{
                      transition: "transform 0.2s ease",
                      transform:
                        hoveredCard === idx
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* WHY MATERNocare / CALL OUT */}
        <section>
          <h2 style={styles.sectionHeader}>
            <span
              style={{
                background:
                  "linear-gradient(to right,#7c3aed,#2563eb 60%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: 700,
              }}
            >
              Why MaternoCare matters
            </span>
          </h2>

          <div style={styles.calloutWrapper}>
            {/* Immune / toxicity */}
            <div style={styles.calloutBox}>
              <div style={styles.iconBubble}>
                <ShieldAlert
                  size={20}
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
              </div>
              <div style={styles.calloutTextWrap}>
                <div style={styles.calloutTitle}>
                  Environmental toxins still circulate
                </div>
                <div style={styles.calloutDesc}>
                  Even though many PCBs were banned, they persist in food chains
                  and can accumulate in the body over time. MaternoCare gives
                  you clarity on that risk instead of guessing.
                </div>
              </div>
            </div>

            {/* Pregnancy risk */}
            <div style={styles.calloutBox}>
              <div style={styles.iconBubble}>
                <Baby
                  size={20}
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
              </div>
              <div style={styles.calloutTextWrap}>
                <div style={styles.calloutTitle}>
                  Pregnancy is a sensitive window
                </div>
                <div style={styles.calloutDesc}>
                  Research links PCB exposure to thyroid disruption, lower birth
                  weight, and neurodevelopmental changes. We highlight what
                  matters for you and your baby.
                </div>
              </div>
            </div>

            {/* Action / Monitoring */}
            <div style={styles.calloutBox}>
              <div style={styles.iconBubble}>
                <Activity
                  size={20}
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
              </div>
              <div style={styles.calloutTextWrap}>
                <div style={styles.calloutTitle}>
                  From awareness to action
                </div>
                <div style={styles.calloutDesc}>
                  You can explore exposure pathways, get safety tips, calculate
                  potential risk levels, and — if you’re a clinician or
                  researcher — monitor multiple patients at once.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER / MISSION IMAGE */}
        <section style={styles.bannerWrapper}>
          <div
            style={{
              ...styles.bannerImage,
              backgroundImage: `url(${require("../images/womenBaby.jpg")})`,
            }}
          />
          <div style={styles.bannerOverlay}>
            <div style={styles.bannerTextBlock}>
              We aim to educate and protect women and their babies from PCB
              exposure during pregnancy.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
