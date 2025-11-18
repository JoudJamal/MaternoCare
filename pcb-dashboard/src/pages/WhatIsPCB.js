import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Brain, ShieldAlert, Baby } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f3e8ff, #ffffff, #dbeafe)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  contentWrapper: {
    maxWidth: '1200px',
    padding: '4rem 1.5rem',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },
  hero: {
    marginBottom: '4rem',
    textAlign: 'center',
    animation: 'fadeIn 0.8s ease-out'
  },
  mainTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem',
    animation: 'slideInLeft 0.6s ease-out'
  },
  divider: {
    width: '6rem',
    height: '4px',
    background: 'linear-gradient(to right, #7c3aed, #2563eb)',
    borderRadius: '9999px',
    margin: '0 auto 2rem',
    animation: 'pulse 2s ease-in-out infinite'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    marginBottom: '2rem'
  },
  exposureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  exposureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'transform 0.3s ease'
  },
  exposureIcon: {
    width: '7rem',
    height: '7rem',
    color: '#1f2937',
    transition: 'transform 0.3s ease'
  },
  exposureLabel: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  healthCard: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
    transition: 'all 0.5s ease',
    opacity: 0,
    transform: 'translateX(-3rem)'
  },
  healthCardVisible: {
    opacity: 1,
    transform: 'translateX(0)'
  },
  iconWrapper: {
    width: '4rem',
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
    borderRadius: '9999px',
    flexShrink: 0,
    transition: 'transform 0.3s ease'
  },
  timeline: {
    position: 'relative',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  timelineLine: {
    position: 'absolute',
    left: '8rem',
    top: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(to bottom, #7c3aed, #2563eb)'
  },
  timelineItem: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '1.5rem',
    position: 'relative',
    transition: 'all 0.5s ease',
    opacity: 0,
    transform: 'translateX(2rem)'
  },
  timelineItemVisible: {
    opacity: 1,
    transform: 'translateX(0)'
  },
  timelineYear: {
    width: '5rem',
    paddingTop: '0.25rem',
    textAlign: 'right',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#374151'
  },
  timelineDot: {
    position: 'absolute',
    left: '7.75rem',
    width: '1rem',
    height: '1rem',
    backgroundColor: '#7c3aed',
    borderRadius: '9999px'
  },
  timelineContent: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    marginLeft: '2rem',
    transition: 'all 0.3s ease'
  },
  faqButton: {
    width: '100%',
    padding: '1.5rem',
    textAlign: 'left',
    backgroundColor: 'white',
    border: '2px solid #e9d5ff',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem'
  },
  faqContent: {
    overflow: 'hidden',
    transition: 'max-height 0.5s ease, opacity 0.5s ease',
    maxHeight: 0,
    opacity: 0
  },
  faqContentExpanded: {
    maxHeight: '500px',
    opacity: 1
  },
  glossaryItem: {
    display: 'flex',
    alignItems: 'start',
    gap: '0.75rem',
    transition: 'transform 0.3s ease',
    marginBottom: '1rem'
  },
  glossaryDot: {
    width: '0.5rem',
    height: '0.5rem',
    marginTop: '0.5rem',
    backgroundColor: '#7c3aed',
    borderRadius: '9999px',
    flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite'
  },
  glossaryTerm: {
    color: '#734FA3',
    cursor: 'help',
    textDecoration: 'underline dotted',
    position: 'relative'
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#374151',
    width: '200px',
    zIndex: 10000,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease-out',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '0.5rem'
  }
};

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(20px, -20px) rotate(5deg); }
    50% { transform: translate(-15px, -40px) rotate(-5deg); }
    75% { transform: translate(-20px, -20px) rotate(3deg); }
  }
`;

const glossary = {
  "PCB-153": "One of the most common and persistent PCB congeners in human tissues, used as a biomarker for total PCB exposure.",
  "Congeners": "Different chemical forms of PCBs, each with slightly different toxicological profiles.",
  "RfD": "Reference Dose — an estimate of a daily exposure level for the human population that is likely to be without risk of adverse effects.",
  "Methylation": "A chemical process affecting DNA regulation; PCB exposure can alter methylation, impacting fetal development."
};

const FloatingParticle = ({ delay, duration, size }) => {
  const particleStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '9999px',
    backgroundColor: '#e9d5ff',
    opacity: 0.2,
    filter: 'blur(40px)',
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  };
  return <div style={particleStyle} />;
};

const GlossaryTerm = ({ term }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={styles.glossaryTerm}>{term}</span>
      {show && (
        <div style={styles.tooltip}>
          {glossary[term]}
        </div>
      )}
    </span>
  );
};

const ExposureIcon = ({ type, label, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const itemStyle = {
    ...styles.exposureItem,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
    transition: 'all 0.7s ease'
  };

  const iconStyle = {
    ...styles.exposureIcon,
    transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)'
  };

  const icons = {
    contact: (
      <svg viewBox="0 0 100 120" style={iconStyle}>
        <circle cx="50" cy="35" r="20" fill="currentColor" />
        <rect x="30" y="55" width="40" height="45" rx="5" fill="currentColor" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 50 + 30 * Math.cos(angle);
          const y1 = 50 + 30 * Math.sin(angle);
          const x2 = 50 + 45 * Math.cos(angle);
          const y2 = 50 + 45 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" />;
        })}
      </svg>
    ),
    ingestion: (
      <svg viewBox="0 0 100 120" style={iconStyle}>
        <circle cx="50" cy="30" r="18" fill="currentColor" />
        <path d="M 35 48 Q 35 55 40 60 L 40 85 Q 40 95 50 95 Q 60 95 60 85 L 60 60 Q 65 55 65 48 Z" fill="currentColor" />
        <path d="M 50 60 L 35 75 L 40 80 Z" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </path>
        <ellipse cx="42" cy="72" rx="4" ry="6" fill="white" opacity="0.6" />
      </svg>
    ),
    inhalation: (
      <svg viewBox="0 0 100 120" style={iconStyle}>
        <circle cx="50" cy="30" r="18" fill="currentColor" />
        <path d="M 35 48 L 35 70 Q 35 85 50 90 Q 65 85 65 70 L 65 48 Z" fill="currentColor" />
        <path d="M 50 55 L 30 70 L 35 73 Z" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M 50 55 L 70 70 L 65 73 Z" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </path>
        <ellipse cx="43" cy="68" rx="6" ry="8" fill="white" opacity="0.3" />
        <ellipse cx="57" cy="68" rx="6" ry="8" fill="white" opacity="0.3" />
        <circle cx="45" cy="66" r="2" fill="white" />
        <circle cx="55" cy="66" r="2" fill="white" />
      </svg>
    )
  };

  return (
    <div 
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icons[type]}
      <div style={styles.exposureLabel}>{label}</div>
    </div>
  );
};

const WhatIsPCB = () => {
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, entry.target.dataset.index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-index]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const healthImpacts = [
    { icon: <ShieldAlert size={24} />, system: "Immune System", impact: "Suppression of immune response and resistance to infection" },
    { icon: <Activity size={24} />, system: "Endocrine & Reproductive", impact: "Disruption of thyroid hormone balance, reduced fertility" },
    { icon: <Brain size={24} />, system: "Neurological", impact: "Developmental delays and lower IQ in children prenatally exposed" },
    { icon: <AlertCircle size={24} />, system: "Carcinogenic Potential", impact: "Increased risk of liver, breast, and thyroid cancers" }
  ];

  const timeline = [
    { year: "1972", event: "Sweden bans PCBs" },
    { year: "1977", event: "USA officially bans PCBs due to health hazards" },
    { year: "1996", event: "Jacobson study: cognitive effects in PCB-exposed children" },
    { year: "2000", event: "ATSDR publishes toxicological profile" },
    { year: "2003", event: "WHO outlines PCB health risks" },
    { year: "2012", event: "Govarts meta-analysis: PCB-153 linked to reduced birth weight" },
    { year: "2013", event: "MoBa study: diet-based PCB exposure in Norwegian pregnant women" },
    { year: "2021", event: "Berlin et al.: BMI & PCB link to thyroid hormone disruption" },
    { year: "2023", event: "Mouat et al.: PCB exposure affects placental methylation and neurodevelopment" },
    { year: "2024", event: "Schulz et al.: Harmonized PCB congener profiles for health risk models" },
    { year: "2025", event: "MaternoCare: AI-based PCB exposure prediction and fetal health forecasting", highlight: true }
  ];

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <FloatingParticle delay={0} duration={8} size="200px" />
      <FloatingParticle delay={2} duration={10} size="150px" />
      <FloatingParticle delay={4} duration={12} size="250px" />
      <FloatingParticle delay={6} duration={9} size="180px" />

      <div style={styles.contentWrapper}>
        <div style={styles.hero}>
          <h1 style={styles.mainTitle}>What Are PCBs?</h1>
          <div style={styles.divider}></div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              ...styles.card,
              borderLeft: '4px solid #7c3aed',
              animation: 'slideInLeft 0.8s ease-out',
              transform: hoveredCard === 'intro1' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredCard === 'intro1' ? '0 20px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={() => setHoveredCard('intro1')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#374151' }}>
              <strong style={{ fontSize: '1.25rem', color: '#111827' }}>Polychlorinated Biphenyls (PCBs)</strong> are synthetic organic compounds once widely used in industrial applications for their chemical stability and insulating properties. Despite bans in the 1970s and 1980s across Europe and the U.S., PCBs continue to persist in the environment due to their long half-life and resistance to degradation.
            </p>
          </div>

          <div 
            style={{
              ...styles.card,
              animation: 'slideInRight 0.8s ease-out 0.2s both',
              transform: hoveredCard === 'intro2' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredCard === 'intro2' ? '0 20px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={() => setHoveredCard('intro2')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#374151' }}>
              PCBs accumulate in fatty tissues and travel through the food chain. Humans are exposed primarily through ingestion of contaminated food, particularly fish, meat, and dairy. These compounds are classified by the IARC as <strong style={{ color: '#7c3aed' }}>probable human carcinogens</strong> and have been associated with a variety of adverse health outcomes.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={styles.sectionTitle}>How Do PCBs Enter the Body?</h2>
          <div style={styles.exposureGrid}>
            <ExposureIcon type="contact" label="Contact" delay={200} />
            <ExposureIcon type="ingestion" label="Ingestion" delay={400} />
            <ExposureIcon type="inhalation" label="Inhalation" delay={600} />
          </div>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6b7280' }}>
            Exposure pathways: <strong>contact</strong>, <strong>ingestion</strong>, <strong>inhalation</strong>
          </p>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={styles.sectionTitle}>Health Impacts of PCB Exposure</h2>
          {healthImpacts.map((item, index) => {
            const isVisible = visibleCards.includes(String(index));
            const isHovered = hoveredCard === `health-${index}`;
            return (
              <div
                key={index}
                data-index={index}
                style={{
                  ...styles.healthCard,
                  ...(isVisible ? styles.healthCardVisible : {}),
                  transitionDelay: `${index * 100}ms`,
                  transform: isVisible ? (isHovered ? 'translateX(0) scale(1.05)' : 'translateX(0)') : 'translateX(-3rem)',
                  boxShadow: isHovered ? '0 20px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={() => setHoveredCard(`health-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  ...styles.iconWrapper,
                  transform: isHovered ? 'rotate(12deg) scale(1.1)' : 'rotate(0) scale(1)'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>{item.system}</h3>
                  <p style={{ color: '#374151', lineHeight: '1.6' }}>{item.impact}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={styles.sectionTitle}>Scientific & Regulatory Timeline</h2>
          <div style={styles.timeline}>
            <div style={styles.timelineLine}></div>
            {timeline.map((item, index) => {
              const isVisible = visibleCards.includes(`timeline-${index}`);
              const isHovered = hoveredCard === `timeline-${index}`;
              return (
                <div
                  key={index}
                  data-index={`timeline-${index}`}
                  style={{
                    ...styles.timelineItem,
                    ...(isVisible ? styles.timelineItemVisible : {}),
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <div style={{
                    ...styles.timelineYear,
                    color: item.highlight ? '#7c3aed' : '#374151'
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    ...styles.timelineDot,
                    ...(item.highlight ? { 
                      backgroundColor: '#7c3aed',
                      boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.2)',
                      animation: 'pulse 2s ease-in-out infinite'
                    } : {})
                  }}></div>
                  <div 
                    style={{
                      ...styles.timelineContent,
                      ...(item.highlight ? { 
                        backgroundColor: '#f3e8ff',
                        border: '2px solid #7c3aed'
                      } : {}),
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      backgroundColor: isHovered && !item.highlight ? '#f9fafb' : (item.highlight ? '#f3e8ff' : '#f9fafb')
                    }}
                    onMouseEnter={() => setHoveredCard(`timeline-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <p style={{ 
                      color: item.highlight ? '#581c87' : '#1f2937',
                      fontWeight: item.highlight ? '600' : '400'
                    }}>
                      {item.event}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <button
            onClick={() => setExpandedFaq(!expandedFaq)}
            style={{
              ...styles.faqButton,
              transform: hoveredCard === 'faq' ? 'scale(1.02)' : 'scale(1)',
              boxShadow: hoveredCard === 'faq' ? '0 10px 15px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderColor: hoveredCard === 'faq' ? '#c084fc' : '#e9d5ff'
            }}
            onMouseEnter={() => setHoveredCard('faq')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Baby size={24} color="#7c3aed" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#7c3aed' }}>
                  Why are pregnant women especially at risk?
                </span>
              </div>
              <span style={{ 
                fontSize: '1.5rem', 
                color: '#7c3aed',
                transform: expandedFaq ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease',
                display: 'inline-block'
              }}>
                {expandedFaq ? '−' : '+'}
              </span>
            </div>
          </button>
          <div style={{
            ...styles.faqContent,
            ...(expandedFaq ? styles.faqContentExpanded : {})
          }}>
            <div style={{ 
              padding: '1.5rem',
              backgroundColor: '#f3e8ff',
              borderRadius: '1rem'
            }}>
              <p style={{ color: '#374151', lineHeight: '1.8' }}>
                Studies including the MoBa cohort and recent DNA methylation analyses show that PCBs can cross the placenta, disrupt thyroid regulation, and impact early neurodevelopment. These risks are amplified in women with lower BMI or high dietary exposure through fish, dairy, and meat.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Quick Glossary</h3>
          <div style={{ 
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {Object.keys(glossary).map((term, index) => (
              <div
                key={index}
                style={{
                  ...styles.glossaryItem,
                  transform: hoveredCard === `glossary-${index}` ? 'translateX(0.5rem)' : 'translateX(0)'
                }}
                onMouseEnter={() => setHoveredCard(`glossary-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <span style={{
                  ...styles.glossaryDot,
                  animationDuration: `${2 + index * 0.5}s`
                }}></span>
                <GlossaryTerm term={term} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem',
          fontSize: '0.875rem',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '1rem',
          transition: 'box-shadow 0.3s ease',
          boxShadow: hoveredCard === 'sources' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        onMouseEnter={() => setHoveredCard('sources')}
        onMouseLeave={() => setHoveredCard(null)}
        >
          <strong style={{ color: '#1f2937' }}>Sources:</strong> WHO, ATSDR, Stockholm Convention, Jacobson & Jacobson, Govarts et al., Berlin et al., Mouat et al., Schulz et al., Caspersen et al.
        </div>
      </div>
    </div>
  );
};

export default WhatIsPCB;