import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  LayoutDashboard,
  Users,
  Activity,
  UserCheck,
  BookOpen,
  Settings,
  BarChart3,
  FileText,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export const AdminSidebar = () => {
  const {
    currentView,
    setCurrentView,
    logoutAdmin,
    adminUser,
    candidates,
    questions
  } = useQuiz();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const flaggedCount = candidates.filter((c) => c.violationsCount > 0).length;

  const navItems = [
    {
      id: "page12_admin_dashboard",
      label: "Master Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "page13_registrations",
      label: "Registrations",
      icon: Users,
      badge: candidates.length
    },
    {
      id: "page15_proctoring",
      label: "Live Proctoring",
      icon: Activity,
      badge: flaggedCount > 0 ? `${flaggedCount} Flagged` : "LIVE",
      badgeColor: flaggedCount > 0 ? "badge-rose" : "badge-emerald"
    },
    {
      id: "page14_candidate_details",
      label: "Candidate Profiler",
      icon: UserCheck,
      badge: null
    },
    {
      id: "page16_question_bank",
      label: "Question Bank Studio",
      icon: BookOpen,
      badge: questions.length
    },
    {
      id: "page17_quiz_config",
      label: "Schedule & Window",
      icon: Settings,
      badge: "LIVE"
    },
    {
      id: "page18_analytics",
      label: "Performance & Ideathon",
      icon: BarChart3,
      badge: null
    },
    {
      id: "page19_audit_logs",
      label: "Audit & Security Logs",
      icon: FileText,
      badge: null
    },
    {
      id: "page20_users",
      label: "Admin RBAC & Users",
      icon: ShieldAlert,
      badge: null
    }
  ];

  const activeItem = navItems.find((n) => n.id === currentView) || navItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* MOBILE HEADER & HORIZONTAL TABS (Visible <= 900px) */}
      <div className="admin-mobile-nav">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(13, 16, 23, 0.98)",
          borderBottom: "1px solid var(--border-subtle)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              background: "rgba(6, 182, 212, 0.15)",
              display: "grid",
              placeItems: "center",
              color: "var(--accent-cyan)"
            }}>
              <ActiveIcon size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                {activeItem.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Zairza Admin Suite
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: "0.8rem", minHeight: "36px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              <span>{mobileMenuOpen ? "Close" : "All Tools"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Fast-Scroll Pills */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          padding: "8px 14px",
          background: "rgba(10, 12, 18, 0.95)",
          borderBottom: "1px solid var(--border-subtle)",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch"
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? "700" : "500",
                  background: isActive ? "rgba(6, 182, 212, 0.18)" : "rgba(255, 255, 255, 0.04)",
                  border: isActive ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "1px 5px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.1)",
                    color: "var(--text-main)"
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Collapsible Full Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: "rgba(13, 16, 23, 0.98)",
            borderBottom: "2px solid var(--accent-cyan)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.8)"
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: isActive ? "rgba(6, 182, 212, 0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid transparent",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-main)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.9rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`badge ${item.badgeColor || "badge-cyan"}`} style={{ fontSize: "0.72rem" }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => {
                  setCurrentView("page1_landing");
                  setMobileMenuOpen(false);
                }}
                className="btn btn-secondary"
                style={{ padding: "8px 12px", fontSize: "0.8rem" }}
              >
                <span>Preview Candidate Portal</span>
                <ExternalLink size={13} />
              </button>

              <button
                onClick={() => {
                  logoutAdmin();
                  setCurrentView("page1_landing");
                }}
                className="btn btn-danger"
                style={{ padding: "8px 12px", fontSize: "0.8rem" }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR (Visible > 900px) */}
      <aside className="admin-sidebar-desktop">
        {/* Top Header / Portal Tag */}
        <div>
          <div style={{ padding: "0 10px 18px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="badge badge-purple" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                CONTROL SUITE
              </span>
              <span className="mono" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                v2.6
              </span>
            </div>
            <div style={{ fontWeight: "700", fontSize: "0.98rem", color: "var(--text-main)" }}>
              Zairza Administration
            </div>
          </div>

          {/* Navigation List */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: isActive ? "rgba(6, 182, 212, 0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(6, 182, 212, 0.35)" : "1px solid transparent",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.86rem",
                    fontWeight: isActive ? "600" : "500",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                      e.currentTarget.style.color = "var(--text-main)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`badge ${item.badgeColor || (isActive ? "badge-cyan" : "badge-purple")}`}
                      style={{ fontSize: "0.7rem", padding: "1px 6px" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px", marginTop: "16px" }}>
          {/* Switch to Candidate View */}
          <button
            onClick={() => setCurrentView("page1_landing")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.8rem",
              marginBottom: "12px",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          >
            <span>Candidate Portal</span>
            <ExternalLink size={13} />
          </button>

          {/* Admin User Card & Logout */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px" }}>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>
                {adminUser?.name || "Core Convener"}
              </div>
              <div className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-cyan)" }}>
                admin@zairza.in
              </div>
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                setCurrentView("page1_landing");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent-rose)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "4px"
              }}
              title="Logout Admin"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
