import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Shield, User, Terminal, LogOut, ChevronDown, CheckCircle } from "lucide-react";

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    activeCandidate,
    isAdminLoggedIn,
    logoutAdmin,
    isQuizActive
  } = useQuiz();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  // During active quiz, show minimal HUD to prevent distractions
  if (isQuizActive) {
    return (
      <header style={{
        padding: "16px 0",
        borderBottom: "1px solid var(--line)",
        background: "rgba(11, 12, 16, 0.95)",
        backdropFilter: "blur(6px)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#fff",
              border: "3px solid var(--red)",
              display: "grid",
              placeItems: "center"
            }}>
              <svg width="24" height="24" viewBox="0 0 30 30" aria-hidden="true">
                <circle cx="9" cy="15" r="7" fill="#2f5bff"/>
                <path d="M14 4l12 7-4 4 5 6-9 4-4-7z" fill="#f08a1c"/>
              </svg>
            </div>
            <div>
              <b style={{ fontSize: "1.1rem" }}>Zairza</b>
              <span style={{ display: "block", font: "400 .72rem var(--mono)", color: "var(--mut)" }}>
                Wonder • Think • Create
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="badge badge-rose">
              <Shield size={13} /> PROCTORING LOCKED
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
      padding: "20px 0",
      borderBottom: "1px solid var(--line)",
      background: "rgba(26, 29, 36, 0.9)",
      backdropFilter: "blur(8px)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        {/* Brand */}
        <div
          onClick={() => setCurrentView("page1_landing")}
          style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
        >
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#fff",
            border: "3px solid var(--red)",
            display: "grid",
            placeItems: "center"
          }}>
            <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="9" cy="15" r="7" fill="#2f5bff"/>
              <path d="M14 4l12 7-4 4 5 6-9 4-4-7z" fill="#f08a1c"/>
            </svg>
          </div>
          <div>
            <b style={{ fontSize: "1.25rem", letterSpacing: ".02em" }}>Zairza</b>
            <span style={{ display: "block", font: "400 .72rem var(--mono)", color: "var(--mut)" }}>
              Wonder • Think • Create
            </span>
          </div>
        </div>

        {/* Realtime Geo HUD (Exact signature from Zairza Induction template) */}
        <div className="hud" style={{ display: "none", md: "grid", font: "400 .72rem/1.6 var(--mono)", background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "4px", padding: "8px 14px" }}>
          <span style={{ color: "var(--red)" }}>LOC: 20.2644°N 85.7761°E</span>
          <span style={{ color: "var(--mut)", marginLeft: "14px" }}>STATE: READY TO LAUNCH</span>
        </div>

        {/* Right Menu & Page Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Quick Page Explorer (20 Pages) */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: "0.82rem", minHeight: "38px" }}
            >
              <span>Explore Platform (20 Pages)</span>
              <ChevronDown size={14} />
            </button>

            {navDropdownOpen && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "46px",
                  width: "320px",
                  maxHeight: "440px",
                  overflowY: "auto",
                  padding: "12px",
                  zIndex: 2000,
                  border: "2px solid #f4f4f6",
                  boxShadow: "6px 6px 0 var(--red)"
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--coral)", marginBottom: "8px", fontFamily: "var(--mono)" }}>
                  CANDIDATE PORTAL (PAGES 1–10)
                </div>
                {[
                  { id: "page1_landing", label: "Page 1: Landing / Home" },
                  { id: "page2_register", label: "Page 2: Candidate Registration" },
                  { id: "page3_countdown", label: "Page 3: Success & Countdown" },
                  { id: "page4_precheck", label: "Page 4: Pre-Quiz Diagnostics" },
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
                      borderRadius: "2px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      background: currentView === item.id ? "rgba(47, 91, 255, 0.2)" : "transparent",
                      color: currentView === item.id ? "#8bb2ff" : "var(--mut)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "var(--mono)"
                    }}
                  >
                    <span>{item.label}</span>
                    {currentView === item.id && <CheckCircle size={14} color="var(--blue)" />}
                  </div>
                ))}

                <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--coral)", marginTop: "14px", marginBottom: "8px", fontFamily: "var(--mono)" }}>
                  ADMIN SUITE (PAGES 11–20)
                </div>
                {[
                  { id: "page11_login", label: "Page 11: Admin Login / 2FA" },
                  { id: "page12_admin_dashboard", label: "Page 12: Admin Master Dashboard" },
                  { id: "page13_registrations", label: "Page 13: Candidate Registrations" },
                  { id: "page14_candidate_details", label: "Page 14: Candidate Details Profiler" },
                  { id: "page15_proctoring", label: "Page 15: Live Proctoring Grid" },
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
                      borderRadius: "2px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      background: currentView === item.id ? "rgba(232, 53, 43, 0.15)" : "transparent",
                      color: currentView === item.id ? "var(--coral)" : "var(--mut)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "var(--mono)"
                    }}
                  >
                    <span>{item.label}</span>
                    {currentView === item.id && <CheckCircle size={14} color="var(--red)" />}
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
              style={{ cursor: "pointer", padding: "6px 12px" }}
              title="Click to view candidate dashboard"
            >
              <User size={13} />
              <span>ROLL: {activeCandidate.rollNumber}</span>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView("page2_register")}
              className="btn btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.85rem", minHeight: "38px" }}
            >
              [ Register ]
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
              style={{ padding: "8px 10px", minHeight: "38px" }}
              title="Logout Admin"
            >
              <LogOut size={14} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView("page11_login")}
              className="btn btn-secondary"
              style={{ padding: "8px 10px", minHeight: "38px" }}
              title="Admin Portal"
            >
              <Terminal size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
