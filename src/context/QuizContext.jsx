import React, { createContext, useContext, useState, useEffect } from "react";
import { QUIZ_CONFIG, INITIAL_QUESTIONS, QUIZ_ANSWER_KEYS, INITIAL_CANDIDATES, INITIAL_AUDIT_LOGS } from "../data/mockQuizData";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

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

  // Isolated Answer Keys State (Segregated from candidate questions)
  const [answerKeys, setAnswerKeys] = useState(() => {
    const saved = localStorage.getItem("zairza_quiz_answer_keys");
    if (saved) {
      try {
        return { ...QUIZ_ANSWER_KEYS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return QUIZ_ANSWER_KEYS;
  });

  useEffect(() => {
    localStorage.setItem("zairza_quiz_answer_keys", JSON.stringify(answerKeys));
  }, [answerKeys]);

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

  // Admin Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

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

  // Anti-Cheat & Proctoring Telemetry (Page 6)
  const [violations, setViolations] = useState([]);
  const [violationCount, setViolationCount] = useState(0);
  const [latestViolationMessage, setLatestViolationMessage] = useState("");
  const [showViolationModal, setShowViolationModal] = useState(false);
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
  const triggerViolation = (violationType, details = "") => {
    if (!isQuizActive || isQuizSubmitted) return;

    const newViolation = {
      id: "v_" + Date.now(),
      type: violationType,
      details,
      timestamp: new Date().toLocaleTimeString(),
      rollNumber: activeCandidate ? activeCandidate.rollNumber : "GUEST"
    };

    const newCount = violationCount + 1;
    setViolationCount(newCount);
    setViolations((prev) => [newViolation, ...prev]);

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
    setShowViolationModal(true);

    // Auto-submission on exceeding violation threshold
    if (newCount >= quizConfig.maxViolationsAllowed) {
      setTimeout(() => {
        handleFinalSubmit("AUTO_SUBMIT_MAX_VIOLATIONS");
      }, 1500);
    }
  };

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
    setIsQuizSubmitted(false);
    setTimeRemaining(quizConfig.durationMinutes * 60);
    setViolationCount(0);
    setViolations([]);
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
  const handleFinalSubmit = (submissionReason = "MANUAL_SUBMIT") => {
    setIsQuizActive(false);
    setIsQuizSubmitted(true);
    setShowSubmitModal(false);
    setShowViolationModal(false);

    // Compute scores using the isolated QUIZ_ANSWER_KEYS table (evaluated against candidate's allocated questions)
    let totalScore = 0;
    const sectionBreakdown = {
      logical: 0,
      tech: 0,
      hr: 0
    };
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const activeQuestionsList = (allocatedQuestions && allocatedQuestions.length > 0) ? allocatedQuestions : questions.slice(0, 30);

    activeQuestionsList.forEach((q) => {
      const selected = answers[q.id];
      const solution = answerKeys[q.id] || answerKeys[String(q.id)] || QUIZ_ANSWER_KEYS[q.id];
      if (!selected) {
        unansweredCount++;
      } else if (solution && selected === solution.correctOptionId) {
        totalScore += quizConfig.marksPerQuestion;
        sectionBreakdown[q.section] = (sectionBreakdown[q.section] || 0) + quizConfig.marksPerQuestion;
        correctCount++;
      } else {
        totalScore -= quizConfig.negativeMark;
        incorrectCount++;
      }
    });

    const finalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const timeTaken = quizConfig.durationMinutes * 60 - timeRemaining;
    const submittedAtEpoch = Date.now();
    const evaluatesAtEpoch = submittedAtEpoch + 15 * 60 * 1000; // 15-minute security cooldown

    if (activeCandidate) {
      const updatedCandidate = {
        ...activeCandidate,
        quizStatus: "COMPLETED",
        score: finalScore,
        timeTakenSeconds: timeTaken,
        violationsCount: violationCount,
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
        supabase.from("quiz_attempts").insert([{
          roll_number: activeCandidate.rollNumber,
          status: "COMPLETED",
          score: finalScore,
          logical_score: sectionBreakdown.logical,
          tech_score: sectionBreakdown.tech,
          hr_score: sectionBreakdown.hr,
          correct_count: correctCount,
          incorrect_count: incorrectCount,
          unanswered_count: unansweredCount,
          violations_count: violationCount,
          time_taken_seconds: timeTaken,
          submission_reason: submissionReason
        }]).then(({ error }) => {
          if (error) console.warn("Supabase attempt sync note:", error.message);
        });
      }
    }

    setCurrentView("page8_success");
  };

  // Admin Login
  const loginAdmin = (username, password) => {
    if (username === "admin@zairza.in" && password === "zairza2026") {
      setIsAdminLoggedIn(true);
      setAdminUser({ username, role: "Super Admin", name: "Core Convener" });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
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
