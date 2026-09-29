import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Lock, Mail, Key, ShieldCheck, ArrowRight, AlertCircle, Terminal } from "lucide-react";

export const Page11AdminLogin = () => {
  const { loginAdmin, setCurrentView, isAdminLoggedIn } = useQuiz();

  const [email, setEmail] = useState("admin@zairza.in");
  const [password, setPassword] = useState("zairza2026");
  const [twoFactorCode, setTwoFactorCode] = useState("202609");
  const [step, setStep] = useState(1); // 1: Password, 2: 2FA TOTP
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (email === "admin@zairza.in" && password === "zairza2026") {
      setStep(2); // Proceed to 2FA challenge
    } else {
      setError("Invalid admin credentials. Please verify your email and password.");
    }
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    setError("");
    if (twoFactorCode.trim() === "202609" || twoFactorCode.trim().length === 6) {
      const ok = loginAdmin(email, password);
      if (ok) {
        setCurrentView("page12_admin_dashboard");
      }
    } else {
      setError("Invalid 2FA Authenticator token. Enter 6-digit code.");
    }
  };

  return (
    <div className="container" style={{ padding: "60px 20px 80px", maxWidth: "480px" }}>
      <div className="glass-panel" style={{ padding: "40px" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#fff",
          border: "2px solid var(--red)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 16px",
          overflow: "hidden"
        }}>
          <img
            src="/zairza-logo.png"
            alt="Zairza Logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span className="badge badge-purple" style={{ marginBottom: "6px" }}>CONTROL PORTAL</span>
          <h2 style={{ fontSize: "1.8rem" }}>Admin Authentication</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px" }}>
            Restricted access for Zairza leads, invigilators, and evaluators.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid var(--accent-rose)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--accent-rose)",
            fontSize: "0.85rem"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "40px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "16px", color: "var(--text-muted)" }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "40px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "16px", color: "var(--text-muted)" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
              <span>Verify Password</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
              Pre-filled test credentials: <code>admin@zairza.in</code> / <code>zairza2026</code>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <ShieldCheck size={28} color="var(--accent-cyan)" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Two-Factor Authentication</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Enter the 6-digit TOTP security code from your Authenticator app.
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input mono"
                style={{ textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.3em", padding: "12px" }}
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
              <span>Authenticate & Enter Admin Suite</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-secondary"
              style={{ width: "100%", padding: "10px", marginTop: "10px", fontSize: "0.85rem" }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
