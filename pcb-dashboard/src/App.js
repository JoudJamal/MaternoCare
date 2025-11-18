import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import WhatIsPCB from './pages/WhatIsPCB';
import Tips from './pages/Tips';
import Viewer from './pages/Viewer';
import Calculator from './pages/Calculator';
import PCBDiagram from './pages/PCBdiagram';
import LiveMonitoring from './pages/livemonitoring';
import logo from './images/logo.png';

import './App.css';

function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/whatispcb', label: 'What is PCB?' },
    { path: '/tips', label: 'Tips for Women' },
    { path: '/pcbdrawing', label: 'PCB Diagram' },
    { path: '/viewer', label: 'View PCB Compounds' },
    { path: '/calculator', label: 'Risk Calculator' },
    { path: '/livemonitoring', label: 'Live Monitoring' }
  ];

  const navStyles = {
    wrapper: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled
        ? 'rgba(255,255,255,0.9)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled
        ? '0 14px 30px rgba(0,0,0,0.08)'
        : '0 12px 30px rgba(0,0,0,0.25)',
      padding: scrolled ? '0.3rem 1rem' : '0.45rem 1.1rem', // a bit compact but still fits big logo
    },

    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '1.5rem',
    },

    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      margin: 0,
      lineHeight: 0,
    },

    logo: {
      height: '7rem',      // 🔥 BIG LOGO
      width: 'auto',
      objectFit: 'contain',
      borderRadius: 0,
      margin: 0,
      padding: 0,
      display: 'block',
    },

    navLinksRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      marginLeft: 'auto',
    },

    navLinkBase: (isActive) => ({
      position: 'relative',
      textDecoration: 'none',
      padding: '0.45rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: isActive ? 600 : 500,
      color: scrolled
        ? (isActive ? '#4f46e5' : '#4a5568')
        : (isActive ? '#fff' : 'rgba(255,255,255,0.9)'),
      background: isActive
        ? (scrolled
            ? 'rgba(99,102,241,0.08)'
            : 'rgba(255,255,255,0.18)')
        : 'transparent',
      border: isActive
        ? (scrolled
            ? '1px solid rgba(99,102,241,0.3)'
            : '1px solid rgba(255,255,255,0.4)')
        : '1px solid transparent',
      transition: 'all 0.2s ease',
    }),

    underline: (isActive, scrolled) => ({
      content: '""',
      position: 'absolute',
      left: '50%',
      bottom: '-0.25rem',
      transform: isActive
        ? 'translateX(-50%) scaleX(1)'
        : 'translateX(-50%) scaleX(0)',
      transformOrigin: 'center',
      height: '2px',
      width: '70%',
      borderRadius: '999px',
      background: scrolled
        ? 'linear-gradient(to right,#7c3aed,#2563eb)'
        : 'rgba(255,255,255,0.8)',
      transition: 'transform 0.22s ease',
      pointerEvents: 'none',
    }),
  };

  return (
    <nav style={navStyles.wrapper}>
      <div style={navStyles.inner}>

        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={navStyles.logoContainer}>
            <img
              src={logo}
              alt="MaternoCare Logo"
              style={navStyles.logo}
            />
          </div>
        </Link>

        {/* NAV LINKS */}
        <div style={navStyles.navLinksRow}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={navStyles.navLinkBase(isActive)}
              >
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '0.4rem',
                  }}
                >
                  {link.label}
                  <span style={navStyles.underline(isActive, scrolled)} />
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          color: #1a1a1a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .main-content {
          padding-top: 104px; /* taller nav because of bigger logo */
        }
        @media (max-width: 600px) {
          .main-content {
            padding-top: 110px;
          }
        }
      `}</style>

      <NavBar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/whatispcb" element={<WhatIsPCB />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/viewer" element={<Viewer />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/pcbdrawing" element={<PCBDiagram />} />
          <Route path="/livemonitoring" element={<LiveMonitoring />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
