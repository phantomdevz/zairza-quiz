import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Shield, User, Terminal, LogOut, ExternalLink, ChevronDown, CheckCircle } from "lucide-react";

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    activeCandidate,
    setActiveCandidate,
    isAdminLoggedIn,
    logoutAdmin,
    isQuizActive
  } = useQuiz();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  // During active quiz, hide navigation to prevent accidental exits
  if (isQuizActive) {
    return (
      <header style={{
        height: "var(--nav-height)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(7, 9, 14, 0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--grad-cyan-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              color: "#000",
              fontFamily: "var(--font-heading)"
            }}>
              Z
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1.05rem", letterSpacing: "0.02em" }}>ZAIRZA INDUCTION 2026</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Wonder • Think • Create</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className="badge badge-emerald">
              <Shield size={14} /> PROCTORED ACTIVE
            </div>
            {activeCandidate && (
              <div className="badge badge-cyan mono">
                ROLL: {activeCandidate.rollNumber}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header style={{
      height: "var(--nav-height)",
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(7, 9, 14, 0.9)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        {/* Brand */}
        <div
          onClick={() => setCurrentView("page1_landing")}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "var(--grad-cyan-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "1.2rem",
            color: "#000",
            fontFamily: "var(--font-heading)",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)"
          }}>
            Z
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
              ZAIRZA <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>INDUCTION '26</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              Wonder • Think • Create
            </div>
          </div>
        </div>

        {/* Right Menu & Page Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Quick Page Navigator Dropdown (Allows testing all 20 pages seamlessly) */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: "0.85rem", minHeight: "38px" }}
            >
              <span>Explore Platform (20 Pages)</span>
              <ChevronDown size={15} />
            </button>

            {navDropdownOpen && (
              <div
                className="glass-panel"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "46px",
                  width: "320px",
                  maxHeight: "440px",
                  overflowY: "auto",
                  padding: "12px",
                  zIndex: 2000,
                  border: "1px solid var(--border-glow)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.8)"
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-cyan)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Candidate Experience (Pages 1–10)
                </div>
                {[
                  { id: "page1_landing", label: "Page 1: Landing / Home" },
                  { id: "page2_register", label: "Page 2: Registration Form" },
                  { id: "page3_countdown", label: "Page 3: Registration Success & Countdown" },
                  { id: "page4_precheck", label: "Page 4: Pre-Quiz System Diagnostics" },
                  { id: "page5_quiz", label: "Page 5: Proctored Quiz Engine" },
                  { id: "page8_success", label: "Page 8: Submission Successful" },
                  { id: "page9_dashboard", label: "Page 9: Candidate Dashboard" },
                  { id: "page10_results", label: "Page 10: Performance Scorecard" }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setNavDropdownOpen(false);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      background: currentView === item.id ? "rgba(6, 182, 212, 0.15)" : "transparent",
                      color: currentView === item.id ? "var(--accent-cyan)" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{item.label}</span>
                    {currentView === item.id && <CheckCircle size={14} />}
                  </div>
                ))}

                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-purple)", marginTop: "14px", marginBottom: "8px", textTransform: "uppercase" }}>
                  Admin Suite (Pages 11–20)
                </div>
                {[
                  { id: "page11_login", label: "Page 11: Admin Login / 2FA" },
                  { id: "page12_admin_dashboard", label: "Page 12: Admin Master Dashboard" },
                  { id: "page13_registrations", label: "Page 13: Candidate Registrations" },
                  { id: "page14_candidate_details", label: "Page 14: Candidate Details Profiler" },
                  { id: "page15_proctoring", label: "Page 15: Live Proctoring Deck" },
                  { id: "page16_question_bank", label: "Page 16: Question Bank Studio" },
                  { id: "page17_quiz_config", label: "Page 17: Quiz Configuration" },
                  { id: "page18_analytics", label: "Page 18: Results & Shortlisting" },
                  { id: "page19_audit_logs", label: "Page 19: Audit & Security Trail" },
                  { id: "page20_users", label: "Page 20: Admin RBAC & Users" }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setNavDropdownOpen(false);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      background: currentView === item.id ? "rgba(139, 92, 246, 0.15)" : "transparent",
                      color: currentView === item.id ? "var(--accent-purple)" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{item.label}</span>
                    {currentView === item.id && <CheckCircle size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Candidate Badge or Register CTA */}
          {activeCandidate ? (
            <div
              onClick={() => setCurrentView("page9_dashboard")}
              className="badge badge-cyan mono"
              style={{ cursor: "pointer", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
              title="Click to view candidate dashboard"
            >
              <User size={14} />
              <span>ROLL: {activeCandidate.rollNumber}</span>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView("page2_register")}
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.85rem", minHeight: "38px" }}
            >
              Register
            </button>
          )}

          {/* Admin Switcher */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                logoutAdmin();
                setCurrentView("page1_landing");
              }}
              className="btn btn-secondary"
              style={{ padding: "8px 12px", fontSize: "0.85rem", minHeight: "38px" }}
              title="Logout Admin"
            >
              <LogOut size={15} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView("page11_login")}
              className="btn btn-secondary"
              style={{ padding: "8px 12px", fontSize: "0.85rem", minHeight: "38px" }}
              title="Admin Portal"
            >
              <Terminal size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
