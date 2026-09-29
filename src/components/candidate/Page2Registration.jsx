import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { User, Mail, Phone, Hash, BookOpen, Layers, CheckSquare, ArrowRight, AlertCircle } from "lucide-react";

export const Page2Registration = () => {
  const { registerCandidate, setCurrentView } = useQuiz();

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    mobile: "",
    year: "1st Year",
    branch: "Computer Science and Engineering",
    gender: "Male",
    residentialType: "Hosteller",
    preferredWing: "Software",
    technicalInterests: [],
    portfolioUrl: "",
    acceptedTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");

  const branches = [
    "Computer Science and Engineering",
    "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
    "Computer Engineering",
    "Information Technology",
    "Electronics and Communication Engineering (ECE)",
    "Electronics & Instrumentation Engineering",
    "Mechanical Engineering",
    "Mechanical Engineering (Robotics and Artificial Intelligence)",
    "Civil Engineering",
    "Biotechnology",
    "Textile Engineering",
    "Fashion & Apparel Technology",
    "Metallurgical and Materials Engineering",
    "Aerospace Engineering",
    "Bachelor of Architecture (B.Arch)",
    "Bachelor of Planning (B.Plan)",
    "Integrated M.Sc. in Mathematics and Computing",
    "Integrated M.Sc. in Applied Chemistry",
    "Integrated M.Sc. in Applied Physics",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",
    "Master of Planning (M.Plan)",
    "Master of Technology (M.Tech)"
  ];

  const availableInterests = [
    "Web Development",
    "Mobile Apps",
    "AI / Deep Learning",
    "Embedded C & Arduino",
    "Drones & Aerial Robotics",
    "UI / UX Design",
    "3D Modelling (Blender)",
    "Cybersecurity",
    "Game Dev",
    "Cloud & DevOps"
  ];

  const handleInterestToggle = (tag) => {
    if (formData.technicalInterests.includes(tag)) {
      setFormData({
        ...formData,
        technicalInterests: formData.technicalInterests.filter((t) => t !== tag)
      });
    } else {
      if (formData.technicalInterests.length >= 3) {
        alert("You can select a maximum of 3 technical interests.");
        return;
      }
      setFormData({
        ...formData,
        technicalInterests: [...formData.technicalInterests, tag]
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";

    // OUTR Roll Number validation (e.g. 2401106042 or 2301106xxx)
    if (!formData.rollNumber.trim()) {
      errs.rollNumber = "OUTR Roll Number is required.";
    } else if (formData.rollNumber.trim().length < 8) {
      errs.rollNumber = "Please enter a valid university roll number.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Email ID is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    // Mobile number validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      errs.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile.trim().replace(/\D/g, ""))) {
      errs.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.acceptedTerms) {
      errs.acceptedTerms = "You must acknowledge the proctoring rules and terms.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionError("");

    const isValid = validate();
    if (!isValid) {
      setSubmissionError("Please fill in all required fields marked with * and accept the terms before submitting.");
      return;
    }

    const res = registerCandidate(formData);
    if (!res.success) {
      setSubmissionError(res.error);
    } else {
      setCurrentView("page3_countdown");
    }
  };

  return (
    <div className="container" style={{ padding: "50px 20px 80px", maxWidth: "840px" }}>
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <span className="badge badge-cyan" style={{ marginBottom: "8px" }}>STEP 1 OF 3</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", marginBottom: "8px" }}>
          Candidate Registration
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Fill in your OUTR credentials. Your Roll Number serves as your primary quiz identifier.
        </p>
      </div>

      {submissionError && (
        <div style={{
          background: "rgba(244, 63, 94, 0.12)",
          border: "1px solid var(--accent-rose)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "var(--accent-rose)"
        }}>
          <AlertCircle size={20} />
          <span>{submissionError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "35px" }}>
        {/* Section 1: Personal Details */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--accent-cyan)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={18} />
            <span>Personal Details</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aarav Mohapatra"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                className="form-input mono"
                placeholder="e.g. 2401106042"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
              />
              {errors.rollNumber && <div className="form-error">{errors.rollNumber}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email ID *</label>
              <input
                type="email"
                className="form-input"
                placeholder=""
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                className="form-input mono"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              {errors.mobile && <div className="form-error">{errors.mobile}</div>}
            </div>
          </div>
        </div>

        {/* Section 2: Academic Details */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--accent-purple)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={18} />
            <span>Academic & Demographics</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                {["1st Year", "2nd Year"].map((yr) => (
                  <label
                    key={yr}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: formData.year === yr ? "1px solid var(--accent-purple)" : "1px solid var(--border-subtle)",
                      background: formData.year === yr ? "rgba(139, 92, 246, 0.12)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "0.9rem"
                    }}
                  >
                    <input
                      type="radio"
                      name="year"
                      checked={formData.year === yr}
                      onChange={() => setFormData({ ...formData, year: yr })}
                      style={{ display: "none" }}
                    />
                    {yr}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Branch / Academic Program *</label>
              <select
                className="form-select"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                {branches.map((b) => (
                  <option key={b} value={b} style={{ background: "#0d121d" }}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male" style={{ background: "#0d121d" }}>Male</option>
                <option value="Female" style={{ background: "#0d121d" }}>Female</option>
                <option value="Other" style={{ background: "#0d121d" }}>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Status</label>
              <select
                className="form-select"
                value={formData.residentialType}
                onChange={(e) => setFormData({ ...formData, residentialType: e.target.value })}
              >
                <option value="Hosteller" style={{ background: "#0d121d" }}>Hosteller</option>
                <option value="Day Scholar" style={{ background: "#0d121d" }}>Day Scholar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Wing & Interests */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--accent-emerald)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} />
            <span>Zairza Wing Preference</span>
          </h3>

          <div className="form-group">
            <label className="form-label">Primary Wing Choice</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginTop: "4px" }}>
              {[
                { id: "Software", desc: "Web, AI, Systems" },
                { id: "Robotics & IoT", desc: "Drones, Microcontrollers" },
                { id: "Design", desc: "UI/UX, 3D, Motion" }
              ].map((w) => (
                <div
                  key={w.id}
                  onClick={() => setFormData({ ...formData, preferredWing: w.id })}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: formData.preferredWing === w.id ? "1px solid var(--accent-emerald)" : "1px solid var(--border-subtle)",
                    background: formData.preferredWing === w.id ? "rgba(16, 185, 129, 0.12)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{w.id}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{w.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">
              <span>Technical Interests (Select up to 3)</span>
              <span className="mono" style={{ fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                {formData.technicalInterests.length}/3 selected
              </span>
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
              {availableInterests.map((tag) => {
                const isSelected = formData.technicalInterests.includes(tag);
                return (
                  <div
                    key={tag}
                    onClick={() => handleInterestToggle(tag)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      border: isSelected ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "rgba(6, 182, 212, 0.2)" : "rgba(255,255,255,0.02)",
                      color: isSelected ? "var(--accent-cyan)" : "var(--text-secondary)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">GitHub / Portfolio / Behance URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://github.com/your-username"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            />
          </div>
        </div>

        {/* Terms & Submit */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}>
            <input
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
              style={{ marginTop: "4px" }}
            />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              I agree to abide by the anti-cheating guidelines of Zairza. I understand that tab switching, window blurring, and exiting fullscreen during the 30-minute induction quiz will be recorded and may lead to automatic disqualification.
            </span>
          </label>
          {errors.acceptedTerms && <div className="form-error" style={{ marginBottom: "16px" }}>{errors.acceptedTerms}</div>}

          {submissionError && (
            <div style={{
              background: "rgba(244, 63, 94, 0.12)",
              border: "1px solid var(--accent-rose)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--accent-rose)",
              fontSize: "0.9rem"
            }}>
              <AlertCircle size={18} />
              <span>{submissionError}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "1.05rem" }}
          >
            <span>Complete Registration & Proceed</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
