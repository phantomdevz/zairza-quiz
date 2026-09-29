// Zairza Induction Platform — Master Question Bank & Assessment Configuration
// Window: 29th Sept 10:00 PM to 30th Sept 10:00 PM
// Registration Closes: 30th Sept 12:00 PM (Noon)
// Duration: 30 minutes (1800 seconds)
// Pool Sizes: 100 Logical Reasoning, 120 Tech Knowledge, 40 Coffee Test (Total: 260 Questions)

export const QUIZ_CONFIG = {
  "title": "Zairza Induction Assessment 2026",
  "societyName": "Zairza — OUTR Bhubaneswar",
  "tagline": "Wonder • Think • Create",
  "oaStartEpoch": "2026-09-29T22:00:00+05:30",
  "oaEndEpoch": "2026-09-30T22:00:00+05:30",
  "registrationCutoffEpoch": "2026-09-30T12:00:00+05:30",
  "durationMinutes": 30,
  "totalQuestions": 30,
  "marksPerQuestion": 1,
  "negativeMark": 0.25,
  "maxViolationsAllowed": 3,
  "sections": [
    {
      "id": "logical",
      "name": "Part 1: Logical Reasoning",
      "icon": "🧩",
      "poolSize": 100,
      "drawCount": 10
    },
    {
      "id": "tech",
      "name": "Part 2: Tech Knowledge & Trends",
      "icon": "⚡",
      "poolSize": 120,
      "drawCount": 15
    },
    {
      "id": "hr",
      "name": "Part 3: Coffee Test (Cultural Fit)",
      "icon": "☕",
      "poolSize": 40,
      "drawCount": 5
    }
  ]
};

// ==============================================================================
// PUBLIC MASTER QUESTION POOL (Sanitized: NO correctOptionId or explanation)
// Total 260 Questions: 100 LR, 120 Tech (Freshers), 40 Coffee Test (HR)
// ==============================================================================
export const INITIAL_QUESTIONS = [
  {
    "id": 1,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "225"
      },
      {
        "id": "opt_2",
        "text": "256"
      },
      {
        "id": "opt_3",
        "text": "289"
      },
      {
        "id": "opt_4",
        "text": "361"
      }
    ]
  },
  {
    "id": 2,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "What comes next in the alternating series: 3, 8, 6, 11, 9, 14, 12, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "15"
      },
      {
        "id": "opt_2",
        "text": "17"
      },
      {
        "id": "opt_3",
        "text": "19"
      },
      {
        "id": "opt_4",
        "text": "16"
      }
    ]
  },
  {
    "id": 3,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Identify the missing term: 2, 6, 12, 20, 30, 42, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "52"
      },
      {
        "id": "opt_2",
        "text": "56"
      },
      {
        "id": "opt_3",
        "text": "60"
      },
      {
        "id": "opt_4",
        "text": "64"
      }
    ]
  },
  {
    "id": 4,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Find the next term: 0, 7, 26, 63, 124, 215, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "342"
      },
      {
        "id": "opt_2",
        "text": "343"
      },
      {
        "id": "opt_3",
        "text": "344"
      },
      {
        "id": "opt_4",
        "text": "511"
      }
    ]
  },
  {
    "id": 5,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Complete the sequence: 1, 1, 2, 3, 5, 8, 13, 21, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "29"
      },
      {
        "id": "opt_2",
        "text": "34"
      },
      {
        "id": "opt_3",
        "text": "36"
      },
      {
        "id": "opt_4",
        "text": "42"
      }
    ]
  },
  {
    "id": 6,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Determine the next number: 5, 11, 23, 47, 95, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "181"
      },
      {
        "id": "opt_2",
        "text": "190"
      },
      {
        "id": "opt_3",
        "text": "191"
      },
      {
        "id": "opt_4",
        "text": "195"
      }
    ]
  },
  {
    "id": 7,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Find the missing number: 2, 3, 5, 7, 11, 13, 17, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "19"
      },
      {
        "id": "opt_2",
        "text": "21"
      },
      {
        "id": "opt_3",
        "text": "23"
      },
      {
        "id": "opt_4",
        "text": "27"
      }
    ]
  },
  {
    "id": 8,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "What is the next number: 100, 96, 88, 72, 40, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "-24"
      },
      {
        "id": "opt_2",
        "text": "-16"
      },
      {
        "id": "opt_3",
        "text": "0"
      },
      {
        "id": "opt_4",
        "text": "8"
      }
    ]
  },
  {
    "id": 9,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Identify the next term: 1, 4, 27, 256, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "1024"
      },
      {
        "id": "opt_2",
        "text": "3125"
      },
      {
        "id": "opt_3",
        "text": "4096"
      },
      {
        "id": "opt_4",
        "text": "5120"
      }
    ]
  },
  {
    "id": 10,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Find the missing term: 10, 14, 26, 62, 170, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "320"
      },
      {
        "id": "opt_2",
        "text": "494"
      },
      {
        "id": "opt_3",
        "text": "512"
      },
      {
        "id": "opt_4",
        "text": "486"
      }
    ]
  },
  {
    "id": 11,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "What comes next: 8, 12, 18, 27, 40.5, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "54"
      },
      {
        "id": "opt_2",
        "text": "60.75"
      },
      {
        "id": "opt_3",
        "text": "62.5"
      },
      {
        "id": "opt_4",
        "text": "72"
      }
    ]
  },
  {
    "id": 12,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Complete the sequence: 6, 13, 28, 59, 122, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "249"
      },
      {
        "id": "opt_2",
        "text": "251"
      },
      {
        "id": "opt_3",
        "text": "253"
      },
      {
        "id": "opt_4",
        "text": "247"
      }
    ]
  },
  {
    "id": 13,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Determine the next value: 1, 8, 9, 64, 25, 216, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "36"
      },
      {
        "id": "opt_2",
        "text": "49"
      },
      {
        "id": "opt_3",
        "text": "64"
      },
      {
        "id": "opt_4",
        "text": "81"
      }
    ]
  },
  {
    "id": 14,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "What is next: 2, 5, 10, 17, 26, 37, 50, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "63"
      },
      {
        "id": "opt_2",
        "text": "65"
      },
      {
        "id": "opt_3",
        "text": "67"
      },
      {
        "id": "opt_4",
        "text": "71"
      }
    ]
  },
  {
    "id": 15,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Number Series)",
    "prompt": "Find the next number: 80, 40, 40, 60, 120, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "240"
      },
      {
        "id": "opt_2",
        "text": "300"
      },
      {
        "id": "opt_3",
        "text": "360"
      },
      {
        "id": "opt_4",
        "text": "480"
      }
    ]
  },
  {
    "id": 16,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Find the next letter in the series: B, E, H, K, N, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "P"
      },
      {
        "id": "opt_2",
        "text": "Q"
      },
      {
        "id": "opt_3",
        "text": "R"
      },
      {
        "id": "opt_4",
        "text": "S"
      }
    ]
  },
  {
    "id": 17,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "What comes next: Z, W, S, N, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "H"
      },
      {
        "id": "opt_2",
        "text": "I"
      },
      {
        "id": "opt_3",
        "text": "J"
      },
      {
        "id": "opt_4",
        "text": "G"
      }
    ]
  },
  {
    "id": 18,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Find the next group: AZ, BY, CX, DW, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "EV"
      },
      {
        "id": "opt_2",
        "text": "EU"
      },
      {
        "id": "opt_3",
        "text": "FV"
      },
      {
        "id": "opt_4",
        "text": "FU"
      }
    ]
  },
  {
    "id": 19,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Identify the next term: A, C, F, J, O, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "T"
      },
      {
        "id": "opt_2",
        "text": "U"
      },
      {
        "id": "opt_3",
        "text": "V"
      },
      {
        "id": "opt_4",
        "text": "S"
      }
    ]
  },
  {
    "id": 20,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Complete the sequence: JAK, KBL, LCM, MDN, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "OEP"
      },
      {
        "id": "opt_2",
        "text": "NEO"
      },
      {
        "id": "opt_3",
        "text": "MEN"
      },
      {
        "id": "opt_4",
        "text": "PFQ"
      }
    ]
  },
  {
    "id": 21,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Find the next term: Z1A, X2B, V6C, T24D, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "R120E"
      },
      {
        "id": "opt_2",
        "text": "S120E"
      },
      {
        "id": "opt_3",
        "text": "R96E"
      },
      {
        "id": "opt_4",
        "text": "Q120E"
      }
    ]
  },
  {
    "id": 22,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "What comes next in the sequence: C, F, I, L, O, R, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "T"
      },
      {
        "id": "opt_2",
        "text": "U"
      },
      {
        "id": "opt_3",
        "text": "V"
      },
      {
        "id": "opt_4",
        "text": "S"
      }
    ]
  },
  {
    "id": 23,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Identify the missing term: DF, GJ, KM, NQ, RT, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "UX"
      },
      {
        "id": "opt_2",
        "text": "UW"
      },
      {
        "id": "opt_3",
        "text": "VX"
      },
      {
        "id": "opt_4",
        "text": "TX"
      }
    ]
  },
  {
    "id": 24,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "What is the next term: YB, WD, UF, SH, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "QJ"
      },
      {
        "id": "opt_2",
        "text": "PK"
      },
      {
        "id": "opt_3",
        "text": "QI"
      },
      {
        "id": "opt_4",
        "text": "RJ"
      }
    ]
  },
  {
    "id": 25,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Letter Series)",
    "prompt": "Complete the sequence: B2D, D4F, F6H, H8J, ?",
    "options": [
      {
        "id": "opt_1",
        "text": "J10L"
      },
      {
        "id": "opt_2",
        "text": "I10K"
      },
      {
        "id": "opt_3",
        "text": "J12L"
      },
      {
        "id": "opt_4",
        "text": "K10M"
      }
    ]
  },
  {
    "id": 26,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "In a certain code, 'ZAIRZA' is coded as 'ACKTBC'. By applying the same transformation pattern, how would 'INDUCT' be encoded?",
    "options": [
      {
        "id": "opt_1",
        "text": "KPFWEV"
      },
      {
        "id": "opt_2",
        "text": "KQFXFW"
      },
      {
        "id": "opt_3",
        "text": "JPEXEV"
      },
      {
        "id": "opt_4",
        "text": "LPFYFV"
      }
    ]
  },
  {
    "id": 27,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'ROBOT' is coded as 'TQBOT', how is 'DRONE' coded in the same system?",
    "options": [
      {
        "id": "opt_1",
        "text": "FTQPG"
      },
      {
        "id": "opt_2",
        "text": "FROPE"
      },
      {
        "id": "opt_3",
        "text": "ESPOF"
      },
      {
        "id": "opt_4",
        "text": "EQPQF"
      }
    ]
  },
  {
    "id": 28,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'SYSTEM' is coded as 'SYSMET' and 'NEARER' is coded as 'AENRER', then 'FRACTION' is coded as:",
    "options": [
      {
        "id": "opt_1",
        "text": "CARFNOIT"
      },
      {
        "id": "opt_2",
        "text": "CARFTION"
      },
      {
        "id": "opt_3",
        "text": "ARFCNOIT"
      },
      {
        "id": "opt_4",
        "text": "CRAFNOIT"
      }
    ]
  },
  {
    "id": 29,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'CAT' is coded as 24 and 'DOG' is coded as 26, how is 'PIG' coded?",
    "options": [
      {
        "id": "opt_1",
        "text": "32"
      },
      {
        "id": "opt_2",
        "text": "31"
      },
      {
        "id": "opt_3",
        "text": "33"
      },
      {
        "id": "opt_4",
        "text": "30"
      }
    ]
  },
  {
    "id": 30,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "In a code language, if 'WATER' is written as 'YCVGT', how is 'FIRE' written?",
    "options": [
      {
        "id": "opt_1",
        "text": "HKTG"
      },
      {
        "id": "opt_2",
        "text": "GJSF"
      },
      {
        "id": "opt_3",
        "text": "HJTE"
      },
      {
        "id": "opt_4",
        "text": "IKTF"
      }
    ]
  },
  {
    "id": 31,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'LIGHT' is coded as 'KHFGS', how is 'SOUND' coded?",
    "options": [
      {
        "id": "opt_1",
        "text": "TNVMEC"
      },
      {
        "id": "opt_2",
        "text": "RNTMC"
      },
      {
        "id": "opt_3",
        "text": "RPVMD"
      },
      {
        "id": "opt_4",
        "text": "ROVME"
      }
    ]
  },
  {
    "id": 32,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'EARTH' is coded as 5-1-18-20-8, how is 'VENUS' coded?",
    "options": [
      {
        "id": "opt_1",
        "text": "22-5-14-21-19"
      },
      {
        "id": "opt_2",
        "text": "21-5-13-20-18"
      },
      {
        "id": "opt_3",
        "text": "22-5-13-21-19"
      },
      {
        "id": "opt_4",
        "text": "20-5-14-22-19"
      }
    ]
  },
  {
    "id": 33,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'CLOUD' is written as 'ENQWF', how is 'RAIN' written?",
    "options": [
      {
        "id": "opt_1",
        "text": "TCPK"
      },
      {
        "id": "opt_2",
        "text": "TBNJ"
      },
      {
        "id": "opt_3",
        "text": "UCRK"
      },
      {
        "id": "opt_4",
        "text": "TBPL"
      }
    ]
  },
  {
    "id": 34,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "If 'ORANGE' is coded as 'QTCPIG', what is the code for 'APPLE'?",
    "options": [
      {
        "id": "opt_1",
        "text": "CRRNG"
      },
      {
        "id": "opt_2",
        "text": "CQQNG"
      },
      {
        "id": "opt_3",
        "text": "CRQNG"
      },
      {
        "id": "opt_4",
        "text": "CPPNG"
      }
    ]
  },
  {
    "id": 35,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Coding-Decoding)",
    "prompt": "In a secret military code, '123' means 'hot filtered coffee', '356' means 'very hot day', and '589' means 'day and night'. What digit stands for 'very'?",
    "options": [
      {
        "id": "opt_1",
        "text": "6"
      },
      {
        "id": "opt_2",
        "text": "3"
      },
      {
        "id": "opt_3",
        "text": "5"
      },
      {
        "id": "opt_4",
        "text": "8"
      }
    ]
  },
  {
    "id": 36,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
    "options": [
      {
        "id": "opt_1",
        "text": "Brother"
      },
      {
        "id": "opt_2",
        "text": "Father"
      },
      {
        "id": "opt_3",
        "text": "Uncle"
      },
      {
        "id": "opt_4",
        "text": "Grandfather"
      }
    ]
  },
  {
    "id": 37,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "A is B’s sister. C is B’s mother. D is C’s father. E is D’s mother. How is A related to D?",
    "options": [
      {
        "id": "opt_1",
        "text": "Grandmother"
      },
      {
        "id": "opt_2",
        "text": "Grandfather"
      },
      {
        "id": "opt_3",
        "text": "Granddaughter"
      },
      {
        "id": "opt_4",
        "text": "Daughter"
      }
    ]
  },
  {
    "id": 38,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "Introducing a girl, Vipin said, 'Her mother is the only daughter of my mother-in-law.' How is Vipin related to the girl?",
    "options": [
      {
        "id": "opt_1",
        "text": "Uncle"
      },
      {
        "id": "opt_2",
        "text": "Father"
      },
      {
        "id": "opt_3",
        "text": "Brother"
      },
      {
        "id": "opt_4",
        "text": "Husband"
      }
    ]
  },
  {
    "id": 39,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "P is the brother of Q and R. S is R’s mother. T is P’s father. Which of the following statements cannot be definitely asserted?",
    "options": [
      {
        "id": "opt_1",
        "text": "T is Q’s father"
      },
      {
        "id": "opt_2",
        "text": "S is P’s mother"
      },
      {
        "id": "opt_3",
        "text": "P is S’s son"
      },
      {
        "id": "opt_4",
        "text": "Q is T’s son"
      }
    ]
  },
  {
    "id": 40,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "Looking at a portrait, a man said, 'Brothers and sisters have I none, but that man's father is my father's son.' Whose portrait was it?",
    "options": [
      {
        "id": "opt_1",
        "text": "His son’s"
      },
      {
        "id": "opt_2",
        "text": "His father’s"
      },
      {
        "id": "opt_3",
        "text": "His own"
      },
      {
        "id": "opt_4",
        "text": "His nephew’s"
      }
    ]
  },
  {
    "id": 41,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "If P + Q means P is the husband of Q; P / Q means P is the sister of Q; and P * Q means P is the son of Q, which of the following shows that A is the daughter of B?",
    "options": [
      {
        "id": "opt_1",
        "text": "A / C * B"
      },
      {
        "id": "opt_2",
        "text": "B * C + A"
      },
      {
        "id": "opt_3",
        "text": "A * C / B"
      },
      {
        "id": "opt_4",
        "text": "B + C / A"
      }
    ]
  },
  {
    "id": 42,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "Ananya says, 'The man standing by the podium is the father of my brother's only sister's son.' Who is the man?",
    "options": [
      {
        "id": "opt_1",
        "text": "Her husband"
      },
      {
        "id": "opt_2",
        "text": "Her father"
      },
      {
        "id": "opt_3",
        "text": "Her brother"
      },
      {
        "id": "opt_4",
        "text": "Her uncle"
      }
    ]
  },
  {
    "id": 43,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "M is the sister of K. D is the brother of K. F is the mother of M. How is K related to F?",
    "options": [
      {
        "id": "opt_1",
        "text": "Son"
      },
      {
        "id": "opt_2",
        "text": "Daughter"
      },
      {
        "id": "opt_3",
        "text": "Son or Daughter"
      },
      {
        "id": "opt_4",
        "text": "Data inadequate"
      }
    ]
  },
  {
    "id": 44,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?",
    "options": [
      {
        "id": "opt_1",
        "text": "Nephew"
      },
      {
        "id": "opt_2",
        "text": "Son"
      },
      {
        "id": "opt_3",
        "text": "Cousin"
      },
      {
        "id": "opt_4",
        "text": "Uncle"
      }
    ]
  },
  {
    "id": 45,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Blood Relations)",
    "prompt": "R is the daughter of Q. M is the sister of B who is the son of Q. How is R related to M?",
    "options": [
      {
        "id": "opt_1",
        "text": "Cousin"
      },
      {
        "id": "opt_2",
        "text": "Sister"
      },
      {
        "id": "opt_3",
        "text": "Mother"
      },
      {
        "id": "opt_4",
        "text": "Aunt"
      }
    ]
  },
  {
    "id": 46,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "A robotic rover moves 12m North, turns East and moves 5m, then climbs a vertical antenna pole 13m high. What is its total straight-line distance from the starting origin point?",
    "options": [
      {
        "id": "opt_1",
        "text": "13m"
      },
      {
        "id": "opt_2",
        "text": "18.38m"
      },
      {
        "id": "opt_3",
        "text": "25m"
      },
      {
        "id": "opt_4",
        "text": "30m"
      }
    ]
  },
  {
    "id": 47,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "A student walks 20m North, turns right and walks 30m, turns right again and walks 35m, then turns left and walks 15m. In which direction is the student now relative to the starting point?",
    "options": [
      {
        "id": "opt_1",
        "text": "North-East"
      },
      {
        "id": "opt_2",
        "text": "South-East"
      },
      {
        "id": "opt_3",
        "text": "South-West"
      },
      {
        "id": "opt_4",
        "text": "North-West"
      }
    ]
  },
  {
    "id": 48,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "At sunrise, Amit is standing facing a telephone pole. The shadow of the pole falls exactly to his right. Which direction is Amit facing?",
    "options": [
      {
        "id": "opt_1",
        "text": "East"
      },
      {
        "id": "opt_2",
        "text": "West"
      },
      {
        "id": "opt_3",
        "text": "North"
      },
      {
        "id": "opt_4",
        "text": "South"
      }
    ]
  },
  {
    "id": 49,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "A delivery drone flies 10 km South, turns left and flies 20 km, turns left again and flies 10 km. How far and in what direction is it from the launch depot?",
    "options": [
      {
        "id": "opt_1",
        "text": "20 km West"
      },
      {
        "id": "opt_2",
        "text": "20 km East"
      },
      {
        "id": "opt_3",
        "text": "10 km North"
      },
      {
        "id": "opt_4",
        "text": "30 km East"
      }
    ]
  },
  {
    "id": 50,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "If South-East becomes North, North-East becomes West, and so on, what will West become?",
    "options": [
      {
        "id": "opt_1",
        "text": "North-East"
      },
      {
        "id": "opt_2",
        "text": "South-East"
      },
      {
        "id": "opt_3",
        "text": "North-West"
      },
      {
        "id": "opt_4",
        "text": "South-West"
      }
    ]
  },
  {
    "id": 51,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "Kunal walks 10 km towards North. From there he walks 6 km towards South. Then, he walks 3 km towards East. How far and in which direction is he with reference to his starting point?",
    "options": [
      {
        "id": "opt_1",
        "text": "5 km West"
      },
      {
        "id": "opt_2",
        "text": "5 km North-East"
      },
      {
        "id": "opt_3",
        "text": "7 km East"
      },
      {
        "id": "opt_4",
        "text": "5 km South-East"
      }
    ]
  },
  {
    "id": 52,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "One evening before sunset, two friends Sumit and Mohit were talking to each other face to face. If Mohit’s shadow was exactly to his right, which direction was Sumit facing?",
    "options": [
      {
        "id": "opt_1",
        "text": "North"
      },
      {
        "id": "opt_2",
        "text": "South"
      },
      {
        "id": "opt_3",
        "text": "East"
      },
      {
        "id": "opt_4",
        "text": "West"
      }
    ]
  },
  {
    "id": 53,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "Starting from point X, Jayant walked 15m West. He turned left and walked 20m. He then turned left and walked 15m. After this he turned to his right and walked 12m. How far is he now from point X?",
    "options": [
      {
        "id": "opt_1",
        "text": "32m"
      },
      {
        "id": "opt_2",
        "text": "47m"
      },
      {
        "id": "opt_3",
        "text": "20m"
      },
      {
        "id": "opt_4",
        "text": "27m"
      }
    ]
  },
  {
    "id": 54,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "A car travels 8 km East, turns right and travels 6 km. What is the shortest displacement to its starting point?",
    "options": [
      {
        "id": "opt_1",
        "text": "14 km"
      },
      {
        "id": "opt_2",
        "text": "10 km"
      },
      {
        "id": "opt_3",
        "text": "12 km"
      },
      {
        "id": "opt_4",
        "text": "2 km"
      }
    ]
  },
  {
    "id": 55,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Direction Sense)",
    "prompt": "Rahul puts his timepiece on the table in such a way that at 6 P.M. the hour hand points to North. In which direction will the minute hand point at 9.15 P.M.?",
    "options": [
      {
        "id": "opt_1",
        "text": "South-East"
      },
      {
        "id": "opt_2",
        "text": "West"
      },
      {
        "id": "opt_3",
        "text": "North"
      },
      {
        "id": "opt_4",
        "text": "South"
      }
    ]
  },
  {
    "id": 56,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "What is the acute angle between the hour hand and the minute hand of a clock at 3:15?",
    "options": [
      {
        "id": "opt_1",
        "text": "0 degrees"
      },
      {
        "id": "opt_2",
        "text": "7.5 degrees"
      },
      {
        "id": "opt_3",
        "text": "15 degrees"
      },
      {
        "id": "opt_4",
        "text": "22.5 degrees"
      }
    ]
  },
  {
    "id": 57,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "What is the angle between the hands of a clock at 8:20?",
    "options": [
      {
        "id": "opt_1",
        "text": "120 degrees"
      },
      {
        "id": "opt_2",
        "text": "130 degrees"
      },
      {
        "id": "opt_3",
        "text": "140 degrees"
      },
      {
        "id": "opt_4",
        "text": "110 degrees"
      }
    ]
  },
  {
    "id": 58,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "How many times do the hands of a clock coincide (overlap) in a standard 24-hour day?",
    "options": [
      {
        "id": "opt_1",
        "text": "24"
      },
      {
        "id": "opt_2",
        "text": "22"
      },
      {
        "id": "opt_3",
        "text": "20"
      },
      {
        "id": "opt_4",
        "text": "44"
      }
    ]
  },
  {
    "id": 59,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "If January 1, 2024 was a Monday, what day of the week was January 1, 2025?",
    "options": [
      {
        "id": "opt_1",
        "text": "Tuesday"
      },
      {
        "id": "opt_2",
        "text": "Wednesday"
      },
      {
        "id": "opt_3",
        "text": "Thursday"
      },
      {
        "id": "opt_4",
        "text": "Friday"
      }
    ]
  },
  {
    "id": 60,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "A clock gains 5 seconds every 3 minutes. If it is set correctly at 7:00 AM, what time will it display at 1:00 PM on the same day?",
    "options": [
      {
        "id": "opt_1",
        "text": "1:10 PM"
      },
      {
        "id": "opt_2",
        "text": "1:12 PM"
      },
      {
        "id": "opt_3",
        "text": "1:15 PM"
      },
      {
        "id": "opt_4",
        "text": "1:20 PM"
      }
    ]
  },
  {
    "id": 61,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "Today is Friday. What day of the week will it be after 61 days?",
    "options": [
      {
        "id": "opt_1",
        "text": "Tuesday"
      },
      {
        "id": "opt_2",
        "text": "Wednesday"
      },
      {
        "id": "opt_3",
        "text": "Thursday"
      },
      {
        "id": "opt_4",
        "text": "Sunday"
      }
    ]
  },
  {
    "id": 62,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "At what time between 4 o’clock and 5 o’clock will the hands of a clock be together?",
    "options": [
      {
        "id": "opt_1",
        "text": "4:21 9/11 min"
      },
      {
        "id": "opt_2",
        "text": "4:20 min"
      },
      {
        "id": "opt_3",
        "text": "4:22 min"
      },
      {
        "id": "opt_4",
        "text": "4:21 5/11 min"
      }
    ]
  },
  {
    "id": 63,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "Which of the following years is NOT a leap year?",
    "options": [
      {
        "id": "opt_1",
        "text": "2000"
      },
      {
        "id": "opt_2",
        "text": "2400"
      },
      {
        "id": "opt_3",
        "text": "1900"
      },
      {
        "id": "opt_4",
        "text": "2016"
      }
    ]
  },
  {
    "id": 64,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "How many times in a day are the hands of a clock at right angles (90 degrees) to each other?",
    "options": [
      {
        "id": "opt_1",
        "text": "22"
      },
      {
        "id": "opt_2",
        "text": "24"
      },
      {
        "id": "opt_3",
        "text": "44"
      },
      {
        "id": "opt_4",
        "text": "48"
      }
    ]
  },
  {
    "id": 65,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Clocks & Calendars)",
    "prompt": "The calendar for the year 2007 will be identical to which year?",
    "options": [
      {
        "id": "opt_1",
        "text": "2014"
      },
      {
        "id": "opt_2",
        "text": "2016"
      },
      {
        "id": "opt_3",
        "text": "2017"
      },
      {
        "id": "opt_4",
        "text": "2018"
      }
    ]
  },
  {
    "id": 66,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) All algorithms are logic. (2) No logic is emotional. Conclusions: (I) No algorithm is emotional. (II) Some logic are algorithms.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Neither follows"
      },
      {
        "id": "opt_4",
        "text": "Both I and II follow"
      }
    ]
  },
  {
    "id": 67,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) Some sensors are cameras. (2) Some cameras are radars. Conclusions: (I) Some sensors are radars. (II) No sensor is a radar.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Either I or II follows"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 68,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) All laptops are computers. (2) All computers are electronic. Conclusions: (I) All laptops are electronic. (II) All electronic devices are laptops.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Both follow"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 69,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) No cat is a dog. (2) No dog is a horse. Conclusions: (I) No cat is a horse. (II) Some horses are cats.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Neither follows"
      },
      {
        "id": "opt_4",
        "text": "Both follow"
      }
    ]
  },
  {
    "id": 70,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) All robots are machines. (2) Some machines are fast. Conclusions: (I) Some robots are fast. (II) Some fast items are machines.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Both follow"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 71,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "In a college batch of 100 students, 60 know Python, 50 know C++, and 30 know both. How many students know neither language?",
    "options": [
      {
        "id": "opt_1",
        "text": "10"
      },
      {
        "id": "opt_2",
        "text": "20"
      },
      {
        "id": "opt_3",
        "text": "30"
      },
      {
        "id": "opt_4",
        "text": "40"
      }
    ]
  },
  {
    "id": 72,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) Some pens are books. (2) All books are papers. Conclusions: (I) Some pens are papers. (II) All papers are books.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Both follow"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 73,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) All flowers are trees. (2) No tree is a fruit. Conclusions: (I) No fruit is a flower. (II) Some trees are flowers.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Both I and II follow"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 74,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "In a group of 50 club members, 35 play badminton, 20 play chess, and everyone plays at least one game. How many play both games?",
    "options": [
      {
        "id": "opt_1",
        "text": "5"
      },
      {
        "id": "opt_2",
        "text": "10"
      },
      {
        "id": "opt_3",
        "text": "15"
      },
      {
        "id": "opt_4",
        "text": "20"
      }
    ]
  },
  {
    "id": 75,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Syllogism)",
    "prompt": "Statements: (1) Most engineers are thinkers. (2) Thinkers are creators. Conclusions: (I) Some engineers are creators. (II) All creators are engineers.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only I follows"
      },
      {
        "id": "opt_2",
        "text": "Only II follows"
      },
      {
        "id": "opt_3",
        "text": "Both follow"
      },
      {
        "id": "opt_4",
        "text": "Neither follows"
      }
    ]
  },
  {
    "id": 76,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "In a class of 45 students, Aditya’s rank is 16th from the top. What is his rank from the bottom?",
    "options": [
      {
        "id": "opt_1",
        "text": "29th"
      },
      {
        "id": "opt_2",
        "text": "30th"
      },
      {
        "id": "opt_3",
        "text": "31st"
      },
      {
        "id": "opt_4",
        "text": "28th"
      }
    ]
  },
  {
    "id": 77,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "Six friends A, B, C, D, E, F are sitting in a circle facing the center. A is between B and F. D is opposite B. E is to the immediate left of D. Who is to the immediate left of C?",
    "options": [
      {
        "id": "opt_1",
        "text": "A"
      },
      {
        "id": "opt_2",
        "text": "B"
      },
      {
        "id": "opt_3",
        "text": "D"
      },
      {
        "id": "opt_4",
        "text": "F"
      }
    ]
  },
  {
    "id": 78,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "In a row of boys, Deepak is 7th from the left and Madhu is 12th from the right. If they interchange positions, Deepak becomes 22nd from the left. What is the total number of boys in the row?",
    "options": [
      {
        "id": "opt_1",
        "text": "31"
      },
      {
        "id": "opt_2",
        "text": "33"
      },
      {
        "id": "opt_3",
        "text": "34"
      },
      {
        "id": "opt_4",
        "text": "35"
      }
    ]
  },
  {
    "id": 79,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "Five colleagues P, Q, R, S, T sit in a line facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the exact middle?",
    "options": [
      {
        "id": "opt_1",
        "text": "P"
      },
      {
        "id": "opt_2",
        "text": "Q"
      },
      {
        "id": "opt_3",
        "text": "S"
      },
      {
        "id": "opt_4",
        "text": "T"
      }
    ]
  },
  {
    "id": 80,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "A is taller than B but shorter than C. D is taller than E but shorter than B. Who is the tallest among them all?",
    "options": [
      {
        "id": "opt_1",
        "text": "A"
      },
      {
        "id": "opt_2",
        "text": "B"
      },
      {
        "id": "opt_3",
        "text": "C"
      },
      {
        "id": "opt_4",
        "text": "D"
      }
    ]
  },
  {
    "id": 81,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "In a queue, Priya is 11th from the front and Rakesh is 20th from the back. If there are 5 people between them, what is the minimum possible number of people in the queue?",
    "options": [
      {
        "id": "opt_1",
        "text": "24"
      },
      {
        "id": "opt_2",
        "text": "26"
      },
      {
        "id": "opt_3",
        "text": "36"
      },
      {
        "id": "opt_4",
        "text": "34"
      }
    ]
  },
  {
    "id": 82,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "Eight people sit around a circular table facing inward. P is third to the right of M and second to the left of S. Who sits directly opposite M if the table is evenly spaced?",
    "options": [
      {
        "id": "opt_1",
        "text": "T"
      },
      {
        "id": "opt_2",
        "text": "S"
      },
      {
        "id": "opt_3",
        "text": "P"
      },
      {
        "id": "opt_4",
        "text": "R"
      }
    ]
  },
  {
    "id": 83,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "In a row of trees, a mango tree is 7th from either end of the row. How many trees are in the row?",
    "options": [
      {
        "id": "opt_1",
        "text": "11"
      },
      {
        "id": "opt_2",
        "text": "13"
      },
      {
        "id": "opt_3",
        "text": "14"
      },
      {
        "id": "opt_4",
        "text": "15"
      }
    ]
  },
  {
    "id": 84,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "Four students W, X, Y, Z took an exam. W scored more than X. Y scored less than Z. Z scored less than X. Who scored the lowest?",
    "options": [
      {
        "id": "opt_1",
        "text": "W"
      },
      {
        "id": "opt_2",
        "text": "X"
      },
      {
        "id": "opt_3",
        "text": "Y"
      },
      {
        "id": "opt_4",
        "text": "Z"
      }
    ]
  },
  {
    "id": 85,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Seating & Ranking)",
    "prompt": "Seven runners finish a race. A finishes ahead of B but behind C. D finishes ahead of E but behind B. F finishes ahead of C. Who won the race?",
    "options": [
      {
        "id": "opt_1",
        "text": "A"
      },
      {
        "id": "opt_2",
        "text": "C"
      },
      {
        "id": "opt_3",
        "text": "F"
      },
      {
        "id": "opt_4",
        "text": "D"
      }
    ]
  },
  {
    "id": 86,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Analogy)",
    "prompt": "Binary : 10001 :: Decimal : ?",
    "options": [
      {
        "id": "opt_1",
        "text": "15"
      },
      {
        "id": "opt_2",
        "text": "17"
      },
      {
        "id": "opt_3",
        "text": "19"
      },
      {
        "id": "opt_4",
        "text": "33"
      }
    ]
  },
  {
    "id": 87,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Odd-One-Out)",
    "prompt": "Find the odd one out from the given engineering software tools:",
    "options": [
      {
        "id": "opt_1",
        "text": "Compiler"
      },
      {
        "id": "opt_2",
        "text": "Interpreter"
      },
      {
        "id": "opt_3",
        "text": "Assembler"
      },
      {
        "id": "opt_4",
        "text": "Microcontroller"
      }
    ]
  },
  {
    "id": 88,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Analogy)",
    "prompt": "Thermometer : Temperature :: Barometer : ?",
    "options": [
      {
        "id": "opt_1",
        "text": "Pressure"
      },
      {
        "id": "opt_2",
        "text": "Humidity"
      },
      {
        "id": "opt_3",
        "text": "Velocity"
      },
      {
        "id": "opt_4",
        "text": "Current"
      }
    ]
  },
  {
    "id": 89,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Odd-One-Out)",
    "prompt": "Identify the odd one out: 27, 64, 125, 144, 216",
    "options": [
      {
        "id": "opt_1",
        "text": "27"
      },
      {
        "id": "opt_2",
        "text": "64"
      },
      {
        "id": "opt_3",
        "text": "144"
      },
      {
        "id": "opt_4",
        "text": "216"
      }
    ]
  },
  {
    "id": 90,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Analogy)",
    "prompt": "Clock : Time :: Odograph : ?",
    "options": [
      {
        "id": "opt_1",
        "text": "Speed"
      },
      {
        "id": "opt_2",
        "text": "Distance"
      },
      {
        "id": "opt_3",
        "text": "Acceleration"
      },
      {
        "id": "opt_4",
        "text": "Force"
      }
    ]
  },
  {
    "id": 91,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Odd-One-Out)",
    "prompt": "Which of the following does NOT belong with the others?",
    "options": [
      {
        "id": "opt_1",
        "text": "Copper"
      },
      {
        "id": "opt_2",
        "text": "Silver"
      },
      {
        "id": "opt_3",
        "text": "Aluminum"
      },
      {
        "id": "opt_4",
        "text": "Silicon"
      }
    ]
  },
  {
    "id": 92,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Analogy)",
    "prompt": "Byte : 8 Bits :: Nibble : ?",
    "options": [
      {
        "id": "opt_1",
        "text": "2 Bits"
      },
      {
        "id": "opt_2",
        "text": "4 Bits"
      },
      {
        "id": "opt_3",
        "text": "16 Bits"
      },
      {
        "id": "opt_4",
        "text": "32 Bits"
      }
    ]
  },
  {
    "id": 93,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Odd-One-Out)",
    "prompt": "Find the odd term: Linux, macOS, Windows, Oracle",
    "options": [
      {
        "id": "opt_1",
        "text": "Linux"
      },
      {
        "id": "opt_2",
        "text": "macOS"
      },
      {
        "id": "opt_3",
        "text": "Windows"
      },
      {
        "id": "opt_4",
        "text": "Oracle"
      }
    ]
  },
  {
    "id": 94,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "If 5 robots assemble 5 circuit boards in 5 minutes, how many minutes will it take 100 robots to assemble 100 circuit boards?",
    "options": [
      {
        "id": "opt_1",
        "text": "100 minutes"
      },
      {
        "id": "opt_2",
        "text": "5 minutes"
      },
      {
        "id": "opt_3",
        "text": "20 minutes"
      },
      {
        "id": "opt_4",
        "text": "50 minutes"
      }
    ]
  },
  {
    "id": 95,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "You have 8 identical-looking metal ball bearings. One is slightly heavier due to a casting flaw. What is the minimum number of balance scale weighings needed to guarantee finding the heavy ball?",
    "options": [
      {
        "id": "opt_1",
        "text": "1"
      },
      {
        "id": "opt_2",
        "text": "2"
      },
      {
        "id": "opt_3",
        "text": "3"
      },
      {
        "id": "opt_4",
        "text": "4"
      }
    ]
  },
  {
    "id": 96,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "You have a 4-minute hourglass and a 7-minute hourglass. What is the minimum total elapsed time to measure exactly 9 minutes for chemical curing?",
    "options": [
      {
        "id": "opt_1",
        "text": "9 minutes"
      },
      {
        "id": "opt_2",
        "text": "11 minutes"
      },
      {
        "id": "opt_3",
        "text": "12 minutes"
      },
      {
        "id": "opt_4",
        "text": "14 minutes"
      }
    ]
  },
  {
    "id": 97,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "A bat and a ball together cost Rs. 110. The bat costs Rs. 100 more than the ball. How much does the ball cost?",
    "options": [
      {
        "id": "opt_1",
        "text": "Rs. 10"
      },
      {
        "id": "opt_2",
        "text": "Rs. 5"
      },
      {
        "id": "opt_3",
        "text": "Rs. 15"
      },
      {
        "id": "opt_4",
        "text": "Rs. 1"
      }
    ]
  },
  {
    "id": 98,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "A snail is at the bottom of a 30-meter well. Each day it climbs up 3 meters, but each night it slides down 2 meters. On which day will the snail reach the top of the well?",
    "options": [
      {
        "id": "opt_1",
        "text": "30th day"
      },
      {
        "id": "opt_2",
        "text": "28th day"
      },
      {
        "id": "opt_3",
        "text": "29th day"
      },
      {
        "id": "opt_4",
        "text": "27th day"
      }
    ]
  },
  {
    "id": 99,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "There are 3 switches outside a closed room controlling 3 light bulbs inside. You can flip switches as you wish, but can enter the room only once. How do you determine which switch controls which bulb?",
    "options": [
      {
        "id": "opt_1",
        "text": "Turn on switch 1 for 10 min, turn it off, turn on switch 2, and enter: the lit bulb is 2, the warm bulb is 1, the cold unlit bulb is 3"
      },
      {
        "id": "opt_2",
        "text": "Flip all switches randomly"
      },
      {
        "id": "opt_3",
        "text": "Look under the door gap"
      },
      {
        "id": "opt_4",
        "text": "It is physically impossible with 1 trip"
      }
    ]
  },
  {
    "id": 100,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning (Brain Teasers)",
    "prompt": "Two ropes each take exactly 60 minutes to burn from one end to the other, but they burn inconsistently. How can you measure exactly 45 minutes using only these two ropes and a lighter?",
    "options": [
      {
        "id": "opt_1",
        "text": "Light rope 1 at both ends and rope 2 at one end simultaneously; when rope 1 burns out (30 min), light the other end of rope 2 (15 min remaining)"
      },
      {
        "id": "opt_2",
        "text": "Cut both ropes in half with scissors"
      },
      {
        "id": "opt_3",
        "text": "Burn rope 1 completely then burn 3/4 of rope 2"
      },
      {
        "id": "opt_4",
        "text": "Light all 4 ends at once"
      }
    ]
  },
  {
    "id": 101,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Who is universally celebrated as the world’s first computer programmer for writing an algorithm to compute Bernoulli numbers on Charles Babbage’s Analytical Engine in 1843?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ada Lovelace"
      },
      {
        "id": "opt_2",
        "text": "Grace Hopper"
      },
      {
        "id": "opt_3",
        "text": "Alan Turing"
      },
      {
        "id": "opt_4",
        "text": "Margaret Hamilton"
      }
    ]
  },
  {
    "id": 102,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "In 1947, computer pioneer Grace Hopper recorded the first actual case of a computer \"bug\". What was physically taped into the Harvard Mark II relay logbook?",
    "options": [
      {
        "id": "opt_1",
        "text": "A real moth trapped in relay #70"
      },
      {
        "id": "opt_2",
        "text": "A short-circuited copper wire"
      },
      {
        "id": "opt_3",
        "text": "A burned vacuum tube"
      },
      {
        "id": "opt_4",
        "text": "A spider web on the paper tape reader"
      }
    ]
  },
  {
    "id": 103,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Why is the world’s technology hub in Northern California known as \"Silicon Valley\"?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because silicon is the core chemical element used to manufacture semiconductor microchips and transistors"
      },
      {
        "id": "opt_2",
        "text": "Because the beaches are filled with quartz silicon sand"
      },
      {
        "id": "opt_3",
        "text": "Because the first computer case was made from silicone polymer"
      },
      {
        "id": "opt_4",
        "text": "Because of a famous local Silicon gold mine"
      }
    ]
  },
  {
    "id": 104,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What was Google’s original research project name when founders Larry Page and Sergey Brin began developing it at Stanford University in 1996?",
    "options": [
      {
        "id": "opt_1",
        "text": "BackRub (named for analyzing web backlinks)"
      },
      {
        "id": "opt_2",
        "text": "WebCrawler"
      },
      {
        "id": "opt_3",
        "text": "PageFinder"
      },
      {
        "id": "opt_4",
        "text": "StanfordSearch"
      }
    ]
  },
  {
    "id": 105,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What was the revolutionary network created in 1969 by the US Department of Defense that transmitted the first message (\"LO\") and formed the basis for today’s Internet?",
    "options": [
      {
        "id": "opt_1",
        "text": "ARPANET"
      },
      {
        "id": "opt_2",
        "text": "Ethernet"
      },
      {
        "id": "opt_3",
        "text": "Usenet"
      },
      {
        "id": "opt_4",
        "text": "BITNET"
      }
    ]
  },
  {
    "id": 106,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Guido van Rossum released the Python programming language in 1991. What was the name \"Python\" actually inspired by?",
    "options": [
      {
        "id": "opt_1",
        "text": "The British comedy sketch show \"Monty Python’s Flying Circus\""
      },
      {
        "id": "opt_2",
        "text": "A pet rock python snake in his garden"
      },
      {
        "id": "opt_3",
        "text": "An acronym for Portable Yield Threading Oriented Network"
      },
      {
        "id": "opt_4",
        "text": "The ancient Greek Oracle of Delphi python"
      }
    ]
  },
  {
    "id": 107,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Who invented the World Wide Web (WWW) in 1989 while working at CERN to help scientists share research data across networked computers?",
    "options": [
      {
        "id": "opt_1",
        "text": "Tim Berners-Lee"
      },
      {
        "id": "opt_2",
        "text": "Marc Andreessen"
      },
      {
        "id": "opt_3",
        "text": "Vint Cerf"
      },
      {
        "id": "opt_4",
        "text": "Steve Jobs"
      }
    ]
  },
  {
    "id": 108,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "In 1991, Finnish university student Linus Torvalds announced a free open-source Unix-like operating system kernel. What did it become?",
    "options": [
      {
        "id": "opt_1",
        "text": "Linux"
      },
      {
        "id": "opt_2",
        "text": "Ubuntu"
      },
      {
        "id": "opt_3",
        "text": "FreeBSD"
      },
      {
        "id": "opt_4",
        "text": "Android OS"
      }
    ]
  },
  {
    "id": 109,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Who introduced the \"@\" symbol into electronic mail addresses in 1971 to separate the user name from the machine name?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ray Tomlinson"
      },
      {
        "id": "opt_2",
        "text": "Bob Kahn"
      },
      {
        "id": "opt_3",
        "text": "Douglas Engelbart"
      },
      {
        "id": "opt_4",
        "text": "Dennis Ritchie"
      }
    ]
  },
  {
    "id": 110,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What legendary input device did Douglas Engelbart invent and demonstrate in 1968 during the \"Mother of All Demos\"?",
    "options": [
      {
        "id": "opt_1",
        "text": "The computer mouse (carved from wood with two wheels)"
      },
      {
        "id": "opt_2",
        "text": "The mechanical keyboard"
      },
      {
        "id": "opt_3",
        "text": "The capacitive touchscreen"
      },
      {
        "id": "opt_4",
        "text": "The laser barcode scanner"
      }
    ]
  },
  {
    "id": 111,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Which company created the famous 1984 Macintosh commercial introducing the first mass-market personal computer with a graphical user interface (GUI) and mouse?",
    "options": [
      {
        "id": "opt_1",
        "text": "Apple"
      },
      {
        "id": "opt_2",
        "text": "IBM"
      },
      {
        "id": "opt_3",
        "text": "Commodore"
      },
      {
        "id": "opt_4",
        "text": "Atari"
      }
    ]
  },
  {
    "id": 112,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What was the first commercial electronic spreadsheet application that made the Apple II a vital business tool in 1979?",
    "options": [
      {
        "id": "opt_1",
        "text": "VisiCalc"
      },
      {
        "id": "opt_2",
        "text": "Lotus 1-2-3"
      },
      {
        "id": "opt_3",
        "text": "Microsoft Excel"
      },
      {
        "id": "opt_4",
        "text": "Quattro Pro"
      }
    ]
  },
  {
    "id": 113,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "In what year was the first iPhone unveiled by Steve Jobs, revolutionizing capacitive multi-touch smartphones?",
    "options": [
      {
        "id": "opt_1",
        "text": "2007"
      },
      {
        "id": "opt_2",
        "text": "2005"
      },
      {
        "id": "opt_3",
        "text": "2008"
      },
      {
        "id": "opt_4",
        "text": "2010"
      }
    ]
  },
  {
    "id": 114,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Which pioneering computer scientist led the Bletchley Park team that cracked the German Enigma cipher during World War II and conceptualized modern computing theory?",
    "options": [
      {
        "id": "opt_1",
        "text": "Alan Turing"
      },
      {
        "id": "opt_2",
        "text": "John von Neumann"
      },
      {
        "id": "opt_3",
        "text": "Claude Shannon"
      },
      {
        "id": "opt_4",
        "text": "Norbert Wiener"
      }
    ]
  },
  {
    "id": 115,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What was the name of the first programmable general-purpose electronic digital computer built in the US during WWII at the University of Pennsylvania?",
    "options": [
      {
        "id": "opt_1",
        "text": "ENIAC"
      },
      {
        "id": "opt_2",
        "text": "UNIVAC I"
      },
      {
        "id": "opt_3",
        "text": "EDVAC"
      },
      {
        "id": "opt_4",
        "text": "Colossus"
      }
    ]
  },
  {
    "id": 116,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What seminal solid-state device was invented at Bell Labs in December 1947 by Bardeen, Brattain, and Shockley, replacing fragile vacuum tubes?",
    "options": [
      {
        "id": "opt_1",
        "text": "The Transistor"
      },
      {
        "id": "opt_2",
        "text": "The Capacitor"
      },
      {
        "id": "opt_3",
        "text": "The Integrated Circuit"
      },
      {
        "id": "opt_4",
        "text": "The Solar Cell"
      }
    ]
  },
  {
    "id": 117,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What was the capacity of the world’s first commercial hard disk drive, the IBM 350 RAMAC released in 1956?",
    "options": [
      {
        "id": "opt_1",
        "text": "About 5 Megabytes (stored across fifty 24-inch magnetic platters)"
      },
      {
        "id": "opt_2",
        "text": "1 Gigabyte"
      },
      {
        "id": "opt_3",
        "text": "500 Kilobytes"
      },
      {
        "id": "opt_4",
        "text": "128 Megabytes"
      }
    ]
  },
  {
    "id": 118,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "What famous open-source license allows developers to freely use, modify, distribute, and sell software without releasing their own proprietary code?",
    "options": [
      {
        "id": "opt_1",
        "text": "MIT License"
      },
      {
        "id": "opt_2",
        "text": "GPLv3"
      },
      {
        "id": "opt_3",
        "text": "Creative Commons BY-NC"
      },
      {
        "id": "opt_4",
        "text": "Proprietary EULA"
      }
    ]
  },
  {
    "id": 119,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Which legendary laboratory in Palo Alto, California developed the computer mouse, graphical desktop icons, Ethernet, and laser printing in the 1970s?",
    "options": [
      {
        "id": "opt_1",
        "text": "Xerox PARC"
      },
      {
        "id": "opt_2",
        "text": "Bell Labs"
      },
      {
        "id": "opt_3",
        "text": "MIT Media Lab"
      },
      {
        "id": "opt_4",
        "text": "IBM Research"
      }
    ]
  },
  {
    "id": 120,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "In 1997, which IBM supercomputer made history by becoming the first computer to defeat reigning World Chess Champion Garry Kasparov in a classical match?",
    "options": [
      {
        "id": "opt_1",
        "text": "Deep Blue"
      },
      {
        "id": "opt_2",
        "text": "Watson"
      },
      {
        "id": "opt_3",
        "text": "DeepMind AlphaZero"
      },
      {
        "id": "opt_4",
        "text": "Big Blue"
      }
    ]
  },
  {
    "id": 121,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "Why does a computer lose all data stored in RAM when powered off, but retains files on an SSD or Hard Drive?",
    "options": [
      {
        "id": "opt_1",
        "text": "RAM is volatile memory requiring continuous electrical power to maintain bit states; SSDs use non-volatile flash traps"
      },
      {
        "id": "opt_2",
        "text": "RAM is magnetic while SSD is optical"
      },
      {
        "id": "opt_3",
        "text": "RAM automatically deletes files to save battery"
      },
      {
        "id": "opt_4",
        "text": "RAM only runs during internet connection"
      }
    ]
  },
  {
    "id": 122,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is the primary architectural difference between a CPU and a GPU?",
    "options": [
      {
        "id": "opt_1",
        "text": "A CPU has fewer cores optimized for sequential single-thread tasks; a GPU has thousands of smaller cores for massive parallel math"
      },
      {
        "id": "opt_2",
        "text": "A CPU only handles graphics while a GPU runs the OS"
      },
      {
        "id": "opt_3",
        "text": "A CPU is analog and a GPU is digital"
      },
      {
        "id": "opt_4",
        "text": "A GPU does not contain transistors"
      }
    ]
  },
  {
    "id": 123,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is the purpose of the thermal paste applied between a processor chip and its cooling heatsink?",
    "options": [
      {
        "id": "opt_1",
        "text": "To fill microscopic air gaps between the metal surfaces so heat transfers efficiently"
      },
      {
        "id": "opt_2",
        "text": "To glue the CPU permanently to the motherboard"
      },
      {
        "id": "opt_3",
        "text": "To conduct electricity into the cooling fan"
      },
      {
        "id": "opt_4",
        "text": "To prevent the CPU from freezing in winter"
      }
    ]
  },
  {
    "id": 124,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What does the BIOS/UEFI chip on a computer motherboard do when you first press the power button?",
    "options": [
      {
        "id": "opt_1",
        "text": "Performs a Power-On Self Test (POST) and loads the operating system bootloader into memory"
      },
      {
        "id": "opt_2",
        "text": "Checks your email and updates graphics drivers"
      },
      {
        "id": "opt_3",
        "text": "Formats the hard disk drive"
      },
      {
        "id": "opt_4",
        "text": "Controls the monitor resolution exclusively"
      }
    ]
  },
  {
    "id": 125,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "Why do modern Solid State Drives (SSDs) load games and boot Windows 10x faster than mechanical Hard Disk Drives (HDDs)?",
    "options": [
      {
        "id": "opt_1",
        "text": "SSDs have zero moving mechanical parts and read flash chips instantaneously without seek latency"
      },
      {
        "id": "opt_2",
        "text": "SSDs compress all files by 90%"
      },
      {
        "id": "opt_3",
        "text": "SSDs connect directly to the power supply without cables"
      },
      {
        "id": "opt_4",
        "text": "SSDs bypass the computer CPU entirely"
      }
    ]
  },
  {
    "id": 126,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is Cache Memory (L1, L2, L3) inside a modern microprocessor?",
    "options": [
      {
        "id": "opt_1",
        "text": "Small, extremely fast static RAM located right on the CPU silicon die to keep frequently used instructions"
      },
      {
        "id": "opt_2",
        "text": "A cloud backup folder for photos"
      },
      {
        "id": "opt_3",
        "text": "The hidden cache partition on your USB flash drive"
      },
      {
        "id": "opt_4",
        "text": "Virtual memory swapped onto the hard drive"
      }
    ]
  },
  {
    "id": 127,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What does the clock speed of a processor (e.g., 3.8 GHz) measure?",
    "options": [
      {
        "id": "opt_1",
        "text": "The number of clock cycles (billions per second) the CPU internal clock oscillates to synchronize operations"
      },
      {
        "id": "opt_2",
        "text": "The speed of the cooling fan inside the cabinet"
      },
      {
        "id": "opt_3",
        "text": "How fast data travels across your home Wi-Fi"
      },
      {
        "id": "opt_4",
        "text": "The battery charging rate"
      }
    ]
  },
  {
    "id": 128,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "Tech Trivia: If a single binary digit (0 or 1) is called a \"bit\", what is a group of 8 bits called?",
    "options": [
      {
        "id": "opt_1",
        "text": "A Byte"
      },
      {
        "id": "opt_2",
        "text": "A Nibble"
      },
      {
        "id": "opt_3",
        "text": "A Word"
      },
      {
        "id": "opt_4",
        "text": "A Pixel"
      }
    ]
  },
  {
    "id": 129,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "Why are liquid cooling loops (AIOs) used in high-performance workstations and gaming desktops instead of small aluminum heatsinks?",
    "options": [
      {
        "id": "opt_1",
        "text": "Water has a much higher specific heat capacity than air, absorbing and dissipating high thermal wattage away from the CPU"
      },
      {
        "id": "opt_2",
        "text": "Water speeds up the flow of electrons through copper pins"
      },
      {
        "id": "opt_3",
        "text": "Water prevents dust from accumulating inside the PC"
      },
      {
        "id": "opt_4",
        "text": "Water reduces electrical resistance to zero"
      }
    ]
  },
  {
    "id": 130,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is Overclocking in computer hardware?",
    "options": [
      {
        "id": "opt_1",
        "text": "Manually configuring a CPU or GPU to run at higher clock multiplier frequencies and voltages than factory specs"
      },
      {
        "id": "opt_2",
        "text": "Running two monitors at the same time"
      },
      {
        "id": "opt_3",
        "text": "Keeping the PC turned on for over 24 hours"
      },
      {
        "id": "opt_4",
        "text": "Replacing Windows with Linux"
      }
    ]
  },
  {
    "id": 131,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What does HDMI stand for on video display cables and TV monitors?",
    "options": [
      {
        "id": "opt_1",
        "text": "High-Definition Multimedia Interface"
      },
      {
        "id": "opt_2",
        "text": "Heavy-Duty Motherboard Interconnect"
      },
      {
        "id": "opt_3",
        "text": "High-Density Memory Integrator"
      },
      {
        "id": "opt_4",
        "text": "Hyper-Digital Motion Input"
      }
    ]
  },
  {
    "id": 132,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What does DisplayPort offer over older VGA and DVI computer monitor connectors?",
    "options": [
      {
        "id": "opt_1",
        "text": "High refresh rates (144Hz-360Hz+), packetized digital transmission, and multi-stream daisy chaining"
      },
      {
        "id": "opt_2",
        "text": "Analog radio wave transmissions"
      },
      {
        "id": "opt_3",
        "text": "Direct battery charging for gaming chairs"
      },
      {
        "id": "opt_4",
        "text": "Built-in wireless screen mirroring"
      }
    ]
  },
  {
    "id": 133,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is the role of the Power Supply Unit (PSU) inside a computer tower?",
    "options": [
      {
        "id": "opt_1",
        "text": "Converts high-voltage alternating current (AC from wall outlet) into regulated low-voltage direct current (DC: 12V, 5V, 3.3V)"
      },
      {
        "id": "opt_2",
        "text": "Generates electricity using a miniature motor"
      },
      {
        "id": "opt_3",
        "text": "Acts as a Wi-Fi booster"
      },
      {
        "id": "opt_4",
        "text": "Stores data when power fails"
      }
    ]
  },
  {
    "id": 134,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What is RAM dual-channel architecture?",
    "options": [
      {
        "id": "opt_1",
        "text": "Using two identical memory sticks simultaneously across two separate memory controller channels to double memory bandwidth"
      },
      {
        "id": "opt_2",
        "text": "Plugging RAM into two different computers"
      },
      {
        "id": "opt_3",
        "text": "Installing two different operating systems in memory"
      },
      {
        "id": "opt_4",
        "text": "Using both Bluetooth and Wi-Fi together"
      }
    ]
  },
  {
    "id": 135,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware & Architecture)",
    "prompt": "What does Moore’s Law historically state regarding microchips?",
    "options": [
      {
        "id": "opt_1",
        "text": "The number of transistors on a microchip tends to double approximately every two years with falling relative cost"
      },
      {
        "id": "opt_2",
        "text": "Computers double their physical size every decade"
      },
      {
        "id": "opt_3",
        "text": "Internet speed doubles every month"
      },
      {
        "id": "opt_4",
        "text": "Software bugs double with every new programmer"
      }
    ]
  },
  {
    "id": 136,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "Why did the European Union mandate USB Type-C as the standard charging port for all smartphones, tablets, and cameras?",
    "options": [
      {
        "id": "opt_1",
        "text": "To reduce electronic waste and allow consumers to use one interoperable, reversible high-speed charger across all brands"
      },
      {
        "id": "opt_2",
        "text": "Because USB-C cables cannot carry viruses"
      },
      {
        "id": "opt_3",
        "text": "Because Apple owned the patent on USB-C"
      },
      {
        "id": "opt_4",
        "text": "To make phone screens brighter"
      }
    ]
  },
  {
    "id": 137,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "Why was short-range wireless technology named \"Bluetooth\"?",
    "options": [
      {
        "id": "opt_1",
        "text": "Named after 10th-century Danish Viking King Harald Bluetooth, who united Scandinavian tribes just as Bluetooth unites devices"
      },
      {
        "id": "opt_2",
        "text": "Because the first transmitter gave off a blue indicator glow"
      },
      {
        "id": "opt_3",
        "text": "Because the inventor loved eating blueberries"
      },
      {
        "id": "opt_4",
        "text": "Because radio frequencies turn air molecules blue"
      }
    ]
  },
  {
    "id": 138,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What does the term \"Wi-Fi\" officially stand for?",
    "options": [
      {
        "id": "opt_1",
        "text": "Nothing: it is a catchy consumer brand name created by a branding firm, though often misattributed to Wireless Fidelity"
      },
      {
        "id": "opt_2",
        "text": "Wireless Fiber-optics"
      },
      {
        "id": "opt_3",
        "text": "Wide Frequency Internet"
      },
      {
        "id": "opt_4",
        "text": "Worldwide Fidelity"
      }
    ]
  },
  {
    "id": 139,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "Why was the QWERTY keyboard layout originally created for mechanical typewriters in the 1870s?",
    "options": [
      {
        "id": "opt_1",
        "text": "To space out frequently used letter pairs so mechanical typewriter typebars would not collide and jam during fast typing"
      },
      {
        "id": "opt_2",
        "text": "Because it was the most ergonomic layout for human fingers"
      },
      {
        "id": "opt_3",
        "text": "To spell out \"TYPEWRITER\" on the top row"
      },
      {
        "id": "opt_4",
        "text": "To make learning typing more difficult"
      }
    ]
  },
  {
    "id": 140,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "Tech Riddle: \"I have keys with no locks, a space with no room, and you can enter but never leave. What am I?\"",
    "options": [
      {
        "id": "opt_1",
        "text": "A computer keyboard"
      },
      {
        "id": "opt_2",
        "text": "A flash drive"
      },
      {
        "id": "opt_3",
        "text": "A secure server room"
      },
      {
        "id": "opt_4",
        "text": "A database index"
      }
    ]
  },
  {
    "id": 141,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What legendary hardware reset key combination was designed by David Bradley for early IBM PCs to restart without power-cycling?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ctrl + Alt + Delete"
      },
      {
        "id": "opt_2",
        "text": "Shift + Tab + Escape"
      },
      {
        "id": "opt_3",
        "text": "Alt + F4 + Space"
      },
      {
        "id": "opt_4",
        "text": "Ctrl + Shift + Enter"
      }
    ]
  },
  {
    "id": 142,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What technology allows you to tap your phone or debit card on a POS payment terminal without inserting or swiping?",
    "options": [
      {
        "id": "opt_1",
        "text": "Near Field Communication (NFC)"
      },
      {
        "id": "opt_2",
        "text": "Infrared beam"
      },
      {
        "id": "opt_3",
        "text": "Long-Range RFID"
      },
      {
        "id": "opt_4",
        "text": "Satellite radar"
      }
    ]
  },
  {
    "id": 143,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "Why were QR codes invented by Japanese company Denso Wave in 1994?",
    "options": [
      {
        "id": "opt_1",
        "text": "To track automobile parts during car manufacturing with fast 2D scanning from any angle"
      },
      {
        "id": "opt_2",
        "text": "To share Wi-Fi passwords at restaurants"
      },
      {
        "id": "opt_3",
        "text": "To display restaurant menus on smartphones"
      },
      {
        "id": "opt_4",
        "text": "To replace credit card magnetic stripes"
      }
    ]
  },
  {
    "id": 144,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What is an eSIM in modern smartphones?",
    "options": [
      {
        "id": "opt_1",
        "text": "A digital programmable SIM chip soldered directly onto the phone’s motherboard, eliminating physical plastic SIM cards"
      },
      {
        "id": "opt_2",
        "text": "A virtual SIM stored on the cloud requiring daily login"
      },
      {
        "id": "opt_3",
        "text": "An electronic battery booster"
      },
      {
        "id": "opt_4",
        "text": "A satellite antenna adapter"
      }
    ]
  },
  {
    "id": 145,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What does a refresh rate of 120Hz on a smartphone or monitor screen mean?",
    "options": [
      {
        "id": "opt_1",
        "text": "The display refreshes the displayed image 120 times every second, making animations and scrolling feel ultra-smooth"
      },
      {
        "id": "opt_2",
        "text": "The screen flashes 120 times per minute"
      },
      {
        "id": "opt_3",
        "text": "The device processor runs at 120 Megahertz"
      },
      {
        "id": "opt_4",
        "text": "The battery lasts for 120 hours"
      }
    ]
  },
  {
    "id": 146,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What does the IP rating \"IP68\" on a flagship smartphone signify?",
    "options": [
      {
        "id": "opt_1",
        "text": "Dust-tight protection (6) and water submersion resistance up to 1.5 meters for 30 minutes (8)"
      },
      {
        "id": "opt_2",
        "text": "Internet Protocol version 68 compatibility"
      },
      {
        "id": "opt_3",
        "text": "Impact Proof up to 68 meters drop height"
      },
      {
        "id": "opt_4",
        "text": "Internal Processor with 68 cores"
      }
    ]
  },
  {
    "id": 147,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What enables Active Noise Cancellation (ANC) in modern earbuds like AirPods and Sony headphones?",
    "options": [
      {
        "id": "opt_1",
        "text": "Outward microphones detect ambient noise and speakers generate an inverted phase \"anti-noise\" sound wave that cancels it"
      },
      {
        "id": "opt_2",
        "text": "Thick layers of lead insulation"
      },
      {
        "id": "opt_3",
        "text": "Playing silent supersonic audio that numbs the eardrum"
      },
      {
        "id": "opt_4",
        "text": "Blocking ear canals with solid glue"
      }
    ]
  },
  {
    "id": 148,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "How does GPS (Global Positioning System) on your phone determine your exact coordinates on Earth?",
    "options": [
      {
        "id": "opt_1",
        "text": "By calculating time-of-flight radio signals from at least 4 atomic-clock orbital satellites using trilateration"
      },
      {
        "id": "opt_2",
        "text": "By reading mobile cell phone towers only"
      },
      {
        "id": "opt_3",
        "text": "By measuring magnetic earth poles using compass chips"
      },
      {
        "id": "opt_4",
        "text": "By bouncing laser beams off the clouds"
      }
    ]
  },
  {
    "id": 149,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What is the main visual advantage of an OLED display compared to a traditional LCD IPS display?",
    "options": [
      {
        "id": "opt_1",
        "text": "Each OLED pixel emits its own light and can turn off completely for true infinite contrast and deep blacks"
      },
      {
        "id": "opt_2",
        "text": "OLED screens never consume any battery power"
      },
      {
        "id": "opt_3",
        "text": "OLED screens can only display black and white"
      },
      {
        "id": "opt_4",
        "text": "OLED screens cannot break when dropped"
      }
    ]
  },
  {
    "id": 150,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Gadgets & Standards)",
    "prompt": "What does the term \"Thunderbolt\" port on laptops mean?",
    "options": [
      {
        "id": "opt_1",
        "text": "A high-speed hardware interface developed by Intel and Apple that carries PCIe, DisplayPort, and DC power up to 40Gbps over USB-C"
      },
      {
        "id": "opt_2",
        "text": "A lightning-proof charger connector"
      },
      {
        "id": "opt_3",
        "text": "A solar charging battery connector"
      },
      {
        "id": "opt_4",
        "text": "An acoustic sound port for lightning storms"
      }
    ]
  },
  {
    "id": 151,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does the Domain Name System (DNS) do on the internet?",
    "options": [
      {
        "id": "opt_1",
        "text": "Translates human-friendly web domain names (like zairza.in) into machine-routable IP addresses (like 172.67.182.20)"
      },
      {
        "id": "opt_2",
        "text": "Encrypts personal credit card numbers"
      },
      {
        "id": "opt_3",
        "text": "Compresses images before downloading"
      },
      {
        "id": "opt_4",
        "text": "Assigns student roll numbers"
      }
    ]
  },
  {
    "id": 152,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does the \"s\" in HTTPS stand for and what does the padlock in your browser address bar verify?",
    "options": [
      {
        "id": "opt_1",
        "text": "Secure (HTTP over TLS/SSL encryption); verifies data sent between your browser and the server is encrypted and tamper-proof"
      },
      {
        "id": "opt_2",
        "text": "Speed (HTTP Server Acceleration)"
      },
      {
        "id": "opt_3",
        "text": "Standard (Standard World Wide Web)"
      },
      {
        "id": "opt_4",
        "text": "Social (Social Media Verified)"
      }
    ]
  },
  {
    "id": 153,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "Why is Two-Factor Authentication (2FA) strongly recommended for personal college, email, and coding accounts?",
    "options": [
      {
        "id": "opt_1",
        "text": "Even if an attacker steals or guesses your password, they cannot log in without your physical phone code or security key"
      },
      {
        "id": "opt_2",
        "text": "It doubles your internet download speed"
      },
      {
        "id": "opt_3",
        "text": "It lets you share passwords safely with friends"
      },
      {
        "id": "opt_4",
        "text": "It prevents your monitor from accumulating dust"
      }
    ]
  },
  {
    "id": 154,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does the standard HTTP status code \"404 Not Found\" mean?",
    "options": [
      {
        "id": "opt_1",
        "text": "The browser successfully communicated with the web server, but the server could not locate the requested page/resource"
      },
      {
        "id": "opt_2",
        "text": "Your internet connection was disconnected"
      },
      {
        "id": "opt_3",
        "text": "The web server has suffered a hardware explosion"
      },
      {
        "id": "opt_4",
        "text": "Your computer has been infected with malware"
      }
    ]
  },
  {
    "id": 155,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "Where does over 99% of all international intercontinental internet data traffic physically travel across the world?",
    "options": [
      {
        "id": "opt_1",
        "text": "Through fiber-optic submarine communication cables laid across the ocean floor"
      },
      {
        "id": "opt_2",
        "text": "Through orbiting communication satellites in space"
      },
      {
        "id": "opt_3",
        "text": "Through microwave cell towers"
      },
      {
        "id": "opt_4",
        "text": "Through underground radio tunnels"
      }
    ]
  },
  {
    "id": 156,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does \"The Cloud\" (e.g., AWS, Microsoft Azure, Google Cloud) physically mean in computer science?",
    "options": [
      {
        "id": "opt_1",
        "text": "Massive, highly-secured, air-conditioned data center warehouses filled with racks of servers connected globally via the internet"
      },
      {
        "id": "opt_2",
        "text": "Data converted into radio waves floating in the Earth’s upper atmosphere"
      },
      {
        "id": "opt_3",
        "text": "Hard drives strapped to weather observation balloons"
      },
      {
        "id": "opt_4",
        "text": "A futuristic quantum dimension inside computer screens"
      }
    ]
  },
  {
    "id": 157,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does opening an \"Incognito\" or \"Private Browsing\" window in Google Chrome or Firefox actually do?",
    "options": [
      {
        "id": "opt_1",
        "text": "It does not save your local browsing history, cookies, or form data on that computer after closing the window"
      },
      {
        "id": "opt_2",
        "text": "It makes you completely invisible to website servers, Wi-Fi admins, and internet service providers"
      },
      {
        "id": "opt_3",
        "text": "It encrypts your webcam video feed"
      },
      {
        "id": "opt_4",
        "text": "It protects you from physical police surveillance"
      }
    ]
  },
  {
    "id": 158,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is Phishing in cybersecurity?",
    "options": [
      {
        "id": "opt_1",
        "text": "A deceptive attack where scammers pose as legitimate organizations via fake emails or websites to trick users into revealing passwords"
      },
      {
        "id": "opt_2",
        "text": "Catching computer bugs using software nets"
      },
      {
        "id": "opt_3",
        "text": "Downloading pirated movies over torrent networks"
      },
      {
        "id": "opt_4",
        "text": "Overheating a computer CPU using infinite loops"
      }
    ]
  },
  {
    "id": 159,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is Ransomware?",
    "options": [
      {
        "id": "opt_1",
        "text": "Malicious software that encrypts a victim’s computer files and demands payment in cryptocurrency to provide the decryption key"
      },
      {
        "id": "opt_2",
        "text": "Software that automatically pays your phone bills"
      },
      {
        "id": "opt_3",
        "text": "An antivirus that cleans files for free"
      },
      {
        "id": "opt_4",
        "text": "A tool used to speed up internet downloads"
      }
    ]
  },
  {
    "id": 160,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is the primary difference between IPv4 and IPv6 internet addresses?",
    "options": [
      {
        "id": "opt_1",
        "text": "IPv4 uses 32-bit addresses (~4.3 billion total) and has run out; IPv6 uses 128-bit hexadecimal addresses providing virtually infinite IPs"
      },
      {
        "id": "opt_2",
        "text": "IPv6 is only for military satellites while IPv4 is for phones"
      },
      {
        "id": "opt_3",
        "text": "IPv4 is wireless and IPv6 is wired Ethernet"
      },
      {
        "id": "opt_4",
        "text": "IPv4 is text-based while IPv6 uses Morse code"
      }
    ]
  },
  {
    "id": 161,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does a Firewall do on a computer network?",
    "options": [
      {
        "id": "opt_1",
        "text": "Monitors and filters incoming and outgoing network traffic based on predetermined security rules to block unauthorized access"
      },
      {
        "id": "opt_2",
        "text": "Extinguishes physical electrical fires inside the computer power supply"
      },
      {
        "id": "opt_3",
        "text": "Speeds up your gaming graphics card"
      },
      {
        "id": "opt_4",
        "text": "Cleans dust out of fan vents"
      }
    ]
  },
  {
    "id": 162,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is a Computer Worm compared to a traditional Computer Virus?",
    "options": [
      {
        "id": "opt_1",
        "text": "A worm is standalone malware that replicates itself automatically across networks without requiring user action to attach to a host file"
      },
      {
        "id": "opt_2",
        "text": "A worm is made of physical biological matter"
      },
      {
        "id": "opt_3",
        "text": "A worm only infects computer monitors"
      },
      {
        "id": "opt_4",
        "text": "A worm cannot cause harm"
      }
    ]
  },
  {
    "id": 163,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is a VPN (Virtual Private Network)?",
    "options": [
      {
        "id": "opt_1",
        "text": "An encrypted software tunnel that routes your internet traffic through a remote server, masking your public IP address from local snooping"
      },
      {
        "id": "opt_2",
        "text": "A special physical fiber cable plugged into your laptop"
      },
      {
        "id": "opt_3",
        "text": "A private website only accessible by programmers"
      },
      {
        "id": "opt_4",
        "text": "A virus scanning program"
      }
    ]
  },
  {
    "id": 164,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is the role of an Internet Cookie stored by your web browser?",
    "options": [
      {
        "id": "opt_1",
        "text": "A small text file saved by websites to remember login sessions, shopping carts, and user preferences"
      },
      {
        "id": "opt_2",
        "text": "A virus that deletes hard drive partitions"
      },
      {
        "id": "opt_3",
        "text": "A reward earned for visiting websites quickly"
      },
      {
        "id": "opt_4",
        "text": "A hardware sensor inside the trackpad"
      }
    ]
  },
  {
    "id": 165,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is a Distributed Denial of Service (DDoS) attack?",
    "options": [
      {
        "id": "opt_1",
        "text": "Overwhelming a targeted server or website with a flood of fake internet traffic from thousands of infected botnet computers"
      },
      {
        "id": "opt_2",
        "text": "Physically cutting undersea fiber cables"
      },
      {
        "id": "opt_3",
        "text": "Stealing credit cards using skimmers"
      },
      {
        "id": "opt_4",
        "text": "Guessing a password by trying dictionary words"
      }
    ]
  },
  {
    "id": 166,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is End-to-End Encryption (E2EE) used by messaging apps like WhatsApp and Signal?",
    "options": [
      {
        "id": "opt_1",
        "text": "Only the communicating sender and recipient have the cryptographic keys to decrypt messages; neither the service provider nor hackers can read them"
      },
      {
        "id": "opt_2",
        "text": "Messages are only encrypted when your phone is turned off"
      },
      {
        "id": "opt_3",
        "text": "Messages are stored in plain text on public Google servers"
      },
      {
        "id": "opt_4",
        "text": "Messages are permanently printed on paper"
      }
    ]
  },
  {
    "id": 167,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does the term \"Open Source\" mean in software development?",
    "options": [
      {
        "id": "opt_1",
        "text": "The software source code is published publicly so anyone can inspect, modify, enhance, and learn from it"
      },
      {
        "id": "opt_2",
        "text": "The software has no security passwords"
      },
      {
        "id": "opt_3",
        "text": "The software only works with an open internet tab"
      },
      {
        "id": "opt_4",
        "text": "The software is proprietary and owned by a single corporation"
      }
    ]
  },
  {
    "id": 168,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What does the term \"Bandwidth\" measure in internet networking?",
    "options": [
      {
        "id": "opt_1",
        "text": "The maximum data transfer capacity of a network communication channel per unit of time (e.g., Megabits per second)"
      },
      {
        "id": "opt_2",
        "text": "The physical length of your Ethernet cable"
      },
      {
        "id": "opt_3",
        "text": "The weight of a router in kilograms"
      },
      {
        "id": "opt_4",
        "text": "The number of tabs open in your browser"
      }
    ]
  },
  {
    "id": 169,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is a Zero-Day Vulnerability in cybersecurity?",
    "options": [
      {
        "id": "opt_1",
        "text": "A software security flaw that is known to attackers or researchers before the software developer has created and issued a security patch"
      },
      {
        "id": "opt_2",
        "text": "A virus that only works on Sundays"
      },
      {
        "id": "opt_3",
        "text": "A computer bug that deletes itself in 0 days"
      },
      {
        "id": "opt_4",
        "text": "A trial software program that expires in 0 days"
      }
    ]
  },
  {
    "id": 170,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet & Security)",
    "prompt": "What is Two-Way SSL / Mutual TLS (mTLS)?",
    "options": [
      {
        "id": "opt_1",
        "text": "Both client and server authenticate each other’s cryptographic certificates before establishing a secure communication session"
      },
      {
        "id": "opt_2",
        "text": "Typing your password two times in a row"
      },
      {
        "id": "opt_3",
        "text": "Using two different web browsers simultaneously"
      },
      {
        "id": "opt_4",
        "text": "Opening two tabs of the same website"
      }
    ]
  },
  {
    "id": 171,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "In generative AI systems like ChatGPT, what does the abbreviation \"GPT\" actually stand for?",
    "options": [
      {
        "id": "opt_1",
        "text": "Generative Pre-trained Transformer"
      },
      {
        "id": "opt_2",
        "text": "General Programmed Technology"
      },
      {
        "id": "opt_3",
        "text": "Global Python Terminal"
      },
      {
        "id": "opt_4",
        "text": "Graph Processing Tokenizer"
      }
    ]
  },
  {
    "id": 172,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "Why is semiconductor company NVIDIA the dominant hardware leader in modern artificial intelligence?",
    "options": [
      {
        "id": "opt_1",
        "text": "Their graphics processing units (GPUs) and CUDA software platform excel at the massive parallel matrix multiplications needed for training neural networks"
      },
      {
        "id": "opt_2",
        "text": "They are the only company that manufactures computer cases"
      },
      {
        "id": "opt_3",
        "text": "They own the copyright to the Python programming language"
      },
      {
        "id": "opt_4",
        "text": "Their chips are made entirely of diamond crystals"
      }
    ]
  },
  {
    "id": 173,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is an \"AI Hallucination\" in Large Language Models (LLMs)?",
    "options": [
      {
        "id": "opt_1",
        "text": "When an AI generates factually incorrect or fabricated statements while sounding completely confident and plausible"
      },
      {
        "id": "opt_2",
        "text": "When a computer screen displays glowing psychedelic colors"
      },
      {
        "id": "opt_3",
        "text": "When an AI model turns itself off due to heat"
      },
      {
        "id": "opt_4",
        "text": "When a robot dreams of electric sheep"
      }
    ]
  },
  {
    "id": 174,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Prompt Engineering\" in the context of AI tools?",
    "options": [
      {
        "id": "opt_1",
        "text": "The practice of carefully designing and structuring input queries, instructions, and context to produce the best possible output from an AI model"
      },
      {
        "id": "opt_2",
        "text": "Wiring cables inside an AI server rack"
      },
      {
        "id": "opt_3",
        "text": "Writing operating system drivers in Assembly"
      },
      {
        "id": "opt_4",
        "text": "Soldering silicon chips on a breadboard"
      }
    ]
  },
  {
    "id": 175,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "Which groundbreaking research paper published by Google researchers in 2017 introduced the \"Attention\" mechanism that powers modern LLMs?",
    "options": [
      {
        "id": "opt_1",
        "text": "\"Attention Is All You Need\""
      },
      {
        "id": "opt_2",
        "text": "\"Deep Learning in Neural Nets\""
      },
      {
        "id": "opt_3",
        "text": "\"Computing Machinery and Intelligence\""
      },
      {
        "id": "opt_4",
        "text": "\"Mastering the Game of Go\""
      }
    ]
  },
  {
    "id": 176,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is a \"Deepfake\" in modern digital media?",
    "options": [
      {
        "id": "opt_1",
        "text": "Synthetic media where a person’s face, voice, or likeness is convincingly replaced or generated using deep generative neural networks"
      },
      {
        "id": "opt_2",
        "text": "A low-resolution photo taken underwater"
      },
      {
        "id": "opt_3",
        "text": "A fake account created on a website"
      },
      {
        "id": "opt_4",
        "text": "A deleted post from a social media forum"
      }
    ]
  },
  {
    "id": 177,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What does the \"Turing Test\", proposed by Alan Turing in 1950, seek to evaluate?",
    "options": [
      {
        "id": "opt_1",
        "text": "Whether a machine can converse via text so humanly that an evaluator cannot distinguish it from a real human being"
      },
      {
        "id": "opt_2",
        "text": "Whether a computer can compute 1 billion numbers in 1 second"
      },
      {
        "id": "opt_3",
        "text": "Whether a computer can survive underwater"
      },
      {
        "id": "opt_4",
        "text": "Whether a robot can run a marathon"
      }
    ]
  },
  {
    "id": 178,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Computer Vision\" in artificial intelligence?",
    "options": [
      {
        "id": "opt_1",
        "text": "The field of AI that trains computers to interpret and understand meaningful visual information from digital images and real-time camera feeds"
      },
      {
        "id": "opt_2",
        "text": "Special glasses worn by programmers when coding late at night"
      },
      {
        "id": "opt_3",
        "text": "A monitor screen that tracks human eyes"
      },
      {
        "id": "opt_4",
        "text": "A 4K resolution camera attached to drones"
      }
    ]
  },
  {
    "id": 179,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Reinforcement Learning from Human Feedback\" (RLHF) used to train conversational models like ChatGPT?",
    "options": [
      {
        "id": "opt_1",
        "text": "Finetuning model outputs using human preferences and reward scoring so the model becomes helpful, harmless, and polite"
      },
      {
        "id": "opt_2",
        "text": "Paying human workers to type all answers manually in real time"
      },
      {
        "id": "opt_3",
        "text": "Having humans type computer code directly into neural weights"
      },
      {
        "id": "opt_4",
        "text": "Punishing robots with electric shocks"
      }
    ]
  },
  {
    "id": 180,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What are \"Tokens\" in Large Language Models?",
    "options": [
      {
        "id": "opt_1",
        "text": "The basic units of text (words, syllables, or character fragments) that a model reads, processes, and predicts sequentially"
      },
      {
        "id": "opt_2",
        "text": "Digital coins used to buy items in video games"
      },
      {
        "id": "opt_3",
        "text": "Physical plastic chips used to play arcade games"
      },
      {
        "id": "opt_4",
        "text": "Security badges used to enter college labs"
      }
    ]
  },
  {
    "id": 181,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "Which AI research organization created Claude, focusing heavily on \"Constitutional AI\" safety frameworks?",
    "options": [
      {
        "id": "opt_1",
        "text": "Anthropic"
      },
      {
        "id": "opt_2",
        "text": "OpenAI"
      },
      {
        "id": "opt_3",
        "text": "DeepMind"
      },
      {
        "id": "opt_4",
        "text": "Meta AI"
      }
    ]
  },
  {
    "id": 182,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is Google DeepMind’s AlphaFold celebrated for in computational biology?",
    "options": [
      {
        "id": "opt_1",
        "text": "Accurately predicting the 3D folded atomic structures of nearly all known proteins from their amino acid sequences"
      },
      {
        "id": "opt_2",
        "text": "Developing video game characters"
      },
      {
        "id": "opt_3",
        "text": "Designing electric sports cars"
      },
      {
        "id": "opt_4",
        "text": "Translating ancient hieroglyphics"
      }
    ]
  },
  {
    "id": 183,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is the main purpose of autonomous vehicle perception systems combining Cameras, Radar, and LiDAR?",
    "options": [
      {
        "id": "opt_1",
        "text": "To create an accurate 3D point-cloud and visual model of nearby pedestrians, vehicles, road boundaries, and obstacles in real time"
      },
      {
        "id": "opt_2",
        "text": "To play movies on the car windshield"
      },
      {
        "id": "opt_3",
        "text": "To take panoramic photos for social media"
      },
      {
        "id": "opt_4",
        "text": "To broadcast radio stations to passing cars"
      }
    ]
  },
  {
    "id": 184,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Overfitting\" in machine learning model training?",
    "options": [
      {
        "id": "opt_1",
        "text": "When a model memorizes the training data too closely (including noise), causing it to perform poorly on new, unseen test data"
      },
      {
        "id": "opt_2",
        "text": "When an algorithm runs out of computer memory"
      },
      {
        "id": "opt_3",
        "text": "When the cooling fan on a server spins too fast"
      },
      {
        "id": "opt_4",
        "text": "When a neural network has fewer than 3 layers"
      }
    ]
  },
  {
    "id": 185,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Synthetic Data\" in AI training?",
    "options": [
      {
        "id": "opt_1",
        "text": "Data artificially generated by computer simulations or algorithms rather than collected from direct real-world measurements"
      },
      {
        "id": "opt_2",
        "text": "Counterfeit memory chips made of plastic"
      },
      {
        "id": "opt_3",
        "text": "Fake news articles posted online"
      },
      {
        "id": "opt_4",
        "text": "Data corrupted by computer viruses"
      }
    ]
  },
  {
    "id": 186,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is an \"Autonomous Agent\" in modern AI software?",
    "options": [
      {
        "id": "opt_1",
        "text": "An AI system that can independently perceive its environment, formulate sub-goals, use tools, run code, and execute multi-step tasks"
      },
      {
        "id": "opt_2",
        "text": "A robot spy created for government intelligence"
      },
      {
        "id": "opt_3",
        "text": "A customer service call center employee"
      },
      {
        "id": "opt_4",
        "text": "A virus that deletes browser cookies"
      }
    ]
  },
  {
    "id": 187,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is a \"Neural Network\" loosely modeled after in computer science?",
    "options": [
      {
        "id": "opt_1",
        "text": "The interconnected network of biological neurons and synapses in the human brain"
      },
      {
        "id": "opt_2",
        "text": "A spider web built in outdoor forests"
      },
      {
        "id": "opt_3",
        "text": "The railway network of European passenger trains"
      },
      {
        "id": "opt_4",
        "text": "The wiring inside a household television set"
      }
    ]
  },
  {
    "id": 188,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What does the term \"Open Weights\" mean for AI models like Meta’s Llama series?",
    "options": [
      {
        "id": "opt_1",
        "text": "The trained parameter weights are publicly downloadable and runnable on local hardware, unlike proprietary API-only models"
      },
      {
        "id": "opt_2",
        "text": "The model files have no digital weight in bytes"
      },
      {
        "id": "opt_3",
        "text": "The model requires zero electricity to compute"
      },
      {
        "id": "opt_4",
        "text": "The model cannot be used for commercial purposes"
      }
    ]
  },
  {
    "id": 189,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What is \"Zero-Shot Learning\" in AI?",
    "options": [
      {
        "id": "opt_1",
        "text": "The ability of a model to perform a task or classify inputs without having received any specific training examples for that exact task"
      },
      {
        "id": "opt_2",
        "text": "Training an AI model in zero seconds"
      },
      {
        "id": "opt_3",
        "text": "An AI model that always outputs zero"
      },
      {
        "id": "opt_4",
        "text": "A computer game where you take zero shots"
      }
    ]
  },
  {
    "id": 190,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Modern Trends)",
    "prompt": "What does \"Edge AI\" refer to in modern engineering?",
    "options": [
      {
        "id": "opt_1",
        "text": "Running AI models directly on local physical devices (like smartphones, drones, or smart cameras) without sending data to the cloud"
      },
      {
        "id": "opt_2",
        "text": "AI models that generate sharp edges on 3D models"
      },
      {
        "id": "opt_3",
        "text": "AI servers placed at the outer edge of room desks"
      },
      {
        "id": "opt_4",
        "text": "AI algorithms that are very close to failing"
      }
    ]
  },
  {
    "id": 191,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Sensors)",
    "prompt": "How does an Ultrasonic Sensor (like the common HC-SR04 module used in student obstacle-avoidance robots) measure the distance to a wall or obstacle?",
    "options": [
      {
        "id": "opt_1",
        "text": "By emitting a burst of high-frequency sound waves and calculating the time it takes for the echo to bounce back (like a bat)"
      },
      {
        "id": "opt_2",
        "text": "By taking digital photographs of the obstacle"
      },
      {
        "id": "opt_3",
        "text": "By measuring ambient room temperature"
      },
      {
        "id": "opt_4",
        "text": "By magnetic attraction to metal objects"
      }
    ]
  },
  {
    "id": 192,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Sensors)",
    "prompt": "In a classic student Line Follower Robot, how do Infrared (IR) sensor pairs detect and follow a black track drawn on a white floor?",
    "options": [
      {
        "id": "opt_1",
        "text": "The white surface reflects emitted infrared light back to the photodiode receiver, while the black line absorbs the light"
      },
      {
        "id": "opt_2",
        "text": "The black line emits heat that warms the robot wheels"
      },
      {
        "id": "opt_3",
        "text": "The sensor magnetically latches onto the black ink"
      },
      {
        "id": "opt_4",
        "text": "The robot smells the ink on the floor"
      }
    ]
  },
  {
    "id": 193,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Motors)",
    "prompt": "Why do robotic arms and steering mechanisms use Servo Motors instead of regular DC Motors?",
    "options": [
      {
        "id": "opt_1",
        "text": "Servo motors have built-in feedback control that allows precise angular positioning (e.g., exactly 0° to 180°), whereas standard DC motors spin continuously"
      },
      {
        "id": "opt_2",
        "text": "Servo motors do not require any electricity"
      },
      {
        "id": "opt_3",
        "text": "DC motors only work under water"
      },
      {
        "id": "opt_4",
        "text": "Servo motors are made of rubber"
      }
    ]
  },
  {
    "id": 194,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Hardware)",
    "prompt": "What is the Arduino Uno board commonly used in first-year robotics and IoT projects?",
    "options": [
      {
        "id": "opt_1",
        "text": "An open-source microcontroller prototyping board (featuring the ATmega328P chip) with input/output pins to control sensors, motors, and LEDs"
      },
      {
        "id": "opt_2",
        "text": "A high-end desktop gaming graphics card"
      },
      {
        "id": "opt_3",
        "text": "A wireless cellular SIM card"
      },
      {
        "id": "opt_4",
        "text": "A battery charger for smartphones"
      }
    ]
  },
  {
    "id": 195,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Hardware)",
    "prompt": "In a college electronics and robotics lab, what is a \"Breadboard\" used for?",
    "options": [
      {
        "id": "opt_1",
        "text": "Temporarily prototyping circuits and plugging in sensors, LEDs, and jumper wires without needing to solder"
      },
      {
        "id": "opt_2",
        "text": "Slicing bread and food during hackathons"
      },
      {
        "id": "opt_3",
        "text": "Measuring high-voltage electrical currents"
      },
      {
        "id": "opt_4",
        "text": "Storing electronic files permanently"
      }
    ]
  },
  {
    "id": 196,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Electronics)",
    "prompt": "Why cannot you connect a high-power DC motor directly to an Arduino or Raspberry Pi output pin without a Motor Driver module (like the L298N)?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because microcontroller pins can only safely supply tiny currents (~20-40 mA), while DC motors draw high electrical currents that would permanently burn the microcontroller chip"
      },
      {
        "id": "opt_2",
        "text": "Because motors only spin backwards when connected to an Arduino"
      },
      {
        "id": "opt_3",
        "text": "Because Arduino code cannot speak English"
      },
      {
        "id": "opt_4",
        "text": "Because DC motors require solar energy only"
      }
    ]
  },
  {
    "id": 197,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Sensors)",
    "prompt": "What does an LDR (Light Dependent Resistor / Photoresistor) do in a solar-tracker or light-seeking robot?",
    "options": [
      {
        "id": "opt_1",
        "text": "Its electrical resistance decreases as the intensity of light falling on it increases, allowing the robot to locate the brightest light source"
      },
      {
        "id": "opt_2",
        "text": "It generates free electricity out of thin air"
      },
      {
        "id": "opt_3",
        "text": "It stores digital pictures of the sun"
      },
      {
        "id": "opt_4",
        "text": "It measures wind speed"
      }
    ]
  },
  {
    "id": 198,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Sensors)",
    "prompt": "What type of sensor is commonly used in automatic intruder alarms and human-following robots to detect the presence of humans?",
    "options": [
      {
        "id": "opt_1",
        "text": "PIR (Passive Infrared) Sensor, which detects changes in thermal infrared radiation emitted by warm human bodies"
      },
      {
        "id": "opt_2",
        "text": "Barometer, which detects atmospheric air pressure"
      },
      {
        "id": "opt_3",
        "text": "Hygrometer, which measures humidity"
      },
      {
        "id": "opt_4",
        "text": "Ammeter, which counts lightning strikes"
      }
    ]
  },
  {
    "id": 199,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics Mechanisms)",
    "prompt": "In robotics, what is an \"End-Effector\"?",
    "options": [
      {
        "id": "opt_1",
        "text": "The device or tool at the very end of a robotic arm that interacts with the physical environment (such as a gripper, mechanical claw, welder, or suction cup)"
      },
      {
        "id": "opt_2",
        "text": "The emergency power off switch on the wall"
      },
      {
        "id": "opt_3",
        "text": "The software license agreement of the robot"
      },
      {
        "id": "opt_4",
        "text": "The robot’s battery charging cable"
      }
    ]
  },
  {
    "id": 200,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Drones)",
    "prompt": "On a standard 4-rotor quadcopter drone, why do two diagonal propellers rotate Clockwise (CW) while the other two rotate Counter-Clockwise (CCW)?",
    "options": [
      {
        "id": "opt_1",
        "text": "To cancel out rotational torque (yaw reaction force), preventing the drone body from spinning uncontrollably in circles"
      },
      {
        "id": "opt_2",
        "text": "Because the manufacturer had a shortage of identical propellers"
      },
      {
        "id": "opt_3",
        "text": "To create a musical sound while flying"
      },
      {
        "id": "opt_4",
        "text": "Because one side pushes air up and the other side pushes air down"
      }
    ]
  },
  {
    "id": 201,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics Locomotion)",
    "prompt": "How does a 2-wheeled differential drive mobile robot turn around on the spot (a zero-radius turn)?",
    "options": [
      {
        "id": "opt_1",
        "text": "By rotating the left wheel forward and the right wheel backward at the same speed"
      },
      {
        "id": "opt_2",
        "text": "By turning the front steering wheel like a passenger car"
      },
      {
        "id": "opt_3",
        "text": "By extending a mechanical leg from underneath"
      },
      {
        "id": "opt_4",
        "text": "By blowing high-pressure air sideways"
      }
    ]
  },
  {
    "id": 202,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics Ethics & Lore)",
    "prompt": "In science fiction and AI ethics, what does Isaac Asimov’s famous \"First Law of Robotics\" state?",
    "options": [
      {
        "id": "opt_1",
        "text": "A robot may not injure a human being or, through inaction, allow a human being to come to harm"
      },
      {
        "id": "opt_2",
        "text": "A robot must always be painted silver or chrome"
      },
      {
        "id": "opt_3",
        "text": "A robot must win all chess games against humans"
      },
      {
        "id": "opt_4",
        "text": "A robot must never turn off its power"
      }
    ]
  },
  {
    "id": 203,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Sensors)",
    "prompt": "What does a LiDAR sensor on autonomous mobile robots (AMRs) and self-driving vehicles use to map surrounding rooms and obstacles in 3D?",
    "options": [
      {
        "id": "opt_1",
        "text": "Rotating laser beams that fire thousands of light pulses per second to measure precise distance reflections (Time of Flight)"
      },
      {
        "id": "opt_2",
        "text": "Sonar ping signals that bounce off water"
      },
      {
        "id": "opt_3",
        "text": "Chemical sniffers that detect floor paint"
      },
      {
        "id": "opt_4",
        "text": "Magnetic compass needles"
      }
    ]
  },
  {
    "id": 204,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics Kinematics)",
    "prompt": "A basic pick-and-place robotic arm is described as having \"3 Degrees of Freedom (3-DoF)\". What does \"Degree of Freedom\" refer to?",
    "options": [
      {
        "id": "opt_1",
        "text": "The number of independent axes or joints around which the arm can move or rotate"
      },
      {
        "id": "opt_2",
        "text": "How many hours the robot can operate without an internet connection"
      },
      {
        "id": "opt_3",
        "text": "The temperature range in Celsius the robot can tolerate"
      },
      {
        "id": "opt_4",
        "text": "The price discount given to college students"
      }
    ]
  },
  {
    "id": 205,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Basic Robotics & Quadrupeds)",
    "prompt": "Why do robotics engineers develop 4-legged quadruped robots (like Boston Dynamics’ Spot) instead of using traditional wheels for disaster response and industrial sites?",
    "options": [
      {
        "id": "opt_1",
        "text": "Legs allow the robot to step over rubble, navigate unstructured terrain, and climb stairs where wheels would get stuck"
      },
      {
        "id": "opt_2",
        "text": "Legged robots are cheaper to manufacture than plastic wheels"
      },
      {
        "id": "opt_3",
        "text": "Legged robots never require batteries"
      },
      {
        "id": "opt_4",
        "text": "Wheels are legally banned in disaster zones"
      }
    ]
  },
  {
    "id": 206,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "Which umbrella organization created by the Reserve Bank of India (RBI) and Indian Banks’ Association operates the Unified Payments Interface (UPI)?",
    "options": [
      {
        "id": "opt_1",
        "text": "National Payments Corporation of India (NPCI)"
      },
      {
        "id": "opt_2",
        "text": "NITI Aayog"
      },
      {
        "id": "opt_3",
        "text": "TRAI"
      },
      {
        "id": "opt_4",
        "text": "SEBI"
      }
    ]
  },
  {
    "id": 207,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is ONDC (Open Network for Digital Commerce) launched by the Government of India?",
    "options": [
      {
        "id": "opt_1",
        "text": "An open-protocol network designed to unbundle e-commerce, allowing local buyers and sellers to transact regardless of app platform"
      },
      {
        "id": "opt_2",
        "text": "A government-owned shopping website competing with Amazon"
      },
      {
        "id": "opt_3",
        "text": "A free food delivery app for university students"
      },
      {
        "id": "opt_4",
        "text": "A portal for filing income tax returns"
      }
    ]
  },
  {
    "id": 208,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What technology is used by FASTag to enable automatic toll payment deduction without stopping vehicles at highway toll plazas?",
    "options": [
      {
        "id": "opt_1",
        "text": "Radio Frequency Identification (RFID)"
      },
      {
        "id": "opt_2",
        "text": "Bluetooth Low Energy"
      },
      {
        "id": "opt_3",
        "text": "QR Code Barcode Scanner"
      },
      {
        "id": "opt_4",
        "text": "Satellite Laser Radar"
      }
    ]
  },
  {
    "id": 209,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is DigiLocker, an initiative under the Digital India program?",
    "options": [
      {
        "id": "opt_1",
        "text": "A secure cloud-based platform for issuance and verification of authentic digital documents and certificates recognized legally as originals"
      },
      {
        "id": "opt_2",
        "text": "A physical locker rented at national post offices"
      },
      {
        "id": "opt_3",
        "text": "A password manager app for Android"
      },
      {
        "id": "opt_4",
        "text": "A storage facility for computer server parts"
      }
    ]
  },
  {
    "id": 210,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is the India Stack in digital public infrastructure?",
    "options": [
      {
        "id": "opt_1",
        "text": "A set of open APIs (Aadhaar, e-KYC, e-Sign, DigiLocker, UPI) that enable presence-less, paperless, and cashless service delivery"
      },
      {
        "id": "opt_2",
        "text": "A stack of supercomputers installed in Bengaluru"
      },
      {
        "id": "opt_3",
        "text": "A skyscraper housing Indian IT startups"
      },
      {
        "id": "opt_4",
        "text": "A programming library for Indian languages"
      }
    ]
  },
  {
    "id": 211,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is BharatQR introduced by NPCI, Visa, and Mastercard?",
    "options": [
      {
        "id": "opt_1",
        "text": "A common, interoperable QR code payment specification that eliminates the need for merchants to display multiple QR stickers"
      },
      {
        "id": "opt_2",
        "text": "A national identification card for businesses"
      },
      {
        "id": "opt_3",
        "text": "A barcode scanner used in Indian ration shops"
      },
      {
        "id": "opt_4",
        "text": "A railway ticketing portal"
      }
    ]
  },
  {
    "id": 212,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is the purpose of the Indian Semiconductor Mission (ISM) launched by the Government of India?",
    "options": [
      {
        "id": "opt_1",
        "text": "To build a vibrant semiconductor design and fabrication ecosystem, reducing foreign reliance for microchips and electronics"
      },
      {
        "id": "opt_2",
        "text": "To build computers using wood rather than silicon"
      },
      {
        "id": "opt_3",
        "text": "To import older generation CRT monitors"
      },
      {
        "id": "opt_4",
        "text": "To replace computer chips with paper punch cards"
      }
    ]
  },
  {
    "id": 213,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is BHIM (Bharat Interface for Money)?",
    "options": [
      {
        "id": "opt_1",
        "text": "A mobile payment app developed by NPCI that allows simple, direct bank-to-bank payments using the Unified Payments Interface (UPI)"
      },
      {
        "id": "opt_2",
        "text": "A cryptocurrency exchange for trading Bitcoin in India"
      },
      {
        "id": "opt_3",
        "text": "An online loan application for college tuition"
      },
      {
        "id": "opt_4",
        "text": "A digital wallet that charges 10% fee per transaction"
      }
    ]
  },
  {
    "id": 214,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is the difference between 5G Non-Standalone (NSA) and 5G Standalone (SA) deployed in India?",
    "options": [
      {
        "id": "opt_1",
        "text": "5G SA uses a dedicated 5G core network end-to-end, while 5G NSA anchors 5G radio frequencies on top of existing 4G LTE core infrastructure"
      },
      {
        "id": "opt_2",
        "text": "5G SA only works when you are standing still"
      },
      {
        "id": "opt_3",
        "text": "5G NSA is free while 5G SA requires expensive subscriptions"
      },
      {
        "id": "opt_4",
        "text": "5G SA does not support smartphones"
      }
    ]
  },
  {
    "id": 215,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India)",
    "prompt": "What is the Bhashini initiative launched by the Ministry of Electronics and Information Technology (MeitY)?",
    "options": [
      {
        "id": "opt_1",
        "text": "An AI-powered national language translation mission to make digital services accessible across Indian languages using voice and text"
      },
      {
        "id": "opt_2",
        "text": "A government database of classical Indian literature"
      },
      {
        "id": "opt_3",
        "text": "A coding language written in Sanskrit"
      },
      {
        "id": "opt_4",
        "text": "A radio channel broadcasting college lectures"
      }
    ]
  },
  {
    "id": 216,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia & Culture)",
    "prompt": "Why are electronic junk emails and unsolicited advertising messages referred to as \"SPAM\"?",
    "options": [
      {
        "id": "opt_1",
        "text": "Named after a famous 1970 Monty Python comedy sketch where a restaurant menu repeated the canned meat \"Spam\" incessantly over all conversations"
      },
      {
        "id": "opt_2",
        "text": "Because SPAM is an acronym for System Programs And Memory"
      },
      {
        "id": "opt_3",
        "text": "Because the first spam email was sent by the Hormel meat company"
      },
      {
        "id": "opt_4",
        "text": "Because it stands for Super Powered Advertising Message"
      }
    ]
  },
  {
    "id": 217,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia & Culture)",
    "prompt": "What is \"Ray Tracing\" in modern computer graphics and gaming (RTX)?",
    "options": [
      {
        "id": "opt_1",
        "text": "An advanced rendering technique that simulates the physical path and bounces of optical light rays to create realistic reflections, shadows, and refractions"
      },
      {
        "id": "opt_2",
        "text": "A tool used to trace lines on physical circuit boards"
      },
      {
        "id": "opt_3",
        "text": "An algorithm that speeds up character running animations"
      },
      {
        "id": "opt_4",
        "text": "A method of connecting two gaming mice together"
      }
    ]
  },
  {
    "id": 218,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia & Culture)",
    "prompt": "What is the mascot of the Linux operating system?",
    "options": [
      {
        "id": "opt_1",
        "text": "Tux the Penguin"
      },
      {
        "id": "opt_2",
        "text": "Octocat"
      },
      {
        "id": "opt_3",
        "text": "Duke the Java Mascot"
      },
      {
        "id": "opt_4",
        "text": "Bugdroid"
      }
    ]
  },
  {
    "id": 219,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia & Culture)",
    "prompt": "What is GitHub’s famous mascot called?",
    "options": [
      {
        "id": "opt_1",
        "text": "Mona the Octocat (a creature that is part cat, part octopus)"
      },
      {
        "id": "opt_2",
        "text": "Clippy the Paperclip"
      },
      {
        "id": "opt_3",
        "text": "Gopher the Mascot"
      },
      {
        "id": "opt_4",
        "text": "Byte the Dog"
      }
    ]
  },
  {
    "id": 220,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia & Culture)",
    "prompt": "Why were early Android operating system releases (from Android 1.5 to Android 9) named after sweet confectionery desserts in alphabetical order (Cupcake, Donut, Eclair, Froyo, Gingerbread, Honeycomb, Ice Cream Sandwich, Jelly Bean, KitKat, Lollipop, Marshmallow, Nougat, Oreo, Pie)?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because the team wanted to sweeten up mobile developers’ lives and create fun, memorable internal release milestones"
      },
      {
        "id": "opt_2",
        "text": "Because Google owned bakeries across California"
      },
      {
        "id": "opt_3",
        "text": "Because the programmers were only allowed to eat candy during builds"
      },
      {
        "id": "opt_4",
        "text": "Because of a legal agreement with confectionery brands"
      }
    ]
  },
  {
    "id": 221,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Club Philosophy)",
    "prompt": "What does the official Zairza motto \"Wonder • Think • Create\" mean to you as an engineer at OUTR?",
    "options": [
      {
        "id": "opt_1",
        "text": "Cultivating genuine curiosity (Wonder), applying first-principles logic to analyze problems (Think), and building impactful real-world systems (Create)"
      },
      {
        "id": "opt_2",
        "text": "Memorizing theoretical textbook formulas to secure high exam marks"
      },
      {
        "id": "opt_3",
        "text": "Waiting for seniors to assign step-by-step tasks without taking initiative"
      },
      {
        "id": "opt_4",
        "text": "Just a catchy marketing slogan for social media posts"
      }
    ]
  },
  {
    "id": 222,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Hackathon Dynamics)",
    "prompt": "It is 2:00 AM during an intense 24-hour hackathon. Your team’s database connection crashes and a teammate is panicking. What is your immediate course of action?",
    "options": [
      {
        "id": "opt_1",
        "text": "Stay calm, brew a cup of coffee, pair up with the teammate to systematically trace the error logs, isolate the failing module, and divide remaining tasks"
      },
      {
        "id": "opt_2",
        "text": "Publicly berate the teammate for breaking the codebase and demand they fix it alone"
      },
      {
        "id": "opt_3",
        "text": "Abandon the hackathon and go to sleep in the hostel without telling anyone"
      },
      {
        "id": "opt_4",
        "text": "Pretend nothing is broken and hope the judges do not test database functionality"
      }
    ]
  },
  {
    "id": 223,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Receiving Feedback)",
    "prompt": "During a club design review, a senior mentor points out serious security flaws and structural inefficiencies in your newly built web API or circuit schematic. How do you respond?",
    "options": [
      {
        "id": "opt_1",
        "text": "Listen actively without being defensive, ask targeted technical questions to understand best engineering practices, and iterate constructively on the design"
      },
      {
        "id": "opt_2",
        "text": "Take it as a personal attack, argue aggressively without data, and stop showing up to the lab"
      },
      {
        "id": "opt_3",
        "text": "Verbally agree in the meeting but silently ignore all the feedback and submit the old version anyway"
      },
      {
        "id": "opt_4",
        "text": "Complain to your classmates that the mentor is biased against your branch"
      }
    ]
  },
  {
    "id": 224,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Academic Balance)",
    "prompt": "With mid-semester examinations approaching in two weeks and an ambitious club robotics build underway, how do you manage your time effectively?",
    "options": [
      {
        "id": "opt_1",
        "text": "Plan ahead by time-blocking focused study sessions daily, communicate milestone availability early to project leads, and work efficiently without last-minute cramming"
      },
      {
        "id": "opt_2",
        "text": "Bunk all academic lectures to stay in the club room 24/7"
      },
      {
        "id": "opt_3",
        "text": "Ghost the club project entirely without informing teammates until after exams finish"
      },
      {
        "id": "opt_4",
        "text": "Ignore both studies and club tasks until the night before the exam"
      }
    ]
  },
  {
    "id": 225,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Inclusivity & Mentorship)",
    "prompt": "A 1st-year student from a non-CS branch (such as Civil, Textile, or Mechanical) joins your club workshop and feels intimidated because they have never written code before. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Encourage them warmly, explain fundamental concepts using relatable real-world analogies, pair up with them, and reassure them that curiosity matters far more than prior experience"
      },
      {
        "id": "opt_2",
        "text": "Tell them that non-CS students cannot build software and advise them to quit"
      },
      {
        "id": "opt_3",
        "text": "Laugh at their basic questions in front of the workshop room"
      },
      {
        "id": "opt_4",
        "text": "Do their entire assignment for them so they do not learn anything"
      }
    ]
  },
  {
    "id": 226,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Integrity & Ethics)",
    "prompt": "Ten minutes before submitting an ideathon project, you realize a teammate pasted a complex open-source algorithm into your repo without including the original author’s license attribution. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Immediately add proper open-source license attribution and comments citing the original author, ensuring ethical transparency and academic compliance"
      },
      {
        "id": "opt_2",
        "text": "Delete the comments and disguise the variable names to pretend your team invented it from scratch"
      },
      {
        "id": "opt_3",
        "text": "Blame the teammate to the judges if caught"
      },
      {
        "id": "opt_4",
        "text": "Ignore it because nobody reads open-source licenses anyway"
      }
    ]
  },
  {
    "id": 227,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Team Disagreements)",
    "prompt": "Your project team is split 50/50 between two different hardware sensor modules. After a thorough technical comparison, the team votes to adopt the alternate sensor over your personal preference. What is your attitude?",
    "options": [
      {
        "id": "opt_1",
        "text": "Practice \"Disagree and Commit\": respect the collective decision, align with the team, and contribute 100% of your energy to make the chosen design successful"
      },
      {
        "id": "opt_2",
        "text": "Actively sabotage the chosen sensor during tests so the team is forced to use your option"
      },
      {
        "id": "opt_3",
        "text": "Refuse to work on the hardware module and sulk in team meetings"
      },
      {
        "id": "opt_4",
        "text": "Continuously remind the team at every minor glitch that they should have picked your idea"
      }
    ]
  },
  {
    "id": 228,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Cross-Wing Synergy)",
    "prompt": "Why does Zairza emphasize the deep synergy between its three wings: Software, Hardware (Robotics & IoT), and Design?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because cutting-edge real-world products require intuitive interfaces (Design), intelligent algorithms (Software), and physical sensors/actuators (Hardware) working harmoniously"
      },
      {
        "id": "opt_2",
        "text": "It does not; each wing should work in total isolation without talking to others"
      },
      {
        "id": "opt_3",
        "text": "Only the software wing produces valuable work"
      },
      {
        "id": "opt_4",
        "text": "Just to inflate club enrollment numbers"
      }
    ]
  },
  {
    "id": 229,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Failure & Resilience)",
    "prompt": "You spent three weeks building an autonomous obstacle-avoidance drone for a tech fest, but during the final arena run, a sudden motor glitch causes it to crash. How do you handle the setback?",
    "options": [
      {
        "id": "opt_1",
        "text": "Analyze the telemetry flight logs and hardware damage calmly, identify the root cause, document lessons learned, and rebuild a more resilient system for the next event"
      },
      {
        "id": "opt_2",
        "text": "Kick the broken drone in anger and blame the event organizers for bad arena lighting"
      },
      {
        "id": "opt_3",
        "text": "Quit robotics permanently and post complaints on social media"
      },
      {
        "id": "opt_4",
        "text": "Hide the damaged parts in the club closet and pretend the crash never occurred"
      }
    ]
  },
  {
    "id": 230,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Ownership & Proactivity)",
    "prompt": "While working in the club lab, you notice a messy soldering station with unattended hot irons and tangled jumper wires left behind by an earlier group. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Turn off the hot soldering iron immediately for laboratory safety, neatly organize the workspace, and gently remind members to maintain lab cleanliness"
      },
      {
        "id": "opt_2",
        "text": "Leave it hot because you were not the one who used it"
      },
      {
        "id": "opt_3",
        "text": "Take photos and post sarcastic comments in the general club chat"
      },
      {
        "id": "opt_4",
        "text": "Throw all the expensive tools into the trash"
      }
    ]
  },
  {
    "id": 231,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Continuous Learning)",
    "prompt": "A new programming framework or hardware microcontroller emerges that nobody in the club has used before. How do you approach it?",
    "options": [
      {
        "id": "opt_1",
        "text": "Dive into official documentation, build a small weekend prototype to test its capabilities, and document findings to share in a club knowledge-sharing session"
      },
      {
        "id": "opt_2",
        "text": "Wait until it is taught in university semester curriculum five years later"
      },
      {
        "id": "opt_3",
        "text": "Dismiss it as useless without investigating its technical trade-offs"
      },
      {
        "id": "opt_4",
        "text": "Pretend to be an expert without ever installing it"
      }
    ]
  },
  {
    "id": 232,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Handling Pressure)",
    "prompt": "Your team has promised a functioning club portal demonstration to faculty patrons tomorrow, but a major API integration bug emerges at 8:00 PM. How do you proceed?",
    "options": [
      {
        "id": "opt_1",
        "text": "Communicate transparently with project leads, assess the critical user paths, implement a reliable defensive fallback for the demo, and focus on stability over non-essential features"
      },
      {
        "id": "opt_2",
        "text": "Cancel the meeting with faculty without explanation"
      },
      {
        "id": "opt_3",
        "text": "Panic and push untested random code changes directly to production"
      },
      {
        "id": "opt_4",
        "text": "Blame your team members during the live faculty presentation"
      }
    ]
  },
  {
    "id": 233,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Active Listening)",
    "prompt": "During an ideathon brainstorming session, a quieter 1st-year teammate attempts to suggest an innovative project idea but is repeatedly talked over by louder members. What is your reaction?",
    "options": [
      {
        "id": "opt_1",
        "text": "Politely pause the conversation, invite the teammate to share their idea fully, listen attentively, and build constructively on their suggestion"
      },
      {
        "id": "opt_2",
        "text": "Join in talking over them because louder voices must have better ideas"
      },
      {
        "id": "opt_3",
        "text": "Ignore the discussion and scroll through your phone"
      },
      {
        "id": "opt_4",
        "text": "Tell the quiet teammate that freshers should only listen"
      }
    ]
  },
  {
    "id": 234,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Accountability)",
    "prompt": "You accidentally apply reverse polarity to an expensive club microcontroller board and smell burnt silicon. What is your immediate response?",
    "options": [
      {
        "id": "opt_1",
        "text": "Disconnect the power immediately, inform club mentors honestly about the mistake, analyze why it happened, and learn how to implement reverse-polarity protection diodes next time"
      },
      {
        "id": "opt_2",
        "text": "Quickly put the fried board back into the storage drawer and pretend someone else broke it"
      },
      {
        "id": "opt_3",
        "text": "Blame the manufacturer for bad quality"
      },
      {
        "id": "opt_4",
        "text": "Deny ever entering the lab that afternoon"
      }
    ]
  },
  {
    "id": 235,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Knowledge Sharing)",
    "prompt": "You spend three days solving a very obscure bug in an embedded Linux kernel build. What is the most beneficial next step for the club?",
    "options": [
      {
        "id": "opt_1",
        "text": "Write a clear, concise technical note or blog post documenting the root cause and solution in the club knowledge base for future juniors"
      },
      {
        "id": "opt_2",
        "text": "Keep the solution a secret so other students will always need to ask you for help"
      },
      {
        "id": "opt_3",
        "text": "Delete your bash history so nobody can copy your commands"
      },
      {
        "id": "opt_4",
        "text": "Forget about it immediately after it works"
      }
    ]
  },
  {
    "id": 236,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Collaboration)",
    "prompt": "You are tasked with leading a 4-person induction project. How do you delegate work among your team members?",
    "options": [
      {
        "id": "opt_1",
        "text": "Assess each member’s strengths, interests, and learning goals, define clear modular milestones, and hold short daily sync-ups to unblock challenges collaboratively"
      },
      {
        "id": "opt_2",
        "text": "Do all the work yourself because you do not trust anyone else"
      },
      {
        "id": "opt_3",
        "text": "Assign all difficult tasks to others while taking credit for the entire project"
      },
      {
        "id": "opt_4",
        "text": "Tell everyone to do whatever they want with zero milestones or communication"
      }
    ]
  },
  {
    "id": 237,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Conflict Resolution)",
    "prompt": "Two teammates in your hackathon group have a heated argument over whether to use PostgreSQL or MongoDB for the application database. How do you resolve the deadlock?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ground the debate in technical data: list the project’s specific schema requirements, query patterns, and time constraints to pick the most pragmatic solution objectively"
      },
      {
        "id": "opt_2",
        "text": "Encourage them to settle it with a physical arm-wrestling contest"
      },
      {
        "id": "opt_3",
        "text": "Let them argue indefinitely while the hackathon clock runs out"
      },
      {
        "id": "opt_4",
        "text": "Quit the team because conflict makes you uncomfortable"
      }
    ]
  },
  {
    "id": 238,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Resource Stewardship)",
    "prompt": "You notice that club robotics components (sensors, motors, jumper wires) frequently go missing or get tangled after project builds. What proactive initiative do you take?",
    "options": [
      {
        "id": "opt_1",
        "text": "Propose and help implement a simple digital component checkout inventory system with labeled component bins to keep equipment organized and accessible"
      },
      {
        "id": "opt_2",
        "text": "Complain privately without offering any constructive solution"
      },
      {
        "id": "opt_3",
        "text": "Take components to your personal hostel room so nobody else can use them"
      },
      {
        "id": "opt_4",
        "text": "Stop using club hardware altogether"
      }
    ]
  },
  {
    "id": 239,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Empathy in Code Reviews)",
    "prompt": "When reviewing a junior teammate’s first Git pull request, you find several coding formatting inconsistencies and inefficient nested loops. How do you write your review comments?",
    "options": [
      {
        "id": "opt_1",
        "text": "Write encouraging, polite comments explaining the rationale behind cleaner patterns, provide helpful code documentation links, and praise the aspects they implemented well"
      },
      {
        "id": "opt_2",
        "text": "Leave harsh comments like \"Who wrote this garbage? Delete this!\""
      },
      {
        "id": "opt_3",
        "text": "Silently reject the pull request without giving any explanation"
      },
      {
        "id": "opt_4",
        "text": "Merge the bad code without saying anything"
      }
    ]
  },
  {
    "id": 240,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Workplace Culture)",
    "prompt": "What type of workplace and club culture does Zairza strive to cultivate within the OUTR Bhubaneswar campus?",
    "options": [
      {
        "id": "opt_1",
        "text": "An open, meritocratic, collaborative culture where curiosity is celebrated, questions are welcomed, and people build bold technology together"
      },
      {
        "id": "opt_2",
        "text": "A rigid, hierarchical environment where juniors are afraid to speak to seniors"
      },
      {
        "id": "opt_3",
        "text": "A competitive zero-sum culture where students hoard information"
      },
      {
        "id": "opt_4",
        "text": "A casual club where no real projects are ever finished"
      }
    ]
  },
  {
    "id": 241,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Ambition & Vision)",
    "prompt": "Why do you want to be inducted into Zairza over other campus societies at OUTR?",
    "options": [
      {
        "id": "opt_1",
        "text": "To immerse myself in a culture of relentless builders, collaborate across hardware and software, and turn ambitious theoretical concepts into functional reality"
      },
      {
        "id": "opt_2",
        "text": "Just to have a certificate to put on a resume without doing any project work"
      },
      {
        "id": "opt_3",
        "text": "Because my friends told me there is free food at events"
      },
      {
        "id": "opt_4",
        "text": "Because I had free time on a weekday evening"
      }
    ]
  },
  {
    "id": 242,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Prioritization)",
    "prompt": "You have three competing deadlines tomorrow: a lab experiment write-up, a club design sprint, and a personal project. How do you prioritize your evening?",
    "options": [
      {
        "id": "opt_1",
        "text": "Evaluate the true deadlines, communicate expected completion windows with stakeholders, focus deeply on the highest-impact deliverable first, and eliminate digital distractions"
      },
      {
        "id": "opt_2",
        "text": "Procrastinate on social media for 5 hours while worrying about all three"
      },
      {
        "id": "opt_3",
        "text": "Submit incomplete work for all three without checking quality"
      },
      {
        "id": "opt_4",
        "text": "Turn off your phone and go to sleep"
      }
    ]
  },
  {
    "id": 243,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Feedback to Seniors)",
    "prompt": "During a team retrospective, seniors ask for candid feedback on how club workshop sessions could be improved. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Offer polite, thoughtful, and constructive suggestions backed by specific examples of what helped you learn most effectively"
      },
      {
        "id": "opt_2",
        "text": "Remain completely silent out of fear even though you had several good ideas"
      },
      {
        "id": "opt_3",
        "text": "Rude and aggressive insults without constructive alternatives"
      },
      {
        "id": "opt_4",
        "text": "Say everything was perfect when you actually struggled to follow"
      }
    ]
  },
  {
    "id": 244,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Celebrating Peers)",
    "prompt": "A peer in your induction cohort builds an outstanding IoT automation demo that wins first prize at a tech exhibit. What is your reaction?",
    "options": [
      {
        "id": "opt_1",
        "text": "Celebrate their victory genuinely, congratulate them warmly, and ask them to share how they overcame key technical hurdles so everyone can learn"
      },
      {
        "id": "opt_2",
        "text": "Feel jealous and spread rumors that they copied the project online"
      },
      {
        "id": "opt_3",
        "text": "Act indifferent and refuse to acknowledge their achievement"
      },
      {
        "id": "opt_4",
        "text": "Complain to the judges that your project was better"
      }
    ]
  },
  {
    "id": 245,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Unclear Requirements)",
    "prompt": "A club mentor asks your team to design a \"Smart Campus Energy Monitor\" without providing detailed written specifications. How do you start?",
    "options": [
      {
        "id": "opt_1",
        "text": "Schedule a brief discovery discussion with the mentor to clarify project goals, identify user needs, document assumptions, and propose an initial minimal viable architecture"
      },
      {
        "id": "opt_2",
        "text": "Do nothing and wait indefinitely for a 50-page specification document"
      },
      {
        "id": "opt_3",
        "text": "Build something completely unrelated and hope they like it"
      },
      {
        "id": "opt_4",
        "text": "Complain that the instructions were too vague to start"
      }
    ]
  },
  {
    "id": 246,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Community Engagement)",
    "prompt": "When Zairza hosts its flagship annual technical symposium or hackathon, how do you see your role as a junior inductee?",
    "options": [
      {
        "id": "opt_1",
        "text": "Actively volunteer, support logistics, assist visiting participants with enthusiasm, and showcase the best hospitality and engineering excellence of OUTR"
      },
      {
        "id": "opt_2",
        "text": "Sit in the corner and avoid all volunteer responsibilities"
      },
      {
        "id": "opt_3",
        "text": "Complain about having to wake up early for the event"
      },
      {
        "id": "opt_4",
        "text": "Leave the campus and ignore the symposium"
      }
    ]
  },
  {
    "id": 247,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Patience in Debugging)",
    "prompt": "You have been trying to fix a compiler segmentation fault or hardware signal jitter for four hours without success. How do you prevent frustration from taking over?",
    "options": [
      {
        "id": "opt_1",
        "text": "Step away for a 15-minute walk to clear your head, review your fundamental assumptions with fresh eyes, rubber-duck the problem aloud, or ask a peer for a fresh perspective"
      },
      {
        "id": "opt_2",
        "text": "Smash the keyboard or kick the lab bench in frustration"
      },
      {
        "id": "opt_3",
        "text": "Delete the entire project repository permanently"
      },
      {
        "id": "opt_4",
        "text": "Give up on engineering and declare that computers are broken"
      }
    ]
  },
  {
    "id": 248,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Curiosity Beyond Branch)",
    "prompt": "You are enrolled in Electrical Engineering, but a club workshop on 3D Blender modeling and UI/UX design is scheduled this weekend. What is your perspective?",
    "options": [
      {
        "id": "opt_1",
        "text": "Attend with an open mind, because understanding user experience and physical product aesthetic makes you a far more versatile and well-rounded engineer"
      },
      {
        "id": "opt_2",
        "text": "Refuse to attend because electrical engineers should only look at wires"
      },
      {
        "id": "opt_3",
        "text": "Attend only to distract other attendees"
      },
      {
        "id": "opt_4",
        "text": "Dismiss design as irrelevant to engineering"
      }
    ]
  },
  {
    "id": 249,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Self-Care & Burnout)",
    "prompt": "After three continuous days of intense hacking, you feel physically exhausted and mentally depleted. What is the responsible choice for both you and your team?",
    "options": [
      {
        "id": "opt_1",
        "text": "Get a full night of restorative sleep, hydrate, and return with renewed cognitive focus, recognizing that burnout degrades code quality and health"
      },
      {
        "id": "opt_2",
        "text": "Drink six energy drinks and push through until you collapse during the presentation"
      },
      {
        "id": "opt_3",
        "text": "Pretend you are fine while making catastrophic coding errors"
      },
      {
        "id": "opt_4",
        "text": "Quit the team abruptly due to exhaustion"
      }
    ]
  },
  {
    "id": 250,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Respecting Diversity)",
    "prompt": "Your project team includes students from diverse cultural backgrounds, mother tongues, and technical preparation levels. How do you build team cohesion?",
    "options": [
      {
        "id": "opt_1",
        "text": "Foster an inclusive environment where everyone communicates respectfully, values different perspectives, and supports each other’s unique strengths"
      },
      {
        "id": "opt_2",
        "text": "Form exclusionary cliques and only talk in your local dialect"
      },
      {
        "id": "opt_3",
        "text": "Make insensitive jokes about people from different regions"
      },
      {
        "id": "opt_4",
        "text": "Refuse to collaborate with people outside your branch"
      }
    ]
  },
  {
    "id": 251,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Long-Term Commitment)",
    "prompt": "Being a part of Zairza is a multi-year journey of learning, building, and eventually mentoring the next generation of freshers. Are you prepared for this commitment?",
    "options": [
      {
        "id": "opt_1",
        "text": "Yes, I am excited to learn diligently now, contribute to ambitious society builds, and give back by mentoring incoming freshers in future years"
      },
      {
        "id": "opt_2",
        "text": "No, I only want to stay for one month until I get a certificate"
      },
      {
        "id": "opt_3",
        "text": "I will disappear whenever real project work is assigned"
      },
      {
        "id": "opt_4",
        "text": "I am only joining because my parents asked me to"
      }
    ]
  },
  {
    "id": 252,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Handling Praise)",
    "prompt": "Following a successful project demonstration, faculty and guests shower your team with praise and awards. How do you carry yourself?",
    "options": [
      {
        "id": "opt_1",
        "text": "Stay humble, acknowledge every teammate’s individual contribution, thank mentors for their guidance, and stay focused on building even greater things"
      },
      {
        "id": "opt_2",
        "text": "Brag arrogantly to everyone on campus that you did it all by yourself"
      },
      {
        "id": "opt_3",
        "text": "Belittle other teams whose projects did not win awards"
      },
      {
        "id": "opt_4",
        "text": "Stop attending workshops because you think you know everything"
      }
    ]
  },
  {
    "id": 253,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Documentation Mindset)",
    "prompt": "Why does Zairza require all induction projects to have clean README documentation, architecture diagrams, and installation guides?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because undocumented code is unusable code; clear documentation ensures projects can be audited, maintained, and expanded by future students"
      },
      {
        "id": "opt_2",
        "text": "Just to make students waste time typing text"
      },
      {
        "id": "opt_3",
        "text": "Because faculty only read English and never run software"
      },
      {
        "id": "opt_4",
        "text": "To make the project repository look heavier in megabytes"
      }
    ]
  },
  {
    "id": 254,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Resourcefulness)",
    "prompt": "When building a prototype on a limited student budget, a required custom sensor bracket is not available locally. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Use rapid prototyping: design a 3D model in CAD and 3D print it in the club lab, or laser-cut an acrylic prototype creatively"
      },
      {
        "id": "opt_2",
        "text": "Cancel the entire project immediately"
      },
      {
        "id": "opt_3",
        "text": "Demand that the club buy a Rs. 50,000 industrial machine for a single bracket"
      },
      {
        "id": "opt_4",
        "text": "Wait for two months for an imported part to arrive"
      }
    ]
  },
  {
    "id": 255,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Humility in Learning)",
    "prompt": "A 1st-year classmate who learned to code in school points out an edge case bug in a script you wrote. What is your reaction?",
    "options": [
      {
        "id": "opt_1",
        "text": "Thank them sincerely for catching the bug, review the edge case together, and update the test suite to prevent regressions"
      },
      {
        "id": "opt_2",
        "text": "Argue that because you are older or have higher marks, your code cannot have bugs"
      },
      {
        "id": "opt_3",
        "text": "Silently revert their fix because your pride is hurt"
      },
      {
        "id": "opt_4",
        "text": "Ignore the bug until it crashes in production"
      }
    ]
  },
  {
    "id": 256,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Mentoring Juniors)",
    "prompt": "When you become a senior in your 2nd and 3rd year, how do you plan to support incoming freshers who enter the club?",
    "options": [
      {
        "id": "opt_1",
        "text": "Be approachable, conduct hands-on beginner-friendly bootcamps, provide patient code reviews, and inspire them to build without fear of failure"
      },
      {
        "id": "opt_2",
        "text": "Intimidate them to prove how smart I am"
      },
      {
        "id": "opt_3",
        "text": "Ignore them and let them figure everything out alone"
      },
      {
        "id": "opt_4",
        "text": "Assign them menial personal chores outside club scope"
      }
    ]
  },
  {
    "id": 257,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Constructive Disagreement)",
    "prompt": "You strongly believe a project should be built using TypeScript instead of plain JavaScript for type safety, while your teammate prefers plain JS. How do you discuss it?",
    "options": [
      {
        "id": "opt_1",
        "text": "Present a clear comparison highlighting developer velocity vs bug-catch trade-offs, offer to write the initial type definitions, and agree on a consensus that serves the project timeline"
      },
      {
        "id": "opt_2",
        "text": "Refuse to write a single line of code unless your way is chosen"
      },
      {
        "id": "opt_3",
        "text": "Insult your teammate for not knowing TypeScript"
      },
      {
        "id": "opt_4",
        "text": "Silently rename all files without telling the team"
      }
    ]
  },
  {
    "id": 258,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Grace Under Failure)",
    "prompt": "Your team submits a proposal for an external national innovation grant, but the application is rejected in the first round. What is your takeaway?",
    "options": [
      {
        "id": "opt_1",
        "text": "Request feedback if possible, analyze the winning proposals to identify gaps in your pitch or prototype validation, and refine the idea for the next opportunity"
      },
      {
        "id": "opt_2",
        "text": "Assume the competition was rigged and give up on grant applications"
      },
      {
        "id": "opt_3",
        "text": "Blame your college faculty for the rejection"
      },
      {
        "id": "opt_4",
        "text": "Delete all project files in frustration"
      }
    ]
  },
  {
    "id": 259,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (Safety in Hardware Labs)",
    "prompt": "Before powering on a high-voltage motor driver or custom lithium-polymer (LiPo) battery pack, what protocol do you strictly follow?",
    "options": [
      {
        "id": "opt_1",
        "text": "Double-check polarity and wiring with a digital multimeter, ensure proper fuse ratings, keep a fire-safe LiPo bag nearby, and verify with a lab lead"
      },
      {
        "id": "opt_2",
        "text": "Plug it directly into the wall outlet and hope for the best"
      },
      {
        "id": "opt_3",
        "text": "Touch the exposed copper terminals with your fingers to see if it feels warm"
      },
      {
        "id": "opt_4",
        "text": "Turn on all switches at maximum current simultaneously"
      }
    ]
  },
  {
    "id": 260,
    "section": "hr",
    "sectionTitle": "Part 3: Coffee Test & Cultural Alignment (The Zairza Spirit)",
    "prompt": "Ultimately, what makes someone a true \"Zairzite\" at OUTR?",
    "options": [
      {
        "id": "opt_1",
        "text": "An unquenchable thirst for learning, a collaborative heart, the courage to tackle hard technical challenges, and a commitment to creating real impact"
      },
      {
        "id": "opt_2",
        "text": "Having the most expensive laptop in the classroom"
      },
      {
        "id": "opt_3",
        "text": "Bragging on LinkedIn about events never attended"
      },
      {
        "id": "opt_4",
        "text": "Memorizing definitions without building anything"
      }
    ]
  }
];

export const QUIZ_ANSWER_KEYS = {
  "1": {
    "correctOptionId": "opt_3",
    "explanation": "These are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime is 17, and 17^2 = 289."
  },
  "2": {
    "correctOptionId": "opt_2",
    "explanation": "Pattern alternates: +5, -2, +5, -2, +5, -2. So 12 + 5 = 17."
  },
  "3": {
    "correctOptionId": "opt_2",
    "explanation": "Pattern is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8=56."
  },
  "4": {
    "correctOptionId": "opt_1",
    "explanation": "Pattern is n^3 - 1: 1^3-1=0, 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1=342."
  },
  "5": {
    "correctOptionId": "opt_2",
    "explanation": "Fibonacci sequence where each term is the sum of the two preceding terms: 13 + 21 = 34."
  },
  "6": {
    "correctOptionId": "opt_3",
    "explanation": "Pattern is x * 2 + 1: 5*2+1=11, 11*2+1=23, 23*2+1=47, 47*2+1=95, 95*2+1=191."
  },
  "7": {
    "correctOptionId": "opt_1",
    "explanation": "Consecutive prime numbers. The prime immediately following 17 is 19."
  },
  "8": {
    "correctOptionId": "opt_1",
    "explanation": "Differences are doubling powers of 2 subtracted each step: -4, -8, -16, -32, -64. 40 - 64 = -24."
  },
  "9": {
    "correctOptionId": "opt_2",
    "explanation": "Pattern is n^n: 1^1=1, 2^2=4, 3^3=27, 4^4=256, 5^5=3125."
  },
  "10": {
    "correctOptionId": "opt_2",
    "explanation": "Differences are powers of 3 times 4 (4, 12, 36, 108, 324). 170 + 324 = 494."
  },
  "11": {
    "correctOptionId": "opt_2",
    "explanation": "Each term is multiplied by 1.5 (3/2): 40.5 * 1.5 = 60.75."
  },
  "12": {
    "correctOptionId": "opt_1",
    "explanation": "Pattern is x * 2 + 1, x * 2 + 2, x * 2 + 3... 122 * 2 + 5 = 249."
  },
  "13": {
    "correctOptionId": "opt_2",
    "explanation": "Alternating squares and cubes: 1^2, 2^3, 3^2, 4^3, 5^2, 6^3, 7^2 = 49."
  },
  "14": {
    "correctOptionId": "opt_2",
    "explanation": "Pattern is n^2 + 1: 8^2 + 1 = 65."
  },
  "15": {
    "correctOptionId": "opt_2",
    "explanation": "Multiplication factors increase by 0.5: *0.5, *1, *1.5, *2, *2.5. 120 * 2.5 = 300."
  },
  "16": {
    "correctOptionId": "opt_2",
    "explanation": "Each letter advances by +3 positions: B(2)->E(5)->H(8)->K(11)->N(14)->Q(17)."
  },
  "17": {
    "correctOptionId": "opt_1",
    "explanation": "Subtractions increase by 1: -3, -4, -5, -6. N(14) - 6 = H(8)."
  },
  "18": {
    "correctOptionId": "opt_1",
    "explanation": "Pairs of opposite letters from start and end of the English alphabet: E pairs with V."
  },
  "19": {
    "correctOptionId": "opt_2",
    "explanation": "Increments increase by 1: +2, +3, +4, +5, +6. O(15) + 6 = U(21)."
  },
  "20": {
    "correctOptionId": "opt_2",
    "explanation": "First letter +1 (J,K,L,M->N), middle letter +1 (A,B,C,D->E), third letter +1 (K,L,M,N->O). Result is NEO."
  },
  "21": {
    "correctOptionId": "opt_1",
    "explanation": "Letters: Z(-2)->X(-2)->V(-2)->T(-2)->R. Numbers: factorial 1, 2, 6, 24, 120. Ending letter: A->B->C->D->E. Result is R120E."
  },
  "22": {
    "correctOptionId": "opt_2",
    "explanation": "Multiples of 3 in the alphabet: R(18) + 3 = U(21)."
  },
  "23": {
    "correctOptionId": "opt_1",
    "explanation": "Each pair has a gap of 2 letters (D-F), and between pairs is +1 step. RT -> +1 is U, and +2 is X, yielding UX."
  },
  "24": {
    "correctOptionId": "opt_1",
    "explanation": "First letter decreases by 2: Y, W, U, S, Q. Second letter increases by 2: B, D, F, H, J. Result is QJ."
  },
  "25": {
    "correctOptionId": "opt_1",
    "explanation": "Letters shift by +2 (H->J, J->L), number increases by +2 (8->10). Result is J10L."
  },
  "26": {
    "correctOptionId": "opt_1",
    "explanation": "Letters shifted: Z(+1)->A, A(+2)->C, I(+2)->K, R(+2)->T, Z(+2)->B, A(+2)->C. Following the pattern for INDUCT gives KPFWEV."
  },
  "27": {
    "correctOptionId": "opt_1",
    "explanation": "First two letters are shifted forward by +2, remaining letters stay unchanged: D(+2)->F, R(+2)->T, ONE -> FTQPG."
  },
  "28": {
    "correctOptionId": "opt_1",
    "explanation": "Word is split in two halves and letters are inverted in each half: FRAC -> CARF, TION -> NOIT. CARFNOIT."
  },
  "29": {
    "correctOptionId": "opt_1",
    "explanation": "Sum of letter positions: P(16) + I(9) + G(7) = 32."
  },
  "30": {
    "correctOptionId": "opt_1",
    "explanation": "Each letter is shifted forward by +2: F(+2)->H, I(+2)->K, R(+2)->T, E(+2)->G. Result is HKTG."
  },
  "31": {
    "correctOptionId": "opt_2",
    "explanation": "Each letter is shifted backward by -1: S->R, O->N, U->T, N->M, D->C => RNTMC."
  },
  "32": {
    "correctOptionId": "opt_1",
    "explanation": "Direct alphabetic index substitution: V=22, E=5, N=14, U=21, S=19."
  },
  "33": {
    "correctOptionId": "opt_1",
    "explanation": "Letters shifted by +2: R(+2)->T, A(+2)->C, I(+2)->P, N(+2)->K => TCPK."
  },
  "34": {
    "correctOptionId": "opt_1",
    "explanation": "Each letter is shifted by +2: A->C, P->R, P->R, L->N, E->G => CRRNG."
  },
  "35": {
    "correctOptionId": "opt_1",
    "explanation": "'3' is in both 'hot filtered coffee' and 'very hot day', so 3 = hot. '5' is in 'day and night' and 'very hot day', so 5 = day. Hence '6' stands for 'very'."
  },
  "36": {
    "correctOptionId": "opt_2",
    "explanation": "Only son of Suresh's mother is Suresh himself. Therefore, the boy is Suresh's son, making Suresh the Father."
  },
  "37": {
    "correctOptionId": "opt_3",
    "explanation": "A is daughter of C, and C is daughter of D. Hence, A is the granddaughter of D."
  },
  "38": {
    "correctOptionId": "opt_2",
    "explanation": "The only daughter of Vipin's mother-in-law is Vipin's wife. The girl's mother is Vipin's wife, so Vipin is her Father."
  },
  "39": {
    "correctOptionId": "opt_4",
    "explanation": "The gender of Q is not explicitly mentioned (Q could be daughter or son). Hence, 'Q is T’s son' cannot be definitely asserted."
  },
  "40": {
    "correctOptionId": "opt_1",
    "explanation": "'My father's son' with no siblings means the speaker himself. So 'that man's father is me', meaning the portrait is of his son."
  },
  "41": {
    "correctOptionId": "opt_1",
    "explanation": "A / C means A is sister of C (female). C * B means C is son of B. Therefore, A is the daughter of B."
  },
  "42": {
    "correctOptionId": "opt_1",
    "explanation": "Ananya's brother's only sister is Ananya herself. Her son's father is her Husband."
  },
  "43": {
    "correctOptionId": "opt_3",
    "explanation": "K is the child of F, but K's gender is unspecified. Thus, K is either Son or Daughter."
  },
  "44": {
    "correctOptionId": "opt_3",
    "explanation": "Brother of her mother is her maternal uncle. The son of her uncle is her Cousin."
  },
  "45": {
    "correctOptionId": "opt_2",
    "explanation": "B and R are both children of Q (R daughter, B son). M is sister of B, so M is also daughter of Q. Therefore, R is the Sister of M."
  },
  "46": {
    "correctOptionId": "opt_2",
    "explanation": "Horizontal displacement = sqrt(12^2 + 5^2) = 13m. Total 3D displacement = sqrt(13^2 + 13^2) = 13*sqrt(2) approx 18.38m."
  },
  "47": {
    "correctOptionId": "opt_2",
    "explanation": "North-South: +20 - 35 = -15m (South). East-West: +30 + 15 = +45m (East). Position is South-East."
  },
  "48": {
    "correctOptionId": "opt_4",
    "explanation": "At sunrise, the sun is in the East, so shadows fall toward the West. If West is to his right, Amit is facing South."
  },
  "49": {
    "correctOptionId": "opt_2",
    "explanation": "Flying South then left (East) then left (North) cancels vertical travel: remaining displacement is 20 km East."
  },
  "50": {
    "correctOptionId": "opt_2",
    "explanation": "The compass is rotated by 135 degrees counter-clockwise. West rotated 135 degrees counter-clockwise becomes South-East."
  },
  "51": {
    "correctOptionId": "opt_2",
    "explanation": "North-South: 10 - 6 = 4 km North. East: 3 km. Distance = sqrt(4^2 + 3^2) = 5 km North-East."
  },
  "52": {
    "correctOptionId": "opt_2",
    "explanation": "In the evening, sun is in the West, so shadows fall toward the East. Since Mohit’s shadow is to his right, Mohit is facing North. Therefore, Sumit (facing Mohit) is facing South."
  },
  "53": {
    "correctOptionId": "opt_1",
    "explanation": "East-West positions: -15 + 15 = 0. North-South positions: -20 - 12 = -32m. He is 32m directly South of X."
  },
  "54": {
    "correctOptionId": "opt_2",
    "explanation": "Shortest displacement = sqrt(8^2 + 6^2) = sqrt(64 + 36) = sqrt(100) = 10 km."
  },
  "55": {
    "correctOptionId": "opt_2",
    "explanation": "Normally at 6 PM the hour hand points South. Since it points North, the clock is rotated 180 degrees. At 9:15, the minute hand normally points East (at 3). Rotated 180 degrees, it points West."
  },
  "56": {
    "correctOptionId": "opt_2",
    "explanation": "Angle = |30*H - 5.5*M| = |30(3) - 5.5(15)| = |90 - 82.5| = 7.5 degrees."
  },
  "57": {
    "correctOptionId": "opt_2",
    "explanation": "Angle = |30(8) - 5.5(20)| = |240 - 110| = 130 degrees."
  },
  "58": {
    "correctOptionId": "opt_2",
    "explanation": "The hands coincide 11 times in every 12 hours (due to the 11-1 overlap), which totals 22 times in 24 hours."
  },
  "59": {
    "correctOptionId": "opt_2",
    "explanation": "2024 is a leap year (366 days = 52 weeks + 2 odd days). Adding 2 days to Monday gives Wednesday."
  },
  "60": {
    "correctOptionId": "opt_1",
    "explanation": "From 7 AM to 1 PM is 6 hours = 360 minutes. 360 / 3 = 120 intervals. 120 * 5s = 600s = 10 minutes. The clock displays 1:10 PM."
  },
  "61": {
    "correctOptionId": "opt_2",
    "explanation": "61 divided by 7 leaves a remainder of 5 odd days. Friday + 5 days = Wednesday."
  },
  "62": {
    "correctOptionId": "opt_1",
    "explanation": "Time = (30 * H) / (11/2) = (30 * 4) / 5.5 = 120 / (11/2) = 240/11 = 21 9/11 minutes past 4."
  },
  "63": {
    "correctOptionId": "opt_3",
    "explanation": "Century years must be divisible by 400 to be leap years. 1900 is divisible by 4 and 100, but not by 400."
  },
  "64": {
    "correctOptionId": "opt_3",
    "explanation": "Hands are at right angles twice an hour, but only 4 times between 2-4 and 8-10. This totals 22 times in 12 hours, or 44 times in 24 hours."
  },
  "65": {
    "correctOptionId": "opt_4",
    "explanation": "Non-leap year following a non-leap year repeats after 11 years (when sum of odd days equals a multiple of 7): 2007 + 11 = 2018."
  },
  "66": {
    "correctOptionId": "opt_4",
    "explanation": "Since all algorithms belong inside logic, and logic has zero intersection with emotional, no algorithm is emotional (I). Also, some logic are algorithms (II). Both follow."
  },
  "67": {
    "correctOptionId": "opt_3",
    "explanation": "Between sensors and radars there is no definite link, but they form a complementary pair (Some + No). Hence, either I or II must follow."
  },
  "68": {
    "correctOptionId": "opt_1",
    "explanation": "Universal positive transitive logic: Laptops subset Computers subset Electronic implies All laptops are electronic. The converse is invalid."
  },
  "69": {
    "correctOptionId": "opt_3",
    "explanation": "Two negative premises yield no definite categorical conclusion."
  },
  "70": {
    "correctOptionId": "opt_2",
    "explanation": "From \"Some machines are fast\", conversion directly yields \"Some fast items are machines\" (II). Robots and fast have no guaranteed overlap."
  },
  "71": {
    "correctOptionId": "opt_2",
    "explanation": "Total knowing at least one = 60 + 50 - 30 = 80. Students knowing neither = 100 - 80 = 20."
  },
  "72": {
    "correctOptionId": "opt_1",
    "explanation": "Pens intersect Books, and Books are fully contained in Papers, so Pens must intersect Papers (I). All papers are books is not guaranteed."
  },
  "73": {
    "correctOptionId": "opt_3",
    "explanation": "Flowers are inside Trees, and Trees do not touch Fruits, so no Fruit is a Flower. Also, some Trees are Flowers. Both follow."
  },
  "74": {
    "correctOptionId": "opt_1",
    "explanation": "n(B union C) = n(B) + n(C) - n(B intersect C) => 50 = 35 + 20 - x => x = 5."
  },
  "75": {
    "correctOptionId": "opt_1",
    "explanation": "'Most' is equivalent to 'Some'. Some engineers are thinkers, and all thinkers are creators, hence Some engineers are creators (I)."
  },
  "76": {
    "correctOptionId": "opt_2",
    "explanation": "Rank from bottom = Total - Rank from top + 1 = 45 - 16 + 1 = 30th."
  },
  "77": {
    "correctOptionId": "opt_2",
    "explanation": "Arrangement clockwise around circle: A -> B -> D -> E -> C -> F. To the immediate left of C is B."
  },
  "78": {
    "correctOptionId": "opt_2",
    "explanation": "Deepak's new position (22) is Madhu's former position (12th from right). Total = 22 + 12 - 1 = 33."
  },
  "79": {
    "correctOptionId": "opt_3",
    "explanation": "The line from left to right is: P -> T -> S -> Q -> R. The person in the middle is S."
  },
  "80": {
    "correctOptionId": "opt_3",
    "explanation": "Heights in descending order: C > A > B > D > E. C is the tallest."
  },
  "81": {
    "correctOptionId": "opt_1",
    "explanation": "Minimum overlap formula = (11 + 20) - (5 + 2) = 31 - 7 = 24."
  },
  "82": {
    "correctOptionId": "opt_1",
    "explanation": "With 8 seats, opposite is 4 positions away. Computing positions relative to M placed at seat 1 places T at seat 5."
  },
  "83": {
    "correctOptionId": "opt_2",
    "explanation": "Total = 7 + 7 - 1 = 13 trees."
  },
  "84": {
    "correctOptionId": "opt_3",
    "explanation": "Score order: W > X > Z > Y. Y scored the lowest."
  },
  "85": {
    "correctOptionId": "opt_3",
    "explanation": "Order from fastest: F > C > A > B > D > E. F won the race."
  },
  "86": {
    "correctOptionId": "opt_2",
    "explanation": "10001 in binary is 16 + 1 = 17 in base-10 decimal."
  },
  "87": {
    "correctOptionId": "opt_4",
    "explanation": "Compiler, Interpreter, and Assembler are language translation software; Microcontroller is an integrated hardware chip."
  },
  "88": {
    "correctOptionId": "opt_1",
    "explanation": "A thermometer measures temperature; a barometer measures atmospheric pressure."
  },
  "89": {
    "correctOptionId": "opt_3",
    "explanation": "27(3^3), 64(4^3), 125(5^3), 216(6^3) are all perfect cubes. 144 is a square (12^2) but not a cube."
  },
  "90": {
    "correctOptionId": "opt_2",
    "explanation": "An odograph (or odometer) measures distance travelled, just as a clock measures time."
  },
  "91": {
    "correctOptionId": "opt_4",
    "explanation": "Copper, Silver, and Aluminum are electrical conductors; Silicon is a semiconductor."
  },
  "92": {
    "correctOptionId": "opt_2",
    "explanation": "A byte contains 8 bits; a nibble contains exactly 4 bits."
  },
  "93": {
    "correctOptionId": "opt_4",
    "explanation": "Linux, macOS, and Windows are operating systems; Oracle is a relational database/software enterprise."
  },
  "94": {
    "correctOptionId": "opt_2",
    "explanation": "1 robot takes 5 minutes to assemble 1 board. Hence, 100 robots working concurrently will finish 100 boards in 5 minutes."
  },
  "95": {
    "correctOptionId": "opt_2",
    "explanation": "Divide into 3 groups (3, 3, 2). Weigh 3 against 3. If equal, weigh the remaining 2. If unequal, weigh 1 against 1 from the heavier group. Guaranteed in 2 weighings."
  },
  "96": {
    "correctOptionId": "opt_1",
    "explanation": "Start both at time 0. At min 4, flip the 4-min timer. At min 7 (4-min has 1 min left), flip 7-min. At min 8, 4-min ends (7-min ran 1 min). Flip 7-min back to run for 1 min. 8 + 1 = 9 minutes."
  },
  "97": {
    "correctOptionId": "opt_2",
    "explanation": "Bat + Ball = 110. Bat = Ball + 100. 2 * Ball + 100 = 110 => 2 * Ball = 10 => Ball = Rs. 5."
  },
  "98": {
    "correctOptionId": "opt_2",
    "explanation": "Net gain is 1 meter per day. At the end of day 27, it is at 27 meters. On day 28, it climbs 3 meters to reach 30 meters and exits before sliding."
  },
  "99": {
    "correctOptionId": "opt_1",
    "explanation": "Incandescent/heat physics: Bulb 2 is currently glowing, Bulb 1 is hot to the touch from being on for 10 minutes, and Bulb 3 is cold and off."
  },
  "100": {
    "correctOptionId": "opt_1",
    "explanation": "Rope 1 lit at both ends burns in 30 minutes. At that exact moment, lighting the second end of rope 2 burns its remaining 30 minutes of fuel in 15 minutes: 30 + 15 = 45 minutes."
  },
  "101": {
    "correctOptionId": "opt_1",
    "explanation": "Ada Lovelace recognized that Babbage’s Analytical Engine could manipulate symbols beyond basic arithmetic and published the first machine algorithm in 1843."
  },
  "102": {
    "correctOptionId": "opt_1",
    "explanation": "Grace Hopper’s team discovered an actual moth trapped between the points of relay #70 in the Harvard Mark II electromechanical computer."
  },
  "103": {
    "correctOptionId": "opt_1",
    "explanation": "Journalist Don Hoefler coined the term in 1971 because Santa Clara county was home to pioneering semiconductor companies like Fairchild, Intel, and AMD."
  },
  "104": {
    "correctOptionId": "opt_1",
    "explanation": "Page and Brin originally named the search engine BackRub because the system analyzed incoming backlinks to measure web page relevance."
  },
  "105": {
    "correctOptionId": "opt_1",
    "explanation": "ARPANET (Advanced Research Projects Agency Network) launched packet-switching communications between UCLA and Stanford in October 1969."
  },
  "106": {
    "correctOptionId": "opt_1",
    "explanation": "Guido van Rossum was a big fan of the BBC comedy show Monty Python’s Flying Circus and wanted a name that sounded fun and irreverent."
  },
  "107": {
    "correctOptionId": "opt_1",
    "explanation": "Sir Tim Berners-Lee invented the World Wide Web, HTML, URL syntax, and the HTTP protocol at CERN in 1989."
  },
  "108": {
    "correctOptionId": "opt_1",
    "explanation": "Linus Torvalds created Linux, which today powers over 85% of global internet servers, supercomputers, and the core of Android."
  },
  "109": {
    "correctOptionId": "opt_1",
    "explanation": "Ray Tomlinson chose the \"@\" symbol on the ARPANET Model 33 Teletype because it represented \"at\" and was rarely used in usernames."
  },
  "110": {
    "correctOptionId": "opt_1",
    "explanation": "Douglas Engelbart demonstrated the first computer mouse in 1968, housing two wheels perpendicular to each other inside a wooden shell."
  },
  "111": {
    "correctOptionId": "opt_1",
    "explanation": "Apple Computer introduced the Macintosh in 1984, bringing graphical windows, menus, and the mouse into mainstream homes."
  },
  "112": {
    "correctOptionId": "opt_1",
    "explanation": "VisiCalc (created by Dan Bricklin and Bob Frankston) transformed computers from hobbyist toys into indispensable corporate tools."
  },
  "113": {
    "correctOptionId": "opt_1",
    "explanation": "Steve Jobs unveiled the original iPhone at Macworld on January 9, 2007, combining an iPod, a mobile phone, and a breakthrough internet communicator."
  },
  "114": {
    "correctOptionId": "opt_1",
    "explanation": "Alan Turing designed the Bombe machines to decrypt Enigma messages and defined the foundational Turing Machine concept in 1936."
  },
  "115": {
    "correctOptionId": "opt_1",
    "explanation": "ENIAC (Electronic Numerical Integrator and Computer) was completed in 1945, using over 17,000 vacuum tubes."
  },
  "116": {
    "correctOptionId": "opt_1",
    "explanation": "The point-contact transistor revolutionized electronics, earning the 1956 Nobel Prize in Physics and enabling the modern microchip era."
  },
  "117": {
    "correctOptionId": "opt_1",
    "explanation": "The IBM 350 RAMAC stored approximately 5 million 6-bit characters (around 3.75 to 5 MB) across 50 huge discs and weighed over a ton."
  },
  "118": {
    "correctOptionId": "opt_1",
    "explanation": "The MIT License is one of the most permissive open-source licenses, requiring only attribution while permitting commercial closed-source use."
  },
  "119": {
    "correctOptionId": "opt_1",
    "explanation": "Xerox PARC (Palo Alto Research Center) pioneered GUI windows, WYSIWYG editing, Ethernet networking, and object-oriented programming."
  },
  "120": {
    "correctOptionId": "opt_1",
    "explanation": "IBM Deep Blue defeated Garry Kasparov 3.5 to 2.5 in a six-game match in May 1997."
  },
  "121": {
    "correctOptionId": "opt_1",
    "explanation": "RAM is volatile memory designed for ultra-high-speed temporary calculations; non-volatile flash storage in SSDs traps electrons without power."
  },
  "122": {
    "correctOptionId": "opt_1",
    "explanation": "CPUs excel at complex serial logic and operating system orchestration; GPUs execute thousands of parallel mathematical matrix operations simultaneously."
  },
  "123": {
    "correctOptionId": "opt_1",
    "explanation": "Air is a poor heat conductor. Thermal paste fills microscopic imperfections on the metal surfaces to ensure efficient heat transfer into the radiator fins."
  },
  "124": {
    "correctOptionId": "opt_1",
    "explanation": "The UEFI/BIOS firmware initializes motherboard hardware components (POST) and locates the bootloader on the storage drive."
  },
  "125": {
    "correctOptionId": "opt_1",
    "explanation": "Mechanical hard drives must physically swing a magnetic read head across spinning platters; SSDs access semiconductor NAND flash memory instantaneously."
  },
  "126": {
    "correctOptionId": "opt_1",
    "explanation": "CPU cache (SRAM) operates at processor clock speeds (nanoseconds) to prevent the CPU from stalling while waiting for main DDR RAM."
  },
  "127": {
    "correctOptionId": "opt_1",
    "explanation": "A 3.8 GHz CPU executes 3.8 billion clock cycles per second, pacing internal transistor switching and instruction pipelines."
  },
  "128": {
    "correctOptionId": "opt_1",
    "explanation": "8 bits form 1 Byte (sufficient to represent 256 unique numbers or one ASCII character). 4 bits is a nibble."
  },
  "129": {
    "correctOptionId": "opt_1",
    "explanation": "Liquid coolant absorbs large thermal loads directly at the copper block and pumps it to large external radiator fins exposed to fan airflow."
  },
  "130": {
    "correctOptionId": "opt_1",
    "explanation": "Overclocking increases hardware frequency and voltage beyond rated specifications to achieve higher performance, generating extra heat."
  },
  "131": {
    "correctOptionId": "opt_1",
    "explanation": "HDMI transmits uncompressed digital audio and video signals over a single cable."
  },
  "132": {
    "correctOptionId": "opt_1",
    "explanation": "DisplayPort transmits data in micro-packets (like Ethernet) and supports multi-monitor daisy chaining and ultra-high variable refresh rates."
  },
  "133": {
    "correctOptionId": "opt_1",
    "explanation": "The PSU steps down and rectifies mains AC power into clean, regulated DC voltage rails that delicate computer microelectronics require."
  },
  "134": {
    "correctOptionId": "opt_1",
    "explanation": "Dual-channel memory doubles the communication width from 64-bit to 128-bit, drastically increasing throughput to the CPU."
  },
  "135": {
    "correctOptionId": "opt_1",
    "explanation": "Gordon Moore (co-founder of Intel) observed in 1965 that semiconductor manufacturing shrinks transistor gates, doubling density roughly every 18-24 months."
  },
  "136": {
    "correctOptionId": "opt_1",
    "explanation": "The universal USB-C mandate prevents thousands of tons of electronic cable waste by ensuring chargers and cords work across all manufacturers."
  },
  "137": {
    "correctOptionId": "opt_1",
    "explanation": "Intel engineer Jim Kardach proposed Bluetooth as a temporary code name after King Harald Bluetooth, who united Scandinavian kingdoms."
  },
  "138": {
    "correctOptionId": "opt_1",
    "explanation": "The Wi-Fi Alliance hired branding firm Interbrand in 1999 to create a friendly consumer name; it was never an official technical acronym."
  },
  "139": {
    "correctOptionId": "opt_1",
    "explanation": "Christopher Sholes designed the QWERTY layout to slow down typing collisions between adjacent mechanical metal arms that jammed paper scrolls."
  },
  "140": {
    "correctOptionId": "opt_1",
    "explanation": "A computer keyboard has letter and number keys, a Space bar, and an Enter key."
  },
  "141": {
    "correctOptionId": "opt_1",
    "explanation": "David Bradley designed Ctrl+Alt+Del as a quick warm reboot interrupt that could not be pressed accidentally with one hand."
  },
  "142": {
    "correctOptionId": "opt_1",
    "explanation": "NFC enables two electronic devices to communicate securely over distances of 4 cm or less via high-frequency radio induction."
  },
  "143": {
    "correctOptionId": "opt_1",
    "explanation": "Denso Wave engineer Masahiro Hara designed 2D Quick Response codes to track vehicle components during Toyota production."
  },
  "144": {
    "correctOptionId": "opt_1",
    "explanation": "An embedded SIM (eSIM) is reprogrammable firmware on a surface-mount chip, allowing users to switch carriers remotely without inserting plastic trays."
  },
  "145": {
    "correctOptionId": "opt_1",
    "explanation": "120Hz means the display hardware draws 120 distinct frames per second, providing fluid motion compared to standard 60Hz screens."
  },
  "146": {
    "correctOptionId": "opt_1",
    "explanation": "In Ingress Protection ratings, 6 denotes complete dust tightness and 8 denotes resistance against continuous water immersion under specified manufacturer depths."
  },
  "147": {
    "correctOptionId": "opt_1",
    "explanation": "ANC uses phase cancellation (destructive interference): inverse sound waves collide with incoming background noise to neutralize sound pressure waves."
  },
  "148": {
    "correctOptionId": "opt_1",
    "explanation": "Trilateration requires signals from a minimum of 4 satellites to resolve latitude, longitude, altitude, and atomic clock receiver time offsets."
  },
  "149": {
    "correctOptionId": "opt_1",
    "explanation": "OLED pixels are organic light emitting diodes that self-illuminate; when displaying black, pixels turn off entirely without light bleed from a backlight."
  },
  "150": {
    "correctOptionId": "opt_1",
    "explanation": "Thunderbolt tunnels PCIe data and DisplayPort video multiplexed across USB-C cables at speeds reaching 40 to 80 Gbps."
  },
  "151": {
    "correctOptionId": "opt_1",
    "explanation": "DNS acts as the phonebook of the internet, resolving memorable alphanumeric URLs into numerical IP addresses understood by routers."
  },
  "152": {
    "correctOptionId": "opt_1",
    "explanation": "HTTPS encrypts communication between the client and web server using TLS, preventing eavesdropping or man-in-the-middle packet tampering."
  },
  "153": {
    "correctOptionId": "opt_1",
    "explanation": "2FA requires something you know (password) plus something you possess (authenticator code or security key), thwarting over 99% of automated attacks."
  },
  "154": {
    "correctOptionId": "opt_1",
    "explanation": "HTTP 404 is a standard client-side error status indicating that the destination server is reachable, but the specific URL endpoint does not exist."
  },
  "155": {
    "correctOptionId": "opt_1",
    "explanation": "Over 1.4 million kilometers of high-capacity fiber-optic undersea cables crisscross ocean beds, carrying virtually all cross-continent internet traffic."
  },
  "156": {
    "correctOptionId": "opt_1",
    "explanation": "The Cloud is simply someone else’s industrial-scale computers: giant data centers with redundant power, high-speed fiber backbones, and enterprise storage."
  },
  "157": {
    "correctOptionId": "opt_1",
    "explanation": "Incognito mode only prevents local history and session cookies from persisting on the client machine; network admins and external websites still see your IP and traffic."
  },
  "158": {
    "correctOptionId": "opt_1",
    "explanation": "Phishing relies on social engineering to trick victims into handing over sensitive credentials or clicking malicious links."
  },
  "159": {
    "correctOptionId": "opt_1",
    "explanation": "Ransomware holds user files hostage through asymmetric cryptographic encryption until extortion ransoms are paid."
  },
  "160": {
    "correctOptionId": "opt_1",
    "explanation": "IPv4 has 2^32 (~4.3 billion) addresses. IPv6 provides 2^128 (approx 340 undecillion) addresses, ensuring every connected gadget has a unique public IP."
  },
  "161": {
    "correctOptionId": "opt_1",
    "explanation": "A firewall forms a barrier between trusted internal networks and untrusted external traffic by inspecting packet headers and ports."
  },
  "162": {
    "correctOptionId": "opt_1",
    "explanation": "Viruses require a human to run an infected host file; worms exploit network vulnerabilities to self-replicate independently."
  },
  "163": {
    "correctOptionId": "opt_1",
    "explanation": "A VPN encrypts device traffic and routes it through an intermediary server, shielding packet contents on public Wi-Fi networks."
  },
  "164": {
    "correctOptionId": "opt_1",
    "explanation": "HTTP cookies allow stateless web protocols to remember stateful sessions, user preferences, and shopping carts."
  },
  "165": {
    "correctOptionId": "opt_1",
    "explanation": "DDoS attacks use botnets of compromised IoT devices or computers to flood target servers with bandwidth packets until they crash."
  },
  "166": {
    "correctOptionId": "opt_1",
    "explanation": "E2EE encrypts data directly on the sender’s device and only decrypts it on the recipient’s device, keeping intermediate telecom servers blind to the contents."
  },
  "167": {
    "correctOptionId": "opt_1",
    "explanation": "Open-source software fosters peer collaboration, public security audits, and community-driven improvements."
  },
  "168": {
    "correctOptionId": "opt_1",
    "explanation": "Bandwidth represents the theoretical throughput capacity of a connection (how much data can flow per second, like water pipe diameter)."
  },
  "169": {
    "correctOptionId": "opt_1",
    "explanation": "A Zero-Day flaw gives developers zero days of advance warning to prepare a defensive patch before potential active exploitation."
  },
  "170": {
    "correctOptionId": "opt_1",
    "explanation": "mTLS ensures zero-trust security by verifying certificates on both the client side and the server side before initiating encrypted traffic."
  },
  "171": {
    "correctOptionId": "opt_1",
    "explanation": "GPT stands for Generative (creates new text), Pre-trained (trained on massive text corpora), Transformer (neural network architecture using self-attention)."
  },
  "172": {
    "correctOptionId": "opt_1",
    "explanation": "NVIDIA GPUs feature thousands of tensor cores tailored for tensor math, supported by the mature CUDA computing ecosystem."
  },
  "173": {
    "correctOptionId": "opt_1",
    "explanation": "Hallucinations occur because LLMs predict mathematically probable sequences of tokens rather than accessing an active cognitive model of verified truth."
  },
  "174": {
    "correctOptionId": "opt_1",
    "explanation": "Prompt engineering guides the stochastic generation of LLMs by setting constraints, roles, few-shot examples, and chain-of-thought structures."
  },
  "175": {
    "correctOptionId": "opt_1",
    "explanation": "The 2017 paper \"Attention Is All You Need\" introduced the Transformer architecture, replacing recurrent networks with parallel self-attention."
  },
  "176": {
    "correctOptionId": "opt_1",
    "explanation": "Deepfakes use generative adversarial networks (GANs) and diffusion models to realistically fabricate video and audio of human beings."
  },
  "177": {
    "correctOptionId": "opt_1",
    "explanation": "The Imitation Game (Turing Test) tests whether a computer’s natural language responses can be distinguished from those of a human."
  },
  "178": {
    "correctOptionId": "opt_1",
    "explanation": "Computer vision uses convolutional networks and vision transformers to perform object detection, semantic segmentation, and scene understanding."
  },
  "179": {
    "correctOptionId": "opt_1",
    "explanation": "RLHF aligns raw base token-prediction models with human intentions by training a reward model based on human evaluator rankings."
  },
  "180": {
    "correctOptionId": "opt_1",
    "explanation": "Tokenizers (like Byte-Pair Encoding) break text into sub-word tokens. 1,000 English words typically correspond to approximately 1,333 tokens."
  },
  "181": {
    "correctOptionId": "opt_1",
    "explanation": "Anthropic was founded by former OpenAI researchers to pioneer Constitutional AI and transparent safety architectures."
  },
  "182": {
    "correctOptionId": "opt_1",
    "explanation": "AlphaFold solved a 50-year grand challenge in structural biology, accelerating drug discovery and biological engineering worldwide."
  },
  "183": {
    "correctOptionId": "opt_1",
    "explanation": "Sensor fusion merges high-resolution visual feeds with millimeter-wave radar and pulsed-laser LiDAR distance maps for navigation."
  },
  "184": {
    "correctOptionId": "opt_1",
    "explanation": "Overfitting occurs when high-capacity models fit arbitrary noise in training samples, failing to generalize to real-world test inputs."
  },
  "185": {
    "correctOptionId": "opt_1",
    "explanation": "Synthetic data expands training corpora for scenarios where real data is scarce, hazardous, or privacy-restricted (e.g., self-driving edge cases)."
  },
  "186": {
    "correctOptionId": "opt_1",
    "explanation": "AI agents leverage LLM reasoning to decompose goals, call external APIs, evaluate intermediate results, and iterate autonomously."
  },
  "187": {
    "correctOptionId": "opt_1",
    "explanation": "Artificial neural networks use mathematical nodes and adjustable synaptic weights inspired by biological neural firing mechanisms."
  },
  "188": {
    "correctOptionId": "opt_1",
    "explanation": "Open-weights models allow researchers and developers to run, fine-tune, and inspect model parameters locally on their own machines."
  },
  "189": {
    "correctOptionId": "opt_1",
    "explanation": "Zero-shot learning relies on rich pre-trained conceptual representations to generalize to new prompts without fine-tuned examples."
  },
  "190": {
    "correctOptionId": "opt_1",
    "explanation": "Edge AI delivers ultra-low latency, preserves user privacy, and works without an active internet connection by computing locally on-device."
  },
  "191": {
    "correctOptionId": "opt_1",
    "explanation": "Ultrasonic sensors emit high-frequency (40 kHz) sound waves and measure the round-trip echo time to calculate distance = (Time × Speed of Sound) / 2."
  },
  "192": {
    "correctOptionId": "opt_1",
    "explanation": "Infrared light reflects off light/white surfaces and is absorbed by dark/black surfaces. When the receiver detects no reflection, the robot knows it is over the black line."
  },
  "193": {
    "correctOptionId": "opt_1",
    "explanation": "Standard DC motors rotate continuously at high speed; servo motors incorporate a potentiometer and control circuit to hold a precise commanded shaft angle."
  },
  "194": {
    "correctOptionId": "opt_1",
    "explanation": "The Arduino Uno is a beginner-friendly microcontroller board that executes uploaded C/C++ code to read physical sensors and actuate motors in real time."
  },
  "195": {
    "correctOptionId": "opt_1",
    "explanation": "A solderless breadboard contains internal rows of metal spring clips, allowing students to quickly assemble and iterate circuits without permanent soldering."
  },
  "196": {
    "correctOptionId": "opt_1",
    "explanation": "Microcontroller pins provide low-current logic signals. A dedicated motor driver acts as a high-current power switch (H-Bridge) powered by an external battery pack."
  },
  "197": {
    "correctOptionId": "opt_1",
    "explanation": "LDRs are made of photo-conductive semiconductors whose resistance drops dramatically in bright light, enabling robots to detect light direction."
  },
  "198": {
    "correctOptionId": "opt_1",
    "explanation": "PIR sensors measure variations in ambient infrared thermal signatures. When a warm body moves across the Fresnel lens, it triggers an active high signal."
  },
  "199": {
    "correctOptionId": "opt_1",
    "explanation": "The end-effector is the robot's \"hand\" or terminal mechanism engineered specifically for the target task (grasping, welding, painting, suctioning)."
  },
  "200": {
    "correctOptionId": "opt_1",
    "explanation": "By Newton's Third Law, motor rotation generates opposite angular torque on the frame. Having 2 CW and 2 CCW motors balances total net torque to zero for stable flight."
  },
  "201": {
    "correctOptionId": "opt_1",
    "explanation": "Differential drive robots turn on their center of mass by spinning opposing drive wheels in opposite directions at equal velocity."
  },
  "202": {
    "correctOptionId": "opt_1",
    "explanation": "Asimov introduced the Three Laws of Robotics in 1942: 1. Do not harm humans, 2. Obey human orders (unless conflicting with Law 1), 3. Protect own existence (unless conflicting with 1 or 2)."
  },
  "203": {
    "correctOptionId": "opt_1",
    "explanation": "LiDAR measures the time taken for pulsed laser beams to reflect off surfaces, building a rich 360-degree point-cloud map of surrounding geometry."
  },
  "204": {
    "correctOptionId": "opt_1",
    "explanation": "In mechanics and robotics, each Degree of Freedom represents one independent coordinate parameter (joint translation or rotation) needed to specify position."
  },
  "205": {
    "correctOptionId": "opt_1",
    "explanation": "Wheeled robots excel on smooth flat pavements, but legged locomotion mimics biological animals to traverse stairs, rocks, construction gravel, and debris."
  },
  "206": {
    "correctOptionId": "opt_1",
    "explanation": "NPCI was established in 2008 to operate retail payment and settlement systems in India, launching UPI in 2016."
  },
  "207": {
    "correctOptionId": "opt_1",
    "explanation": "ONDC is an open network specification (based on the Beckn protocol) that democratizes e-commerce by decoupling buyer and seller applications."
  },
  "208": {
    "correctOptionId": "opt_1",
    "explanation": "FASTag uses passive RFID technology affixed to the windscreen, read by toll plaza antennas to deduct tolls from linked prepaid accounts."
  },
  "209": {
    "correctOptionId": "opt_1",
    "explanation": "DigiLocker provides citizens with cloud storage tied to their Aadhaar, enabling paperless verification under the IT Act."
  },
  "210": {
    "correctOptionId": "opt_1",
    "explanation": "India Stack is the collective moniker for identity, payments, and data-governance APIs powering digital transformation."
  },
  "211": {
    "correctOptionId": "opt_1",
    "explanation": "BharatQR is an integrated QR code system enabling merchants to accept payments from RuPay, Visa, and Mastercard through a single unified QR."
  },
  "212": {
    "correctOptionId": "opt_1",
    "explanation": "The ISM provides capital incentives to establish commercial silicon fabs, packaging plants, and compound semiconductor foundries in India."
  },
  "213": {
    "correctOptionId": "opt_1",
    "explanation": "BHIM was launched by Prime Minister Narendra Modi in December 2016 to facilitate seamless, direct bank payments."
  },
  "214": {
    "correctOptionId": "opt_1",
    "explanation": "5G Standalone provides true ultra-low latency, network slicing, and edge compute without legacy 4G core EPC dependencies."
  },
  "215": {
    "correctOptionId": "opt_1",
    "explanation": "Bhashini builds open-source AI language models and datasets to bridge language barriers across 22 scheduled Indian languages."
  },
  "216": {
    "correctOptionId": "opt_1",
    "explanation": "In a 1970 Monty Python sketch, Vikings chant \"Spam, Spam, Spam\" until no other dialogue can be heard; early internet users adopted it for repetitive newsgroup posts."
  },
  "217": {
    "correctOptionId": "opt_1",
    "explanation": "Ray tracing models light transport physically: calculating light rays bouncing off mirrors, water surfaces, and materials in real time."
  },
  "218": {
    "correctOptionId": "opt_1",
    "explanation": "Linus Torvalds chose Tux the Penguin as the official Linux mascot after being playfully pecked by a penguin at an Australian zoo."
  },
  "219": {
    "correctOptionId": "opt_1",
    "explanation": "Mona the Octocat was designed by graphic artist Simon Oxley to represent the collaborative, multi-tentacled nature of code collaboration."
  },
  "220": {
    "correctOptionId": "opt_1",
    "explanation": "Google named Android releases after desserts because smartphones sweeten our daily lives, maintaining alphabetical order for 10 years until Android 10."
  },
  "221": {
    "correctOptionId": "opt_1",
    "explanation": "Zairza’s core philosophy is the journey from raw curiosity to disciplined engineering analysis to working hardware, software, and design prototypes."
  },
  "222": {
    "correctOptionId": "opt_1",
    "explanation": "High-pressure builds require emotional resilience, supportive pair-debugging, and structured log tracing over panic or finger-pointing."
  },
  "223": {
    "correctOptionId": "opt_1",
    "explanation": "Constructive technical feedback is the fastest catalyst for engineering growth; detaching ego from code is essential for professional maturity."
  },
  "224": {
    "correctOptionId": "opt_1",
    "explanation": "A true Zairza member maintains academic responsibility through transparent schedule planning and early communication with project teammates."
  },
  "225": {
    "correctOptionId": "opt_1",
    "explanation": "Engineering innovation at Zairza thrives on interdisciplinary collaboration; curiosity, hunger to learn, and peer empathy trump past background."
  },
  "226": {
    "correctOptionId": "opt_1",
    "explanation": "Engineering integrity requires rigorous honesty, respect for intellectual property, and adherence to open-source licensing standards."
  },
  "227": {
    "correctOptionId": "opt_1",
    "explanation": "\"Disagree and Commit\" enables high-performing engineering teams to debate passionately using data, but unite completely behind the final execution."
  },
  "228": {
    "correctOptionId": "opt_1",
    "explanation": "The greatest technology breakthroughs occur at the intersection of disciplines: a robot needs microelectronics, cloud intelligence, and ergonomic design."
  },
  "229": {
    "correctOptionId": "opt_1",
    "explanation": "Resilience and blameless post-mortem analysis are what turn failed experiments into future engineering triumphs."
  },
  "230": {
    "correctOptionId": "opt_1",
    "explanation": "True ownership means caring for shared spaces, laboratory safety, and collective club resources without waiting to be told."
  },
  "231": {
    "correctOptionId": "opt_1",
    "explanation": "Curiosity and self-driven exploratory prototyping keep an engineering society at the bleeding edge of technological evolution."
  },
  "232": {
    "correctOptionId": "opt_1",
    "explanation": "Under tight deadlines, disciplined engineers prioritize core stability, defensive fallbacks, and transparent communication over chaotic panic."
  },
  "233": {
    "correctOptionId": "opt_1",
    "explanation": "High-performing teams actively solicit input from all voices, ensuring psychological safety and discovering innovative insights from diverse team members."
  },
  "234": {
    "correctOptionId": "opt_1",
    "explanation": "Mistakes happen in engineering labs. Immediate honesty, intellectual accountability, and learning how to protect circuits build trust and competence."
  },
  "235": {
    "correctOptionId": "opt_1",
    "explanation": "The strength of Zairza lies in compounding institutional knowledge: documented solutions turn individual discoveries into club-wide superpowers."
  },
  "236": {
    "correctOptionId": "opt_1",
    "explanation": "Effective leadership empowers team members, aligns tasks with personal growth goals, and fosters clear milestone tracking."
  },
  "237": {
    "correctOptionId": "opt_1",
    "explanation": "Professional engineering conflicts are resolved through objective architectural requirements and data-driven trade-offs, not personal pride."
  },
  "238": {
    "correctOptionId": "opt_1",
    "explanation": "Proactive problem solving and establishing sustainable organizational systems protect valuable shared club hardware."
  },
  "239": {
    "correctOptionId": "opt_1",
    "explanation": "Empathetic code reviews provide constructive guidance, explain the \"why\" behind best practices, and build confidence in aspiring junior developers."
  },
  "240": {
    "correctOptionId": "opt_1",
    "explanation": "Zairza stands for curiosity, open-door mentorship, creative boldness, and a collaborative brotherhood/sisterhood of engineers."
  },
  "241": {
    "correctOptionId": "opt_1",
    "explanation": "Induction into Zairza is a commitment to passion, first-principles creation, and pushing the boundaries of what student engineers can build."
  },
  "242": {
    "correctOptionId": "opt_1",
    "explanation": "High-tempo engineers manage stress through realistic triage, ruthless focus, and eliminating peripheral distractions."
  },
  "243": {
    "correctOptionId": "opt_1",
    "explanation": "Constructive two-way feedback between juniors and seniors fosters continuous organizational improvement and mutual respect."
  },
  "244": {
    "correctOptionId": "opt_1",
    "explanation": "A secure and mature engineer celebrates peers’ triumphs, recognizing that rising tides lift the entire community."
  },
  "245": {
    "correctOptionId": "opt_1",
    "explanation": "Ambiguous real-world engineering problems are tackled by proactively asking clarifying questions, formulating hypotheses, and validating early prototypes."
  },
  "246": {
    "correctOptionId": "opt_1",
    "explanation": "Flagship events are team efforts where every member’s energetic contribution reflects the society’s reputation and hospitality."
  },
  "247": {
    "correctOptionId": "opt_1",
    "explanation": "Debugging endurance requires knowing when to take a cognitive reset, question core assumptions, and use collaborative rubber-duck debugging."
  },
  "248": {
    "correctOptionId": "opt_1",
    "explanation": "Versatile modern innovators understand that industrial design, user experience, and aesthetic polish differentiate great hardware and software products."
  },
  "249": {
    "correctOptionId": "opt_1",
    "explanation": "Sustainable peak performance requires balancing intense sprints with necessary physical recovery and healthy habits."
  },
  "250": {
    "correctOptionId": "opt_1",
    "explanation": "Diversity in team perspectives breeds creative innovation; mutual respect and inclusive camaraderie are non-negotiable club values."
  },
  "251": {
    "correctOptionId": "opt_1",
    "explanation": "Zairza’s enduring legacy is built on a continuum of mentorship: passionate freshers become skilled builders who nurture future cohorts."
  },
  "252": {
    "correctOptionId": "opt_1",
    "explanation": "True engineering excellence is accompanied by humility, gratitude toward mentors, and an eagerness to keep leveling up."
  },
  "253": {
    "correctOptionId": "opt_1",
    "explanation": "Documentation is the bridge between a temporary hack and a lasting engineering contribution that can be built upon by future engineers."
  },
  "254": {
    "correctOptionId": "opt_1",
    "explanation": "Engineering resourcefulness (jugaad guided by rigorous design) turns constraints into opportunities for rapid prototyping and innovation."
  },
  "255": {
    "correctOptionId": "opt_1",
    "explanation": "Code has no hierarchy; the best engineers care about code correctness and robust engineering over who pointed out the fix."
  },
  "256": {
    "correctOptionId": "opt_1",
    "explanation": "The hallmark of great leaders is creating more leaders; lifting others up is the core responsibility of senior members at Zairza."
  },
  "257": {
    "correctOptionId": "opt_1",
    "explanation": "Persuasion in engineering requires demonstrating pragmatic value, offering to shoulder the setup burden, and respecting team velocity."
  },
  "258": {
    "correctOptionId": "opt_1",
    "explanation": "Rejection is redirection; analyzing gaps in validation and market fit turns early grant setbacks into compelling future pitches."
  },
  "259": {
    "correctOptionId": "opt_1",
    "explanation": "Hardware laboratory safety is paramount: verifying wiring with multimeters and respecting chemical LiPo power safety protect human lives and equipment."
  },
  "260": {
    "correctOptionId": "opt_1",
    "explanation": "Being a Zairzite is defined by curiosity, craftsmanship, camaraderie, and turning bold ideas into reality: Wonder • Think • Create."
  }
};

export const INITIAL_CANDIDATES = [
  {
    "rollNumber": "24011042",
    "fullName": "Aarav Mohapatra",
    "email": "aarav.mohapatra@outr.ac.in",
    "mobile": "+91 98765 43210",
    "year": "1st Year",
    "branch": "Computer Science and Engineering",
    "gender": "Male",
    "residentialType": "Hosteller",
    "preferredWing": "Software",
    "technicalInterests": ["Web Development", "AI & Robotics", "Design"],
    "portfolioUrl": "https://github.com/aarav-m",
    "quizStatus": "NOT_STARTED",
    "score": null,
    "violationsCount": 0,
    "timeTakenSeconds": 0,
    "submissionReason": null,
    "registeredAt": "2026-09-29 18:30"
  },
  {
    "rollNumber": "24011118",
    "fullName": "Priyanka Dash",
    "email": "priyanka.dash@outr.ac.in",
    "mobile": "+91 98765 43211",
    "year": "1st Year",
    "branch": "Electronics and Communication Engineering (ECE)",
    "gender": "Female",
    "residentialType": "Day Scholar",
    "preferredWing": "Robotics & IoT",
    "technicalInterests": ["Drones", "IoT Sensors", "Robotics"],
    "portfolioUrl": "https://linkedin.com/in/priyanka-dash",
    "quizStatus": "IN_PROGRESS",
    "score": null,
    "violationsCount": 1,
    "timeTakenSeconds": 780,
    "submissionReason": null,
    "registeredAt": "2026-09-29 19:15"
  },
  {
    "rollNumber": "24011205",
    "fullName": "Rohan Behera",
    "email": "rohan.behera@outr.ac.in",
    "mobile": "+91 98765 43212",
    "year": "1st Year",
    "branch": "Information Technology",
    "gender": "Male",
    "residentialType": "Hosteller",
    "preferredWing": "Design",
    "technicalInterests": ["UI/UX Design", "3D Modeling", "Frontend"],
    "portfolioUrl": "https://behance.net/rohanbehera",
    "quizStatus": "COMPLETED",
    "score": 24.5,
    "violationsCount": 0,
    "timeTakenSeconds": 1420,
    "submissionReason": "MANUAL_SUBMIT",
    "registeredAt": "2026-09-29 17:45",
    "submittedAt": "2026-09-29 22:45"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    "id": "log_001",
    "action": "CONFIG_UPDATE",
    "admin": "Super Admin (admin@zairza.in)",
    "details": "Induction window set: 29th Sept 10:00 PM to 30th Sept 10:00 PM.",
    "timestamp": "2026-09-29 16:30"
  },
  {
    "id": "log_002",
    "action": "POOL_EXPANSION",
    "admin": "Super Admin",
    "details": "Expanded Question Bank Pool: 100 Logical Reasoning, 120 Tech (1st Year Freshers), 40 Coffee Test (HR). Total: 260 curated questions.",
    "timestamp": "2026-09-29 23:15"
  }
];
