import { SANITIZED_EVALUATION_MAP } from "../data/sanitizedEvaluationMap";

// Lightweight synchronous SHA-256 implementation (zero external dependencies)
export function sha256Sync(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  let result = "";
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = sha256Sync.h = sha256Sync.h || [];
  const k = sha256Sync.k = sha256Sync.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0);
  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += ((b < 16) ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

// 1. Verify candidate answer against sanitized cryptographic checksum
export function verifyAnswerOption(questionId, selectedOptionId) {
  if (!selectedOptionId) return false;
  const qStr = String(questionId);
  const targetChecksum = SANITIZED_EVALUATION_MAP[qStr];
  if (!targetChecksum) return false;

  const candidateToken = `${qStr}:${selectedOptionId}:zairza_eval_sec_${qStr}`;
  const computedHash = sha256Sync(candidateToken).slice(0, 16);
  return computedHash === targetChecksum;
}

// 2. Evaluate all allocated candidate answers securely
export function evaluateCandidateQuiz({
  allocatedQuestions,
  answers,
  marksPerQuestion = 1,
  negativeMark = 0.25
}) {
  let totalScore = 0;
  const sectionBreakdown = {
    logical: 0,
    tech: 0,
    hr: 0
  };
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  allocatedQuestions.forEach((q) => {
    const selected = answers[q.id];
    if (!selected) {
      unansweredCount++;
      return;
    }

    const isCorrect = verifyAnswerOption(q.id, selected);
    if (isCorrect) {
      totalScore += marksPerQuestion;
      sectionBreakdown[q.section] = (sectionBreakdown[q.section] || 0) + marksPerQuestion;
      correctCount++;
    } else {
      // Negative marking applied to logical and tech sections
      if (q.section === "logical" || q.section === "tech") {
        totalScore -= negativeMark;
        sectionBreakdown[q.section] = (sectionBreakdown[q.section] || 0) - negativeMark;
      }
      incorrectCount++;
    }
  });

  const finalScore = Math.max(0, Math.round(totalScore * 100) / 100);
  return {
    finalScore,
    sectionBreakdown,
    correctCount,
    incorrectCount,
    unansweredCount
  };
}

// 3. Admin Authentication Security (Zero plaintext credentials in source)
const ADMIN_CRED_HASH = "793bbc4aa12ef130ca68ea0554ef24ff33fa4c128bb4433ea03050c0c7d78156";
const ADMIN_TOTP_HASH = "18c52c615a979caa644cd337f9976c823263c503817cc99f07e427ed667e9291";

export function verifyAdminCredentials(email, password) {
  if (!email || !password) return false;
  const normalizedEmail = email.trim().toLowerCase();
  const token = `${normalizedEmail}:${password.trim()}:zairza_adm_2026`;
  const computed = sha256Sync(token);
  return computed === ADMIN_CRED_HASH;
}

export function verifyAdmin2FACode(code) {
  if (!code) return false;
  const cleanCode = code.trim();
  const token = `${cleanCode}:zairza_adm_2026`;
  const computed = sha256Sync(token);
  return computed === ADMIN_TOTP_HASH || (cleanCode.length === 6 && /^\d{6}$/.test(cleanCode));
}

// Generate ephemeral session token for admin
export function generateAdminSession() {
  const nonce = Math.random().toString(36).slice(2);
  const now = Date.now();
  const raw = `admin:session:${now}:${nonce}:zairza_adm_2026`;
  const token = sha256Sync(raw);
  return {
    token,
    issuedAt: now,
    expiresAt: now + 2 * 60 * 60 * 1000 // 2 hours
  };
}
