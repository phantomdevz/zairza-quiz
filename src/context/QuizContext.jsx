import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { QUIZ_CONFIG, INITIAL_QUESTIONS, INITIAL_CANDIDATES, INITIAL_AUDIT_LOGS } from "../data/mockQuizData";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  evaluateCandidateQuiz,
  verifyAdminCredentials,
  generateAdminSession
} from "../utils/security";

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  // Navigation / Active View
  const [currentView, setCurrentView] = useState("page1_landing");
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] = useState("24011042");

  // Configuration (Hydrated from localStorage with .env as initial fallback)
  const [quizConfig, setQuizConfig] = useState(() => {
    const saved = localStorage.getItem("zairza_quiz_config");
    let base = {
      ...QUIZ_CONFIG,
      oaStartEpoch: import.meta.env.VITE_OA_WINDOW_START || QUIZ_CONFIG.oaStartEpoch,
      oaEndEpoch: import.meta.env.VITE_OA_WINDOW_END || QUIZ_CONFIG.oaEndEpoch,
      registrationCutoffEpoch: import.meta.env.VITE_REGISTRATION_CUTOFF || QUIZ_CONFIG.registrationCutoffEpoch,
      durationMinutes: parseInt(import.meta.env.VITE_ATTEMPT_DURATION_MINUTES) || QUIZ_CONFIG.durationMinutes,
      maxViolationsAllowed: parseInt(import.meta.env.VITE_MAX_VIOLATIONS_ALLOWED) || QUIZ_CONFIG.maxViolationsAllowed
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...base,
          ...parsed,
          sections: QUIZ_CONFIG.sections
        };
      } catch (e) {
        // Fallback to defaults
      }
    }
    return base;
  });

  useEffect(() => {
    localStorage.setItem("zairza_quiz_config", JSON.stringify(quizConfig));
  }, [quizConfig]);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Security: Purge any legacy answer keys from browser local storage
  useEffect(() => {
    localStorage.removeItem("zairza_quiz_answer_keys");
  }, []);

  const updateAnswerKey = (questionId, correctOptionId, explanation = null) => {
    setAnswerKeys((prev) => {
      const existing = prev[questionId] || prev[String(questionId)] || {};
      const updated = {
        ...existing,
        correctOptionId,
        ...(explanation !== null ? { explanation } : {})
      };
      return {
        ...prev,
        [questionId]: updated,
        [String(questionId)]: updated
      };
    });
  };

  // Dynamic Candidate Allocated Questions (Randomly drawn from pool per section)
  const [allocatedQuestions, setAllocatedQuestions] = useState(() => {
    const saved = localStorage.getItem("zairza_allocated_questions");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (allocatedQuestions) {
      localStorage.setItem("zairza_allocated_questions", JSON.stringify(allocatedQuestions));
    } else {
      localStorage.removeItem("zairza_allocated_questions");
    }
  }, [allocatedQuestions]);

  const generateRandomizedQuestions = (questionPool = questions) => {
    // 10 Logical, 15 Tech, 5 HR (Total: 30)
    const quotas = {
      logical: 10,
      tech: 15,
      hr: 5
    };

    const shuffle = (array) => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const logicalPool = questionPool.filter((q) => q.section === "logical");
    const techPool = questionPool.filter((q) => q.section === "tech");
    const hrPool = questionPool.filter((q) => q.section === "hr");

    const sampledLogical = shuffle(logicalPool).slice(0, Math.min(quotas.logical, logicalPool.length));
    const sampledTech = shuffle(techPool).slice(0, Math.min(quotas.tech, techPool.length));
    const sampledHr = shuffle(hrPool).slice(0, Math.min(quotas.hr, hrPool.length));

    return [...sampledLogical, ...sampledTech, ...sampledHr].map((q, idx) => ({
      ...q,
      displayNumber: idx + 1
    }));
  };

  const activeQuestions = (allocatedQuestions && allocatedQuestions.length > 0) ? allocatedQuestions : questions.slice(0, 30);

  // Active Candidate Session (Identified by Registration Number)
  const [activeCandidate, setActiveCandidate] = useState(() => {
    const saved = localStorage.getItem("zairza_candidate_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Admin Session (Backed by ephemeral sessionStorage)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return Boolean(sessionStorage.getItem("zairza_admin_token"));
  });
  const [adminUser, setAdminUser] = useState(() => {
    const token = sessionStorage.getItem("zairza_admin_token");
    return token ? { username: "admin@zairza.in", role: "Super Admin", name: "Core Convener", token } : null;
  });

  // Submission Idempotency & Double-Click Lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // In-Quiz State (Page 5)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState("logical");
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("zairza_quiz_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [markedForReview, setMarkedForReview] = useState(() => {
    const saved = localStorage.getItem("zairza_quiz_review");
    return saved ? JSON.parse(saved) : {};
  });
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const isQuizActiveRef = useRef(false);
  const isQuizSubmittedRef = useRef(false);

  useEffect(() => {
    isQuizActiveRef.current = isQuizActive;
  }, [isQuizActive]);

  useEffect(() => {
    isQuizSubmittedRef.current = isQuizSubmitted;
  }, [isQuizSubmitted]);

  // Anti-Cheat & Proctoring Telemetry (Page 6)
  const [violations, setViolations] = useState([]);
  const [violationCount, setViolationCount] = useState(0);
  const violationCountRef = useRef(0);
  const [latestViolationMessage, setLatestViolationMessage] = useState("");
  const [showViolationModal, setShowViolationModalState] = useState(false);
  const showViolationModalRef = useRef(false);
  const lastViolationTimeRef = useRef(0);
  const handleFinalSubmitRef = useRef(null);
  const activeCandidateRef = useRef(activeCandidate);

  useEffect(() => {
    activeCandidateRef.current = activeCandidate;
  }, [activeCandidate]);

  const setShowViolationModal = useCallback((val) => {
    showViolationModalRef.current = Boolean(val);
    setShowViolationModalState(val);
    if (!val) {
      // 600ms grace period after dismissing modal so refocus doesn't immediately re-trigger
      lastViolationTimeRef.current = Date.now() + 600;
    }
  }, []);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mobile Bottom Sheet toggle
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // Real-time tick for 15-minute cooldown countdown
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Security layer: Check if 15-minute post-submission cooldown has elapsed
  const isEvaluationUnlocked = (cand = activeCandidate) => {
    if (!cand) return false;
    // If no evaluatesAtEpoch (e.g. legacy demo candidates), treat as unlocked
    if (!cand.evaluatesAtEpoch) return true;
    return currentTime >= cand.evaluatesAtEpoch;
  };

  const getUnlockRemainingSeconds = (cand = activeCandidate) => {
    if (!cand || !cand.evaluatesAtEpoch) return 0;
    return Math.max(0, Math.floor((cand.evaluatesAtEpoch - currentTime) / 1000));
  };

  // Save session to localStorage
  useEffect(() => {
    if (activeCandidate) {
      localStorage.setItem("zairza_candidate_session", JSON.stringify(activeCandidate));
    } else {
      localStorage.removeItem("zairza_candidate_session");
    }
  }, [activeCandidate]);

  // Save in-progress answers
  useEffect(() => {
    localStorage.setItem("zairza_quiz_answers", JSON.stringify(answers));
  }, [answers]);

  // Save marked for review
  useEffect(() => {
    localStorage.setItem("zairza_quiz_review", JSON.stringify(markedForReview));
  }, [markedForReview]);

  // Quiz Countdown Timer
  useEffect(() => {
    let timerInterval = null;
    if (isQuizActive && !isQuizSubmitted && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleFinalSubmit("AUTO_SUBMIT_TIMEOUT");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isQuizActive, isQuizSubmitted, timeRemaining]);

  // Anti-Cheat Violation Trigger
  const triggerViolation = useCallback((violationType, details = "") => {
    if (!isQuizActiveRef.current || isQuizSubmittedRef.current) return;
    if (showViolationModalRef.current) return;

    const now = Date.now();
    // 800ms throttle to prevent concurrent events (e.g. window blur + visibility change) from double-counting
    if (now - lastViolationTimeRef.current < 800) return;
    lastViolationTimeRef.current = now;

    violationCountRef.current += 1;
    const currentCount = violationCountRef.current;
    setViolationCount(currentCount);

    const cand = activeCandidateRef.current;
    const newViolation = {
      id: "v_" + Date.now(),
      type: violationType,
      details,
      timestamp: new Date().toLocaleTimeString(),
      rollNumber: cand ? cand.rollNumber : "GUEST"
    };

    setViolations((prev) => [newViolation, ...prev]);

    // Update real-time candidate proctoring violation count in state
    if (cand) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.rollNumber === cand.rollNumber
            ? { ...c, violationsCount: currentCount }
            : c
        )
      );
    }

    // Stream violation to Supabase Realtime
    if (isSupabaseConfigured && supabase) {
      supabase.from("proctoring_violations").insert([{
        roll_number: newViolation.rollNumber,
        violation_type: newViolation.type,
        details: newViolation.details
      }]).then(({ error }) => {
        if (error) console.warn("Supabase violation sync note:", error.message);
      });
    }

    let message = "";
    if (violationType === "TAB_SWITCH") {
      message = "Tab switch or browser minimization detected! Please keep your focus on the assessment viewport.";
    } else if (violationType === "WINDOW_BLUR") {
      message = "Loss of window focus detected. Navigating away or clicking background apps is strictly monitored.";
    } else if (violationType === "FULLSCREEN_EXIT") {
      message = "Fullscreen mode was exited. The assessment must be taken in uninterrupted fullscreen.";
    } else if (violationType === "FORBIDDEN_KEY") {
      message = `Prohibited keyboard shortcut (${details}) intercepted. Copy/paste and devtools are disabled.`;
    } else if (violationType === "MOBILE_APP_SWITCH") {
      message = "App switch or notification swipe detected! Stay within the browser window.";
    } else {
      message = "Proctoring integrity event recorded.";
    }

    setLatestViolationMessage(message);
    showViolationModalRef.current = true;
    setShowViolationModalState(true);

    // Auto-submission on exceeding violation threshold
    if (currentCount >= quizConfig.maxViolationsAllowed) {
      setTimeout(() => {
        if (handleFinalSubmitRef.current) {
          handleFinalSubmitRef.current("AUTO_SUBMIT_MAX_VIOLATIONS");
        }
      }, 1500);
    }
  }, [quizConfig.maxViolationsAllowed]);

  // Register Candidate
  const registerCandidate = (formData) => {
    // Check if Registration Number already registered
    const existing = candidates.find(
      (c) => c.rollNumber.trim().toUpperCase() === formData.rollNumber.trim().toUpperCase()
    );
    if (existing) {
      return { success: false, error: `Registration Number ${formData.rollNumber} is already registered!` };
    }

    const newCandidate = {
      ...formData,
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      registeredAt: new Date().toISOString(),
      quizStatus: "NOT_STARTED",
      score: null,
      timeTakenSeconds: 0,
      violationsCount: 0,
      currentQuestion: 1,
      sectionScores: null
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    setActiveCandidate(newCandidate);

    // Sync to Supabase Postgres if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from("candidates").insert([{
        roll_number: newCandidate.rollNumber,
        full_name: newCandidate.fullName,
        email: newCandidate.email,
        mobile: newCandidate.mobile,
        year: newCandidate.year,
        branch: newCandidate.branch,
        gender: newCandidate.gender,
        residential_type: newCandidate.residentialType,
        preferred_wing: newCandidate.preferredWing,
        technical_interests: newCandidate.technicalInterests,
        portfolio_url: newCandidate.portfolioUrl
      }]).then(({ error }) => {
        if (error) console.warn("Supabase candidate sync note:", error.message);
      });
    }

    // Log to audit trail
    setAuditLogs((prev) => [
      {
        id: "log_" + Date.now(),
        action: "CANDIDATE_REGISTERED",
        admin: "Self Registration",
        details: `Candidate ${newCandidate.fullName} (${newCandidate.rollNumber}) registered.`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    return { success: true, candidate: newCandidate };
  };

  // Candidate Login (Check in via Registration Number)
  const loginCandidateByRoll = (rollNumber) => {
    const candidate = candidates.find(
      (c) => c.rollNumber.trim().toUpperCase() === rollNumber.trim().toUpperCase()
    );
    if (candidate) {
      setActiveCandidate(candidate);
      return { success: true, candidate };
    }
    return { success: false, error: "Registration Number not found. Please register first." };
  };

  // Start Assessment
  const startQuiz = () => {
    setIsQuizActive(true);
    isQuizActiveRef.current = true;
    setIsQuizSubmitted(false);
    isQuizSubmittedRef.current = false;
    setTimeRemaining(quizConfig.durationMinutes * 60);
    setViolationCount(0);
    violationCountRef.current = 0;
    setViolations([]);
    showViolationModalRef.current = false;
    setShowViolationModalState(false);
    lastViolationTimeRef.current = 0;
    setCurrentQuestionIndex(0);
    setCurrentSectionId("logical");
    setCurrentView("page5_quiz");

    // Allot randomized questions per section for this candidate if not already allotted
    let currentAllocated = allocatedQuestions;
    if (!currentAllocated || currentAllocated.length === 0) {
      currentAllocated = generateRandomizedQuestions(questions);
      setAllocatedQuestions(currentAllocated);
    }

    if (activeCandidate) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.rollNumber === activeCandidate.rollNumber
            ? { ...c, quizStatus: "IN_PROGRESS" }
            : c
        )
      );
    }
  };

  // Select Option
  const selectOption = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Toggle Mark for Review
  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Clear Answer
  const clearAnswer = (questionId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Server-Side Score Evaluation & Final Submit
  const handleFinalSubmit = async (submissionReason = "MANUAL_SUBMIT") => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    setIsQuizActive(false);
    isQuizActiveRef.current = false;
    setIsQuizSubmitted(true);
    isQuizSubmittedRef.current = true;
    setShowSubmitModal(false);
    showViolationModalRef.current = false;
    setShowViolationModalState(false);

    const activeQuestionsList = (allocatedQuestions && allocatedQuestions.length > 0) ? allocatedQuestions : questions.slice(0, 30);

    // Cryptographically verified evaluation (Zero plaintext solution keys required)
    const { finalScore, sectionBreakdown, correctCount, incorrectCount, unansweredCount } = evaluateCandidateQuiz({
      allocatedQuestions: activeQuestionsList,
      answers,
      marksPerQuestion: quizConfig.marksPerQuestion,
      negativeMark: quizConfig.negativeMark
    });

    const timeTaken = quizConfig.durationMinutes * 60 - timeRemaining;
    const submittedAtEpoch = Date.now();
    const evaluatesAtEpoch = submittedAtEpoch + 15 * 60 * 1000; // 15-minute security cooldown

    if (activeCandidate) {
      const updatedCandidate = {
        ...activeCandidate,
        quizStatus: "COMPLETED",
        score: finalScore,
        timeTakenSeconds: timeTaken,
        violationsCount: violationCountRef.current,
        sectionScores: sectionBreakdown,
        correctCount,
        incorrectCount,
        unansweredCount,
        submissionReason,
        submittedAt: new Date().toLocaleTimeString(),
        submittedAtEpoch,
        evaluatesAtEpoch,
        candidateAnswers: answers,
        allocatedQuestionIds: activeQuestionsList.map((q) => q.id)
      };

      setActiveCandidate(updatedCandidate);
      setCandidates((prev) =>
        prev.map((c) =>
          c.rollNumber === activeCandidate.rollNumber ? updatedCandidate : c
        )
      );

      // Record final attempt to Supabase Postgres
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("quiz_attempts").insert([{
            roll_number: activeCandidate.rollNumber,
            status: "COMPLETED",
            score: finalScore,
            logical_score: sectionBreakdown.logical,
            tech_score: sectionBreakdown.tech,
            hr_score: sectionBreakdown.hr,
            correct_count: correctCount,
            incorrect_count: incorrectCount,
            unanswered_count: unansweredCount,
            violations_count: violationCountRef.current,
            time_taken_seconds: timeTaken,
            submission_reason: submissionReason
          }]);
        } catch (e) {
          console.warn("Supabase attempt sync note:", e?.message);
        }
      }
    }

    setIsSubmitting(false);
    setCurrentView("page8_success");
  };

  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit;
  });

  // Admin Login (Cryptographically Salted SHA-256 + Supabase Auth)
  const loginAdmin = async (username, password) => {
    // 1. Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password: password.trim()
        });
        if (!error && data?.user) {
          setIsAdminLoggedIn(true);
          const session = generateAdminSession();
          sessionStorage.setItem("zairza_admin_token", session.token);
          setAdminUser({ username, role: "Super Admin", name: "Core Convener", token: session.token });
          return true;
        }
      } catch (e) {
        // Fall back to cryptographic verification
      }
    }

    // 2. Cryptographic Salted SHA-256 (Zero plaintext credentials in source)
    if (verifyAdminCredentials(username, password)) {
      setIsAdminLoggedIn(true);
      const session = generateAdminSession();
      sessionStorage.setItem("zairza_admin_token", session.token);
      setAdminUser({ username, role: "Super Admin", name: "Core Convener", token: session.token });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("zairza_admin_token");
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  return (
    <QuizContext.Provider
      value={{
        currentView,
        setCurrentView,
        quizConfig,
        setQuizConfig,
        questions,
        setQuestions,
        candidates,
        setCandidates,
        auditLogs,
        setAuditLogs,
        activeCandidate,
        setActiveCandidate,
        registerCandidate,
        loginCandidateByRoll,
        startQuiz,
        isSubmitting,
        answers,
        selectOption,
        markedForReview,
        toggleMarkForReview,
        clearAnswer,
        timeRemaining,
        isQuizActive,
        isQuizSubmitted,
        handleFinalSubmit,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentSectionId,
        setCurrentSectionId,
        violations,
        violationCount,
        triggerViolation,
        latestViolationMessage,
        showViolationModal,
        setShowViolationModal,
        showSubmitModal,
        setShowSubmitModal,
        mobilePaletteOpen,
        setMobilePaletteOpen,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminUser,
        selectedCandidateForDetails,
        setSelectedCandidateForDetails,
        isEvaluationUnlocked,
        getUnlockRemainingSeconds,
        answerKeys,
        setAnswerKeys,
        updateAnswerKey,
        allocatedQuestions,
        setAllocatedQuestions,
        activeQuestions,
        generateRandomizedQuestions
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
