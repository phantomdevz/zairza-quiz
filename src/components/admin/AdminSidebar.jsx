import React from "react";
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
  ChevronRight
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
      label: "Quiz Configuration",
      icon: Settings,
      badge: null
    },
    {
      id: "page18_analytics",
      label: "Results & Shortlisting",
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

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        background: "rgba(13, 16, 23, 0.95)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px",
        position: "sticky",
        top: "72px",
        height: "calc(100vh - 72px)",
        overflowY: "auto",
        zIndex: 50
      }}
    >
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
                  <Icon size={16} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`badge ${item.badgeColor || "badge-cyan"}`}
                    style={{ fontSize: "0.68rem", padding: "2px 6px" }}
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
  );
};
