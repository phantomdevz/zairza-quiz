import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Users, UserPlus, Shield, Key, CheckCircle, Trash2 } from "lucide-react";

export const Page20UserManagement = () => {
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: "Core Convener", email: "admin@zairza.in", role: "Super Admin", twoFactorEnabled: true, lastLogin: "Just now" },
    { id: 2, name: "Software Lead", email: "software.lead@zairza.in", role: "Quiz Manager", twoFactorEnabled: true, lastLogin: "2 hours ago" },
    { id: 3, name: "Robotics Lead", email: "robotics.lead@zairza.in", role: "Invigilator", twoFactorEnabled: true, lastLogin: "Today, 10:14 AM" },
    { id: 4, name: "Design Lead", email: "design.lead@zairza.in", role: "Results Manager", twoFactorEnabled: false, lastLogin: "Yesterday" }
  ]);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "Invigilator" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim()) return;

    setAdminUsers([
      ...adminUsers,
      {
        id: adminUsers.length + 1,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        twoFactorEnabled: true,
        lastLogin: "Never"
      }
    ]);
    setShowAddAdmin(false);
    setNewAdmin({ name: "", email: "", role: "Invigilator" });
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1080px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "26px" }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: "6px" }}>ACCESS CONTROL (RBAC)</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Admin Team & Roles</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Delegate invigilation, question banking, and results permissions across club leads.
          </p>
        </div>

        <button
          onClick={() => setShowAddAdmin(true)}
          className="btn btn-primary"
          style={{ padding: "10px 20px" }}
        >
          <UserPlus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "26px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "12px 10px" }}>Name</th>
                <th style={{ padding: "12px 10px" }}>Email</th>
                <th style={{ padding: "12px 10px" }}>Role</th>
                <th style={{ padding: "12px 10px" }}>2FA Status</th>
                <th style={{ padding: "12px 10px" }}>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 10px", fontWeight: "600" }}>{u.name}</td>
                  <td style={{ padding: "14px 10px", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "14px 10px" }}>
                    <span className="badge badge-purple">{u.role}</span>
                  </td>
                  <td style={{ padding: "14px 10px" }}>
                    {u.twoFactorEnabled ? (
                      <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                        <CheckCircle size={12} /> ACTIVE
                      </span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: "0.75rem" }}>PENDING SETUP</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {u.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddAdmin && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "16px" }}>Create Admin User</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lead Roboticist"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="lead@zairza.in"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Role</label>
                <select
                  className="form-select"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Quiz Manager">Quiz Manager</option>
                  <option value="Invigilator">Invigilator</option>
                  <option value="Results Manager">Results Manager</option>
                  <option value="Read-only Admin">Read-only Admin</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
