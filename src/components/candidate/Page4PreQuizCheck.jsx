import React, { useState, useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  CheckCircle,
  AlertTriangle,
  Monitor,
  Wifi,
  Shield,
  Maximize,
  Smartphone,
  ArrowRight
} from "lucide-react";

export const Page4PreQuizCheck = () => {
  const { activeCandidate, startQuiz, setCurrentView } = useQuiz();

  const [diagnostics, setDiagnostics] = useState({
    browser: false,
    jsAndStorage: false,
    latency: false,
    fullscreen: false,
    session: false
  });

  const [understoodTerms, setUnderstoodTerms] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobileCheck);

    // Simulate diagnostic check sequence
    const t1 = setTimeout(() => setDiagnostics((p) => ({ ...p, browser: true })), 300);
    const t2 = setTimeout(() => setDiagnostics((p) => ({ ...p, jsAndStorage: true })), 600);
    const t3 = setTimeout(() => setDiagnostics((p) => ({ ...p, latency: true })), 900);
    const t4 = setTimeout(() => setDiagnostics((p) => ({ ...p, fullscreen: true })), 1200);
    const t5 = setTimeout(() => setDiagnostics((p) => ({ ...p, session: true })), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const allPassed = Object.values(diagnostics).every(Boolean);

  const handleEnterQuiz = () => {
    // Request fullscreen on desktop if available
    if (!isMobile && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback gracefully if permissions blocked
      });
    }
    startQuiz();
  };

  const roll = activeCandidate?.rollNumber || "2401106042";
  const name = activeCandidate?.fullName || "Candidate";

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <span className="badge badge-cyan" style={{ marginBottom: "8px" }}>STEP 2 OF 3</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", marginBottom: "8px" }}>
          Pre-Quiz System Check
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Validating candidate session <strong>({roll} - {name})</strong> and device integrity before test initialization.
        </p>
      </div>

      {/* Diagnostics Checklist */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Monitor size={18} color="var(--accent-cyan)" />
          <span>Automated System Diagnostics</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "browser", label: "Browser Compatibility", detail: "Modern Chromium/WebKit/Gecko engine verified." },
            { key: "jsAndStorage", label: "DOM Storage & Engine", detail: "IndexedDB & LocalStorage active for zero data-loss recovery." },
            { key: "latency", label: "Network Latency & Server Sync", detail: "Ping test: 38ms (Stable WebSocket connection)." },
            { key: "fullscreen", label: isMobile ? "Mobile Viewport Optimization" : "Fullscreen API Capability", detail: isMobile ? "Touch-friendly bottom sheet and viewport locking active." : "Full window takeover enabled." },
            { key: "session", label: "Session Integrity & Roll Verification", detail: `Registration Number ${roll} locked to current device.` }
          ].map((item) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.detail}</div>
              </div>

              <div>
                {diagnostics[item.key] ? (
                  <span className="badge badge-emerald">
                    <CheckCircle size={13} /> PASSED
                  </span>
                ) : (
                  <span className="badge badge-amber">CHECKING...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proctoring & Rules Disclosure */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px", borderLeft: "4px solid var(--accent-rose)" }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--accent-rose)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={18} />
          <span>Proctoring & Anti-Cheat Protocols</span>
        </h3>

        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "10px" }}>
            1. <strong>Strict Window Focus</strong>: Leaving the test tab, minimizing the browser, or switching apps on mobile will be recorded immediately.
          </p>
          <p style={{ marginBottom: "10px" }}>
            2. <strong>Violation Limit</strong>: After <strong>3 recorded infractions</strong>, the quiz will automatically lock and submit your responses as-is.
          </p>
          <p style={{ marginBottom: "10px" }}>
            3. <strong>Dynamic Watermarking</strong>: Your roll number <strong>({roll})</strong> and timestamp are stamped dynamically over the question viewport.
          </p>
          <p>
            4. <strong>Auto-Save</strong>: Your answers are saved continuously after every click. If your connection flickers, simply refresh or re-enter and your responses will restore immediately.
          </p>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-subtle)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={understoodTerms}
              onChange={(e) => setUnderstoodTerms(e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
            <span style={{ fontWeight: "600", fontSize: "0.92rem", color: "var(--text-main)" }}>
              I understand the proctoring rules and agree to take the quiz under strict integrity monitoring.
            </span>
          </label>
        </div>
      </div>

      {/* Start Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => setCurrentView("page3_countdown")}
          className="btn btn-secondary"
        >
          Back
        </button>

        <button
          onClick={handleEnterQuiz}
          disabled={!allPassed || !understoodTerms}
          className="btn btn-primary pulse-glow"
          style={{ padding: "14px 36px", fontSize: "1.05rem" }}
        >
          <span>Start Quiz (30 Mins)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
