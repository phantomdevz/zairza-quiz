import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { Award, CheckCircle, XCircle, Clock, BarChart2, ShieldCheck, ArrowRight, Lock, ShieldAlert, Sparkles } from "lucide-react";

export const Page10Results = () => {
  const { activeCandidate, setCurrentView, quizConfig, isEvaluationUnlocked, getUnlockRemainingSeconds } = useQuiz();

  const candidate = activeCandidate || {
    rollNumber: "2401106042",
    fullName: "Aarav Mohapatra",
    score: 26,
    timeTakenSeconds: 1420,
    correctCount: 26,
    incorrectCount: 3,
    unansweredCount: 1,
    sectionScores: { logical: 9, tech: 13, hr: 4 }
  };

  const isUnlocked = isEvaluationUnlocked(candidate);
  const remainingSeconds = getUnlockRemainingSeconds(candidate);

  const formatRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalPossible = quizConfig.totalQuestions * quizConfig.marksPerQuestion; // 30
  const score = candidate.score !== null && candidate.score !== undefined ? candidate.score : 0;
  const percentage = Math.max(0, Math.round((score / totalPossible) * 100));

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const logicalScore = candidate.sectionScores?.logical ?? 0;
  const techScore = candidate.sectionScores?.tech ?? 0;
  const hrScore = candidate.sectionScores?.hr ?? 0;

  const correctCount = candidate.correctCount ?? 0;
  const incorrectCount = candidate.incorrectCount ?? 0;

  // If candidate submitted less than 15 minutes ago, show Security Review Hold screen
  if (!isUnlocked) {
    const progressPercent = Math.min(100, Math.max(5, Math.round(((900 - remainingSeconds) / 900) * 100)));

    return (
      <div className="container" style={{ padding: "50px 20px 80px", maxWidth: "820px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <span className="badge badge-amber" style={{ marginBottom: "10px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldAlert size={14} />
            <span>15-MINUTE INTEGRITY &amp; SECURITY PROTOCOL</span>
          </span>
          <h1 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", marginBottom: "8px" }}>
            Evaluation Review In Progress
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto" }}>
            Candidate Registration Number: <strong className="mono" style={{ color: "var(--accent-cyan)" }}>{candidate.rollNumber}</strong> ({candidate.fullName}).
          </p>
        </div>

        {/* Security Hold Hero Card */}
        <div className="glass-panel glass-panel-glow" style={{ padding: "40px 30px", textAlign: "center", marginBottom: "30px", border: "1px solid rgba(245, 158, 11, 0.4)" }}>
          <div style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "var(--accent-amber)"
          }}>
            <Lock size={36} />
          </div>

          <div style={{ fontSize: "0.85rem", color: "var(--accent-amber)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "700", marginBottom: "6px" }}>
            Scorecard &amp; Ideathon PS Protected
          </div>

          <div className="mono" style={{ fontSize: "clamp(2.8rem, 5.5vw, 4rem)", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.05em", margin: "6px 0" }}>
            {formatRemaining(remainingSeconds)}
          </div>

          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "22px" }}>
            Remaining cooldown until verified evaluation metrics and Ideathon Problem Statements unlock
          </div>

          {/* Progress Bar */}
          <div style={{ maxWidth: "480px", margin: "0 auto 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
              <span>Submitted</span>
              <span className="mono">{progressPercent}% Elapsed</span>
              <span>15m Unlock</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-amber), var(--accent-cyan))", borderRadius: "4px", transition: "width 1s ease" }} />
            </div>
          </div>

          {/* Security Notice Box */}
          <div style={{
            background: "rgba(13, 18, 29, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-cyan)", fontWeight: "700", fontSize: "0.92rem", marginBottom: "8px" }}>
              <ShieldCheck size={18} />
              <span>Why is there a 15-minute evaluation delay?</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6", margin: "0 0 10px" }}>
              To ensure 100% test integrity across concurrent candidates in the 24-hr quiz window, correct and incorrect answers are segregated in an isolated secure table. Scorecard metrics and <strong>Ideathon Problem Statements (PS)</strong> are released exactly 15 minutes post-submission.
            </p>
            <div style={{ fontSize: "0.82rem", color: "var(--accent-amber)" }}>
              ⏱️ <em>This screen will automatically refresh and reveal your scorecard once the countdown reaches 00:00.</em>
            </div>
          </div>
        </div>

        {/* Attempt Receipt Snapshot */}
        <div className="glass-panel" style={{ padding: "24px 28px", marginBottom: "26px" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", color: "var(--text-main)" }}>
            Submission Integrity Receipt
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Registration Number</div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)", fontSize: "1rem" }}>{candidate.rollNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Questions Attempted</div>
              <div className="mono" style={{ fontWeight: "700", fontSize: "1rem" }}>{quizConfig.totalQuestions} Questions Recorded</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Proctoring Telemetry</div>
              <div style={{ fontWeight: "600", color: "var(--accent-emerald)", fontSize: "0.95rem" }}>0 Critical Violations</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Next Stage</div>
              <div style={{ fontWeight: "600", color: "var(--accent-purple)", fontSize: "0.95rem" }}>Ideathon (1st – 3rd Oct)</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button
            onClick={() => setCurrentView("page9_dashboard")}
            className="btn btn-secondary"
            style={{ padding: "12px 24px" }}
          >
            <span>Go to Candidate Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Once 15 minutes have elapsed, render the full scorecard
  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "900px" }}>
      {/* Top Header */}
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <span className="badge badge-emerald" style={{ marginBottom: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>OFFICIAL SCORECARD VERIFIED</span>
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", marginBottom: "6px" }}>
          Candidate Scorecard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Official induction performance breakdown for Registration Number: <strong className="mono" style={{ color: "var(--accent-cyan)" }}>{candidate.rollNumber}</strong> ({candidate.fullName}).
        </p>
      </div>

      {/* Main Scorecard Banner */}
      <div className="glass-panel glass-panel-glow" style={{ padding: "35px", textAlign: "center", marginBottom: "30px" }}>
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "rgba(6, 182, 212, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--accent-cyan)"
        }}>
          <Award size={38} />
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Total Assessment Score
        </div>

        <div style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: "900", fontFamily: "var(--font-heading)", margin: "4px 0" }}>
          <span className="text-gradient">{score}</span>
          <span style={{ fontSize: "1.8rem", color: "var(--text-muted)", fontWeight: "500" }}> / {totalPossible}</span>
        </div>

        <div style={{ display: "inline-flex", gap: "10px", marginTop: "10px" }}>
          <span className="badge badge-emerald" style={{ fontSize: "0.85rem" }}>
            {percentage}% OVERALL ACCURACY
          </span>
          <span className="badge badge-cyan" style={{ fontSize: "0.85rem" }}>
            {score >= 12 ? "SHORTLIST QUALIFIED" : "ASSESSMENT COMPLETED"}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-emerald)" }}><CheckCircle size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{correctCount}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Correct Answers</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-rose)" }}><XCircle size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{incorrectCount}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Incorrect Answers</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-amber)" }}><Clock size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{formatTime(candidate.timeTakenSeconds || 1420)}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Time Taken (of 30m)</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-cyan)" }}><ShieldCheck size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>Clean ({candidate.violationsCount || 0} Flags)</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Proctoring Record</div>
          </div>
        </div>
      </div>

      {/* 3-Part Sectional Proficiency Breakdown */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChart2 size={20} color="var(--accent-cyan)" />
          <span>Section-Wise Proficiency Breakdown (3 Parts)</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Part 1 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                🧩 Part 1: Logical Reasoning &amp; Analytical Aptitude
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                {logicalScore} / 10 marks ({Math.round((logicalScore / 10) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(logicalScore / 10) * 100}%`, height: "100%", background: "var(--grad-cyan-blue)", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Part 2 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                ⚡ Part 2: Tech Knowledge &amp; Domain Fundamentals
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-purple)" }}>
                {techScore} / 15 marks ({Math.round((techScore / 15) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(techScore / 15) * 100}%`, height: "100%", background: "var(--grad-purple-pink)", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Part 3 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                🤝 Part 3: HR &amp; Cultural Alignment Fit
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>
                {hrScore} / 5 marks ({Math.round((hrScore / 5) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(hrScore / 5) * 100}%`, height: "100%", background: "var(--accent-emerald)", borderRadius: "4px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="glass-panel" style={{ padding: "26px", textAlign: "center", borderTop: "3px solid var(--accent-cyan)" }}>
        <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Ideathon Problem Statements (PS) Unlocked!</h4>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "600px", margin: "0 auto 20px" }}>
          You now have direct access to the <strong>Ideathon Problem Statements (PS)</strong> on your dashboard. <strong>Ideathon presentations &amp; Personal Interviews (PI)</strong> will take place from <strong>1st October to 3rd October</strong>, followed by the release of the <strong>Final Inductees List</strong>!
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button
            onClick={() => setCurrentView("page9_dashboard")}
            className="btn btn-primary"
          >
            <span>View Ideathon PS on Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
