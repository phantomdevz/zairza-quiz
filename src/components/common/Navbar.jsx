import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Shield, User, Terminal, LogOut, ChevronDown, CheckCircle, Clock, Send, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    activeCandidate,
    isAdminLoggedIn,
    logoutAdmin,
    isQuizActive,
    timeRemaining,
    setShowSubmitModal
  } = useQuiz();

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  // During active quiz, show minimal HUD to prevent distractions
  if (isQuizActive) {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    const formattedTimer = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    return (
      <header style={{
        padding: "12px 0",
        borderBottom: "1px solid var(--line)",
        background: "rgba(11, 12, 16, 0.98)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid var(--red)",
              display: "grid",
              placeItems: "center",
              overflow: "hidden"
            }}>
              <img
                src="/zairza-logo.png"
                alt="Zairza Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <b style={{ fontSize: "1.05rem" }}>Zairza</b>
              <span style={{ display: "block", font: "400 .72rem var(--mono)", color: "var(--mut)" }}>
                Induction Quiz 2026
              </span>
            </div>
          </div>

          {/* Central Countdown Clock */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: timeRemaining < 300 ? "rgba(244, 63, 94, 0.2)" : "rgba(255, 255, 255, 0.05)",
            border: timeRemaining < 300 ? "1px solid var(--accent-rose)" : "1px solid var(--border-subtle)",
            padding: "6px 14px",
            borderRadius: "8px"
          }}>
            <Clock size={16} color={timeRemaining < 300 ? "var(--accent-rose)" : "var(--accent-cyan)"} />
            <span
              className="mono"
              style={{
                fontWeight: "800",
                fontSize: "1.15rem",
                color: timeRemaining < 300 ? "var(--accent-rose)" : "var(--text-main)"
              }}
            >
              {formattedTimer}
            </span>
          </div>

          {/* Right Actions: Roll & Submit */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {activeCandidate && (
              <div className="badge badge-cyan mono" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                ROLL: {activeCandidate.rollNumber}
              </div>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary pulse-glow desktop-sidebar"
              style={{
                padding: "6px 16px",
                fontSize: "0.85rem",
                minHeight: "36px",
                background: "var(--accent-emerald)",
                borderColor: "var(--accent-emerald)",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Send size={14} />
              <span>Submit</span>
            </button>
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
            placeItems: "center",
            overflow: "hidden"
          }}>
            <img
              src="/zairza-logo.png"
              alt="Zairza Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
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

        {/* Right Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Return to Admin Dashboard Button (Visible when logged in as admin) */}
          {isAdminLoggedIn && (
            <button
              onClick={() => setCurrentView("page12_admin_dashboard")}
              className="btn btn-primary pulse-glow"
              style={{
                padding: "8px 16px",
                fontSize: "0.85rem",
                minHeight: "38px",
                background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                borderColor: "var(--accent-purple)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "700"
              }}
              title="Return to Admin Dashboard"
            >
              <LayoutDashboard size={15} />
              <span>Admin Dashboard →</span>
            </button>
          )}

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

          {/* Admin Logout (Visible only when logged in as admin) */}
          {isAdminLoggedIn && (
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
          )}
        </div>
      </div>
    </header>
  );
};
