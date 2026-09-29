// Zairza Induction Platform — Initial Data & Assessment Configuration
// Window: 29th Sept 10:00 PM to 30th Sept 10:00 PM
// Registration Closes: 30th Sept 12:00 PM (Noon)
// Duration: 30 minutes (1800 seconds)

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
      "poolSize": 18,
      "drawCount": 10
    },
    {
      "id": "tech",
      "name": "Part 2: Tech Knowledge & Trends",
      "icon": "⚡",
      "poolSize": 29,
      "drawCount": 15
    },
    {
      "id": "hr",
      "name": "Part 3: HR & Cultural Fit",
      "icon": "🤝",
      "poolSize": 13,
      "drawCount": 5
    }
  ]
};

// ==============================================================================
// PUBLIC QUESTION POOL (Sanitized: NO correctOptionId or explanation)
// Beginner-friendly for 1st Year Freshers: History, Riddles, Trends & Global News
// ==============================================================================
export const INITIAL_QUESTIONS = [
  {
    "id": 1,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
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
    "id": 2,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
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
    "id": 3,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
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
    "id": 4,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Statement: 'All members of Zairza are innovators. Some innovators are drone pilots.' Conclusion I: Some drone pilots are members of Zairza. Conclusion II: All innovators are members of Zairza.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only Conclusion I follows"
      },
      {
        "id": "opt_2",
        "text": "Only Conclusion II follows"
      },
      {
        "id": "opt_3",
        "text": "Neither Conclusion follows"
      },
      {
        "id": "opt_4",
        "text": "Both Conclusions follow"
      }
    ]
  },
  {
    "id": 5,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "A drone takes off from the OUTR Student Activity Centre, flies 12m North, turns East and flies 5m, then hovers straight up vertically 13m. What is the displacement from the origin?",
    "options": [
      {
        "id": "opt_1",
        "text": "13.0 m"
      },
      {
        "id": "opt_2",
        "text": "18.38 m (approx)"
      },
      {
        "id": "opt_3",
        "text": "25.0 m"
      },
      {
        "id": "opt_4",
        "text": "17.0 m"
      }
    ]
  },
  {
    "id": 6,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Look at the binary relationship: 1010 : 10 :: 1111 : 15 :: 10001 : ?",
    "options": [
      {
        "id": "opt_1",
        "text": "16"
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
    "id": 7,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Six team members (A, B, C, D, E, F) sit in a circle facing the center. A sits opposite D. B is to the immediate right of A. C is between A and E. Who sits to the immediate left of D?",
    "options": [
      {
        "id": "opt_1",
        "text": "B"
      },
      {
        "id": "opt_2",
        "text": "E"
      },
      {
        "id": "opt_3",
        "text": "F"
      },
      {
        "id": "opt_4",
        "text": "C"
      }
    ]
  },
  {
    "id": 8,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "If clock hands show 3:15, what is the angle between the hour hand and minute hand?",
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
        "text": "12.0 degrees"
      },
      {
        "id": "opt_4",
        "text": "15.0 degrees"
      }
    ]
  },
  {
    "id": 9,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "In a hackathon team, each person shakes hands with every other teammate exactly once. If 28 handshakes occurred, how many members were on the team?",
    "options": [
      {
        "id": "opt_1",
        "text": "7"
      },
      {
        "id": "opt_2",
        "text": "8"
      },
      {
        "id": "opt_3",
        "text": "9"
      },
      {
        "id": "opt_4",
        "text": "14"
      }
    ]
  },
  {
    "id": 10,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Which word does NOT belong with the others: Compiler, Transpiler, Interpreter, Microcontroller?",
    "options": [
      {
        "id": "opt_1",
        "text": "Compiler"
      },
      {
        "id": "opt_2",
        "text": "Transpiler"
      },
      {
        "id": "opt_3",
        "text": "Interpreter"
      },
      {
        "id": "opt_4",
        "text": "Microcontroller"
      }
    ]
  },
  {
    "id": 11,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (History & Origin)",
    "prompt": "Why is an unexpected glitch or software error in computer programming famously called a 'bug'?",
    "options": [
      {
        "id": "opt_1",
        "text": "In 1947, engineers found an actual moth trapped inside the relays of the Harvard Mark II computer"
      },
      {
        "id": "opt_2",
        "text": "Early punch cards were made of wood and frequently infested with termites"
      },
      {
        "id": "opt_3",
        "text": "Thomas Edison's nickname when building telegraphs was 'The Little Bug'"
      },
      {
        "id": "opt_4",
        "text": "Computer viruses look like microscopic insects under an electron microscope"
      }
    ]
  },
  {
    "id": 12,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI & Current Trends)",
    "prompt": "Everyone is using ChatGPT today. What does the 'GPT' in ChatGPT actually stand for?",
    "options": [
      {
        "id": "opt_1",
        "text": "Generative Pre-trained Transformer"
      },
      {
        "id": "opt_2",
        "text": "General Programming Technology"
      },
      {
        "id": "opt_3",
        "text": "Global Prompt Telemetry"
      },
      {
        "id": "opt_4",
        "text": "Guided Predictive Typing"
      }
    ]
  },
  {
    "id": 13,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech History)",
    "prompt": "Who is widely celebrated in world history as the world's very first computer programmer for writing an algorithm for Charles Babbage's mechanical computer?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ada Lovelace"
      },
      {
        "id": "opt_2",
        "text": "Alan Turing"
      },
      {
        "id": "opt_3",
        "text": "Grace Hopper"
      },
      {
        "id": "opt_4",
        "text": "Nikola Tesla"
      }
    ]
  },
  {
    "id": 14,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Fun Riddle)",
    "prompt": "Tech Riddle: 'I remember everything you are working on while your laptop is awake, but the moment you turn off the power, I forget everything instantly. What am I?'",
    "options": [
      {
        "id": "opt_1",
        "text": "RAM (Random Access Memory)"
      },
      {
        "id": "opt_2",
        "text": "SSD (Solid State Drive)"
      },
      {
        "id": "opt_3",
        "text": "Processor Cooling Fan"
      },
      {
        "id": "opt_4",
        "text": "Wi-Fi Antenna"
      }
    ]
  },
  {
    "id": 15,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Current Trends & News)",
    "prompt": "Why has NVIDIA recently skyrocketed to become one of the most valuable tech corporations in the world alongside Apple and Microsoft?",
    "options": [
      {
        "id": "opt_1",
        "text": "Their GPUs (Graphics Processing Units) provide the high-speed parallel computing hardware powering modern Generative AI"
      },
      {
        "id": "opt_2",
        "text": "They manufacture 90% of all electric cars in Asia"
      },
      {
        "id": "opt_3",
        "text": "They purchased the global fiber optic undersea cables"
      },
      {
        "id": "opt_4",
        "text": "They own the YouTube video streaming servers"
      }
    ]
  },
  {
    "id": 16,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Startup History)",
    "prompt": "Tech giants like Apple (Steve Jobs), Google (Larry & Sergey), and Amazon (Jeff Bezos) famously started their initial operations out of which humble location?",
    "options": [
      {
        "id": "opt_1",
        "text": "A residential home garage"
      },
      {
        "id": "opt_2",
        "text": "A NASA research laboratory"
      },
      {
        "id": "opt_3",
        "text": "A 5-star hotel conference center"
      },
      {
        "id": "opt_4",
        "text": "A government military bunker"
      }
    ]
  },
  {
    "id": 17,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Everyday Web Tech)",
    "prompt": "When browsing the web, what does the classic HTTP status code '404' displayed on your screen indicate?",
    "options": [
      {
        "id": "opt_1",
        "text": "Page Not Found — the requested link does not exist on the server"
      },
      {
        "id": "opt_2",
        "text": "Your internet bill payment is overdue"
      },
      {
        "id": "opt_3",
        "text": "The website server has caught fire"
      },
      {
        "id": "opt_4",
        "text": "Your browser requires an immediate Windows update"
      }
    ]
  },
  {
    "id": 18,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Digital India & FinTech)",
    "prompt": "India's UPI (Unified Payments Interface) is celebrated as a global gold standard for instant real-time bank payments. Which organization built and operates UPI?",
    "options": [
      {
        "id": "opt_1",
        "text": "NPCI (National Payments Corporation of India)"
      },
      {
        "id": "opt_2",
        "text": "NITI Aayog"
      },
      {
        "id": "opt_3",
        "text": "World Bank"
      },
      {
        "id": "opt_4",
        "text": "Federal Reserve"
      }
    ]
  },
  {
    "id": 19,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Space Exploration & Robotics)",
    "prompt": "In August 2023, India made history by landing near the moon's South Pole with Chandrayaan-3. What was the name of the 6-wheeled robotic rover deployed on the lunar surface?",
    "options": [
      {
        "id": "opt_1",
        "text": "Pragyan"
      },
      {
        "id": "opt_2",
        "text": "Vikram"
      },
      {
        "id": "opt_3",
        "text": "Mangalyaan"
      },
      {
        "id": "opt_4",
        "text": "Pushpak"
      }
    ]
  },
  {
    "id": 20,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Fun Riddle)",
    "prompt": "Tech Riddle: 'I connect billions of devices across oceans via fiber-optic glass cables carrying pulses of light. Without me, you couldn't view Instagram reels, Google answers, or write this online quiz. What am I?'",
    "options": [
      {
        "id": "opt_1",
        "text": "The World Wide Web / The Internet"
      },
      {
        "id": "opt_2",
        "text": "Bluetooth"
      },
      {
        "id": "opt_3",
        "text": "FM Radio Frequency"
      },
      {
        "id": "opt_4",
        "text": "GPS Receiver"
      }
    ]
  },
  {
    "id": 21,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Consumer Tech & Standards)",
    "prompt": "To reduce electronic waste and cable clutter, which universal connector standard has been legally mandated for all future smartphones, laptops, and earphones in India and the EU?",
    "options": [
      {
        "id": "opt_1",
        "text": "USB Type-C"
      },
      {
        "id": "opt_2",
        "text": "Lightning Cable"
      },
      {
        "id": "opt_3",
        "text": "Micro-USB"
      },
      {
        "id": "opt_4",
        "text": "VGA Port"
      }
    ]
  },
  {
    "id": 22,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Open Source & OS)",
    "prompt": "Android smartphones, NASA's Mars rovers, and 100% of the world's top 500 supercomputers run on variations of an open-source OS kernel created by university student Linus Torvalds in 1991. What is it?",
    "options": [
      {
        "id": "opt_1",
        "text": "Linux"
      },
      {
        "id": "opt_2",
        "text": "Windows 95"
      },
      {
        "id": "opt_3",
        "text": "Macintosh System 7"
      },
      {
        "id": "opt_4",
        "text": "Symbian"
      }
    ]
  },
  {
    "id": 23,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware Fundamentals)",
    "prompt": "Why does a modern laptop with an SSD (Solid State Drive) boot in 8 seconds, while an older laptop with an HDD (Hard Disk Drive) took over 2 minutes?",
    "options": [
      {
        "id": "opt_1",
        "text": "SSDs use electronic flash memory with zero mechanical moving parts, whereas HDDs have to physically spin magnetic platters and move reader heads"
      },
      {
        "id": "opt_2",
        "text": "SSDs draw power directly from ambient Wi-Fi signals"
      },
      {
        "id": "opt_3",
        "text": "HDDs only work when connected to a LAN ethernet cable"
      },
      {
        "id": "opt_4",
        "text": "SSDs are water-cooled"
      }
    ]
  },
  {
    "id": 24,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Fun Riddle)",
    "prompt": "Tech Riddle: 'I have keys but no door locks. I have space but no rooms. You can Enter, but you can never leave me physically. What am I?'",
    "options": [
      {
        "id": "opt_1",
        "text": "A Computer Keyboard"
      },
      {
        "id": "opt_2",
        "text": "A Pendrive"
      },
      {
        "id": "opt_3",
        "text": "A Motherboard"
      },
      {
        "id": "opt_4",
        "text": "An HDMI Cable"
      }
    ]
  },
  {
    "id": 25,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Open Source Philosophy)",
    "prompt": "When software like VLC Media Player, Python, or Blender is described as 'Open Source', what does it mean to the user community?",
    "options": [
      {
        "id": "opt_1",
        "text": "The creator has published the original source code freely for anyone in the world to inspect, improve, learn from, and build upon"
      },
      {
        "id": "opt_2",
        "text": "The app only operates during daytime office hours"
      },
      {
        "id": "opt_3",
        "text": "You must pay a monthly subscription fee after 30 days"
      },
      {
        "id": "opt_4",
        "text": "The app cannot be installed on laptops"
      }
    ]
  },
  {
    "id": 26,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "It's 48 hours before the annual tech fest exhibition, and your team's hardware sensor module suddenly stops communicating with the software dashboard. How do you respond?",
    "options": [
      {
        "id": "opt_1",
        "text": "Immediately notify the team leads, isolate the issue between hardware wiring and API endpoints, and collaborate on a fallback demo."
      },
      {
        "id": "opt_2",
        "text": "Wait until the leads ask about status before mentioning the issue."
      },
      {
        "id": "opt_3",
        "text": "Blame the software wing for changing data formatting."
      },
      {
        "id": "opt_4",
        "text": "Drop out of the project since there's insufficient time left."
      }
    ]
  },
  {
    "id": 27,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "A senior mentor gives you critical feedback that your submitted UI or code design lacks structure and needs substantial refactoring. How do you handle it?",
    "options": [
      {
        "id": "opt_1",
        "text": "Ignore the feedback because it worked fine on your personal device."
      },
      {
        "id": "opt_2",
        "text": "Take notes on specific pain points, ask clarifying questions to understand society standards, and iterate."
      },
      {
        "id": "opt_3",
        "text": "Argue that aesthetic choices are purely subjective."
      },
      {
        "id": "opt_4",
        "text": "Stop contributing to avoid further reviews."
      }
    ]
  },
  {
    "id": 28,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "What is your primary motivation for seeking induction into Zairza (Technical Society of OUTR)?",
    "options": [
      {
        "id": "opt_1",
        "text": "To collaborate on real multidisciplinary projects (drones, apps, design), gain peer mentorship, and build meaningful technology."
      },
      {
        "id": "opt_2",
        "text": "Only to add a certificate line on my CV without participating actively."
      },
      {
        "id": "opt_3",
        "text": "Because my classmates forced me to fill the form."
      },
      {
        "id": "opt_4",
        "text": "To attend social gatherings exclusively."
      }
    ]
  },
  {
    "id": 29,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "You are assigned a task involving a framework or microcontroller tool you have never touched before. What is your course of action?",
    "options": [
      {
        "id": "opt_1",
        "text": "Refuse the assignment until someone conducts a personal lecture for you."
      },
      {
        "id": "opt_2",
        "text": "Explore the official documentation, experiment with starter repos, and ask targeted questions to seniors when stuck."
      },
      {
        "id": "opt_3",
        "text": "Wait for the deadline to pass and state that it wasn't taught in the college syllabus."
      },
      {
        "id": "opt_4",
        "text": "Copy code from an untrusted source without understanding how it works."
      }
    ]
  },
  {
    "id": 30,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "Club induction requires dedicating 5-8 hours per week to workshops, lab sessions, and internal hackathons alongside college coursework. How do you balance this?",
    "options": [
      {
        "id": "opt_1",
        "text": "Prioritize structured time-blocking, stay disciplined with coursework deadlines, and treat club sessions as high-priority skill-building."
      },
      {
        "id": "opt_2",
        "text": "Skip all academic lectures to spend time in the club lab."
      },
      {
        "id": "opt_3",
        "text": "Promise commitment now, but stop showing up after induction."
      },
      {
        "id": "opt_4",
        "text": "Complain that engineering doesn't leave room for extracurricular development."
      }
    ]
  },
  {
    "id": 31,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "In a row of students, Rakesh is 12th from the left and Suman is 17th from the right. If they interchange their positions, Rakesh becomes 22nd from the left. How many students are there in the row?",
    "options": [
      {
        "id": "opt_1",
        "text": "37"
      },
      {
        "id": "opt_2",
        "text": "38"
      },
      {
        "id": "opt_3",
        "text": "39"
      },
      {
        "id": "opt_4",
        "text": "40"
      }
    ]
  },
  {
    "id": 32,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "If P is the brother of Q, Q is the sister of R, and R is the father of S, how is P related to S?",
    "options": [
      {
        "id": "opt_1",
        "text": "Father"
      },
      {
        "id": "opt_2",
        "text": "Paternal Uncle"
      },
      {
        "id": "opt_3",
        "text": "Brother"
      },
      {
        "id": "opt_4",
        "text": "Grandfather"
      }
    ]
  },
  {
    "id": 33,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "What is the angle between the hour hand and minute hand of an analog clock at 3:40?",
    "options": [
      {
        "id": "opt_1",
        "text": "120°"
      },
      {
        "id": "opt_2",
        "text": "130°"
      },
      {
        "id": "opt_3",
        "text": "140°"
      },
      {
        "id": "opt_4",
        "text": "125°"
      }
    ]
  },
  {
    "id": 34,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Find the missing term in the sequence: 7, 26, 63, 124, 215, ?",
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
        "text": "328"
      },
      {
        "id": "opt_4",
        "text": "511"
      }
    ]
  },
  {
    "id": 35,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Five club members (A, B, C, D, E) sit in a circle facing the center. A is between E and C. B is to the immediate right of E. Who is to the immediate left of C?",
    "options": [
      {
        "id": "opt_1",
        "text": "A"
      },
      {
        "id": "opt_2",
        "text": "D"
      },
      {
        "id": "opt_3",
        "text": "B"
      },
      {
        "id": "opt_4",
        "text": "E"
      }
    ]
  },
  {
    "id": 36,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "If 'ROBOT' is encoded as 'TQDOT' in a specific cipher, how is 'DRONE' encoded using the same rule?",
    "options": [
      {
        "id": "opt_1",
        "text": "FTQPG"
      },
      {
        "id": "opt_2",
        "text": "ESPOF"
      },
      {
        "id": "opt_3",
        "text": "FTPOG"
      },
      {
        "id": "opt_4",
        "text": "FTQOG"
      }
    ]
  },
  {
    "id": 37,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Statement: All algorithms are logic. No logic is emotional. Conclusion I: No algorithm is emotional. Conclusion II: Some logic is an algorithm.",
    "options": [
      {
        "id": "opt_1",
        "text": "Only Conclusion I follows"
      },
      {
        "id": "opt_2",
        "text": "Only Conclusion II follows"
      },
      {
        "id": "opt_3",
        "text": "Neither follows"
      },
      {
        "id": "opt_4",
        "text": "Both Conclusion I and II follow"
      }
    ]
  },
  {
    "id": 38,
    "section": "logical",
    "sectionTitle": "Part 1: Logical Reasoning",
    "prompt": "Pointing to a photograph of a drone designer, Ananya says: 'His mother is the only daughter of my mother.' How is Ananya related to the designer?",
    "options": [
      {
        "id": "opt_1",
        "text": "Sister"
      },
      {
        "id": "opt_2",
        "text": "Mother"
      },
      {
        "id": "opt_3",
        "text": "Aunt"
      },
      {
        "id": "opt_4",
        "text": "Grandmother"
      }
    ]
  },
  {
    "id": 39,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Computing Architectures)",
    "prompt": "In modern computing, what is the fundamental conceptual difference between a CPU and a GPU?",
    "options": [
      {
        "id": "opt_1",
        "text": "A CPU has a few powerful cores optimized for complex sequential tasks, while a GPU has thousands of smaller cores built for simultaneous parallel math (graphics & AI)"
      },
      {
        "id": "opt_2",
        "text": "CPUs only process audio signals; GPUs only process letters"
      },
      {
        "id": "opt_3",
        "text": "A CPU is inside the screen; a GPU is inside the mouse"
      },
      {
        "id": "opt_4",
        "text": "A CPU requires liquid cooling; a GPU never gets warm"
      }
    ]
  },
  {
    "id": 40,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Geography & History)",
    "prompt": "Why is California's famous tech hub called 'Silicon Valley'?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because the region pioneered silicon semiconductor microchips and transistors that sparked the modern computer revolution"
      },
      {
        "id": "opt_2",
        "text": "Because of large silicon sand dunes along its beaches"
      },
      {
        "id": "opt_3",
        "text": "Because early computer screens were made of kitchen silicone baking molds"
      },
      {
        "id": "opt_4",
        "text": "It was named after an early valley pioneer named John Silicon"
      }
    ]
  },
  {
    "id": 41,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Fun Riddle)",
    "prompt": "Tech Riddle: 'You talk to me in English, and I write essays, solve physics puzzles, and write code. But I don't possess a human brain—I just predict the most statistically probable next word. What am I?'",
    "options": [
      {
        "id": "opt_1",
        "text": "A Large Language Model (Generative AI)"
      },
      {
        "id": "opt_2",
        "text": "An Excel Spreadsheet"
      },
      {
        "id": "opt_3",
        "text": "A Microwave Oven"
      },
      {
        "id": "opt_4",
        "text": "A Laser Printer"
      }
    ]
  },
  {
    "id": 42,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Everyday Privacy)",
    "prompt": "What does 'Incognito Mode' or 'Private Browsing' in web browsers actually guarantee?",
    "options": [
      {
        "id": "opt_1",
        "text": "It stops your device from saving your browsing history, site cookies, and form data locally after closing the window"
      },
      {
        "id": "opt_2",
        "text": "It hides your location from your Wi-Fi provider, college network, and government completely"
      },
      {
        "id": "opt_3",
        "text": "It blocks someone physically standing behind you from seeing your monitor"
      },
      {
        "id": "opt_4",
        "text": "It doubles your home internet bandwidth"
      }
    ]
  },
  {
    "id": 43,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (AI Milestones)",
    "prompt": "In 1997, which IBM supercomputer stunned the world by defeating the reigning World Chess Champion Garry Kasparov in a classical match?",
    "options": [
      {
        "id": "opt_1",
        "text": "Deep Blue"
      },
      {
        "id": "opt_2",
        "text": "AlphaGo"
      },
      {
        "id": "opt_3",
        "text": "Watson"
      },
      {
        "id": "opt_4",
        "text": "Skynet"
      }
    ]
  },
  {
    "id": 44,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Current Space Tech)",
    "prompt": "Which aerospace company founded by Elon Musk revolutionized rocket launches by landing orbital Falcon 9 boosters upright on ocean autonomous drone ships so they can be reflown?",
    "options": [
      {
        "id": "opt_1",
        "text": "SpaceX"
      },
      {
        "id": "opt_2",
        "text": "Blue Origin"
      },
      {
        "id": "opt_3",
        "text": "Boeing Starliner"
      },
      {
        "id": "opt_4",
        "text": "Virgin Galactic"
      }
    ]
  },
  {
    "id": 45,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Tech Trivia)",
    "prompt": "What was Google's original research project name when founders Larry Page and Sergey Brin started developing the search engine at Stanford University in 1996?",
    "options": [
      {
        "id": "opt_1",
        "text": "BackRub (named after analyzing web backlinks)"
      },
      {
        "id": "opt_2",
        "text": "Yahoo! Junior"
      },
      {
        "id": "opt_3",
        "text": "WebCrawler"
      },
      {
        "id": "opt_4",
        "text": "Ask Jeeves"
      }
    ]
  },
  {
    "id": 46,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Units & Measurement)",
    "prompt": "Tech Trivia: If a single binary digit (0 or 1) is called a 'bit', what is a group of 8 bits traditionally called in computer memory?",
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
        "text": "A Pixel"
      },
      {
        "id": "opt_4",
        "text": "A Word"
      }
    ]
  },
  {
    "id": 47,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Cybersecurity Basics)",
    "prompt": "Why is Two-Factor Authentication (2FA) strongly recommended for personal college and email accounts?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because even if an attacker steals or guesses your password, they still cannot gain access without your secondary phone code or physical security key"
      },
      {
        "id": "opt_2",
        "text": "Because it makes web pages load twice as fast"
      },
      {
        "id": "opt_3",
        "text": "Because it lets you share passwords with classmates without risk"
      },
      {
        "id": "opt_4",
        "text": "Because it prevents your computer from getting physical dust"
      }
    ]
  },
  {
    "id": 48,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics)",
    "prompt": "Boston Dynamics produces viral YouTube videos showing robots dancing, backflipping, and inspecting industrial sites. What is the name of their famous 4-legged yellow robot dog?",
    "options": [
      {
        "id": "opt_1",
        "text": "Spot"
      },
      {
        "id": "opt_2",
        "text": "Atlas"
      },
      {
        "id": "opt_3",
        "text": "Optimus"
      },
      {
        "id": "opt_4",
        "text": "BigDog"
      }
    ]
  },
  {
    "id": 49,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Internet History)",
    "prompt": "What was the name of the revolutionary network created in 1969 by the US Department of Defense that sent the first host-to-host message ('LO') and laid the groundwork for today's Internet?",
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
        "text": "World Wide Web"
      }
    ]
  },
  {
    "id": 50,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Fun Keyboard Shortcut)",
    "prompt": "Tech Riddle: 'Press us together on Windows, and we summon the Task Manager, unlock screens, or help reboot when applications freeze up. What legendary trio of keys are we?'",
    "options": [
      {
        "id": "opt_1",
        "text": "Ctrl + Alt + Delete"
      },
      {
        "id": "opt_2",
        "text": "Shift + Tab + Enter"
      },
      {
        "id": "opt_3",
        "text": "Alt + F4 + Space"
      },
      {
        "id": "opt_4",
        "text": "Ctrl + Z + Y"
      }
    ]
  },
  {
    "id": 51,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Cloud Computing)",
    "prompt": "People frequently say photos or code are stored 'in the Cloud' (AWS, Google Cloud, Azure). What does 'The Cloud' physically mean?",
    "options": [
      {
        "id": "opt_1",
        "text": "Massive air-conditioned warehouses full of high-performance server computers connected globally across the Internet"
      },
      {
        "id": "opt_2",
        "text": "Data converted into radio signals permanently floating in clouds in the atmosphere"
      },
      {
        "id": "opt_3",
        "text": "External hard drives strapped to weather balloons"
      },
      {
        "id": "opt_4",
        "text": "A futuristic quantum dimension inside monitors"
      }
    ]
  },
  {
    "id": 52,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Programming Trivia)",
    "prompt": "Guido van Rossum created the popular Python programming language in 1991. What was the name 'Python' actually inspired by?",
    "options": [
      {
        "id": "opt_1",
        "text": "The British comedy television sketch show 'Monty Python's Flying Circus'"
      },
      {
        "id": "opt_2",
        "text": "The dangerous African rock python snake in his garden"
      },
      {
        "id": "opt_3",
        "text": "His daughter's favorite pet reptile"
      },
      {
        "id": "opt_4",
        "text": "An anagram of 'Typing On'"
      }
    ]
  },
  {
    "id": 53,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "During a 24-hour hackathon or lab build, your teammate is feeling overwhelmed and struggling to finish their module. What is your reaction?",
    "options": [
      {
        "id": "opt_1",
        "text": "Sit together, break down the remaining blocker into smaller tasks, pair-program to solve it, and encourage them"
      },
      {
        "id": "opt_2",
        "text": "Publicly complain to mentors that they are slowing down your team"
      },
      {
        "id": "opt_3",
        "text": "Abandon the project and leave the room"
      },
      {
        "id": "opt_4",
        "text": "Pretend nothing is wrong and wait until the deadline passes"
      }
    ]
  },
  {
    "id": 54,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "Ten minutes before a live demonstration in front of faculty and guests, you discover a bug that occasionally crashes the platform. What do you do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Calmly inform your team leads, identify the root crash trigger, implement a defensive fallback/safe mode, and be transparent during the demo"
      },
      {
        "id": "opt_2",
        "text": "Blame a teammate who isn't present"
      },
      {
        "id": "opt_3",
        "text": "Turn off the equipment and pretend power failed"
      },
      {
        "id": "opt_4",
        "text": "Silently delete the error logs so nobody knows"
      }
    ]
  },
  {
    "id": 55,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "A senior mentor provides direct, constructive criticism highlighting major flaws in your circuit schematic or code architecture. How do you respond?",
    "options": [
      {
        "id": "opt_1",
        "text": "Welcome the technical critique, ask targeted questions to understand the best engineering practice, and iterate on the design"
      },
      {
        "id": "opt_2",
        "text": "Take it as a personal insult and stop attending club sessions"
      },
      {
        "id": "opt_3",
        "text": "Argue aggressively without looking at the technical data"
      },
      {
        "id": "opt_4",
        "text": "Agree verbally but never make the changes"
      }
    ]
  },
  {
    "id": 56,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "What does the Zairza motto 'Wonder • Think • Create' mean to you as an engineer at OUTR?",
    "options": [
      {
        "id": "opt_1",
        "text": "Cultivating curiosity, applying deep first-principles thinking, and turning bold ideas into impactful, functioning reality"
      },
      {
        "id": "opt_2",
        "text": "Memorizing textbook definitions for exam marks"
      },
      {
        "id": "opt_3",
        "text": "Waiting for instructions without initiating anything yourself"
      },
      {
        "id": "opt_4",
        "text": "Just a catchy social media slogan"
      }
    ]
  },
  {
    "id": 57,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "How do you balance high-tempo club projects with mid-term examinations and regular university academic coursework?",
    "options": [
      {
        "id": "opt_1",
        "text": "Plan ahead with structured weekly calendars, stay on top of coursework daily, and dedicate focused lab hours without last-minute panic"
      },
      {
        "id": "opt_2",
        "text": "Bunk all semester lectures"
      },
      {
        "id": "opt_3",
        "text": "Drop out of all extracurricular activities permanently"
      },
      {
        "id": "opt_4",
        "text": "Leave both studies and club tasks until the night before"
      }
    ]
  },
  {
    "id": 58,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "A fresher or classmate asks you for help understanding a programming or circuit concept that you are already proficient in. How do you handle it?",
    "options": [
      {
        "id": "opt_1",
        "text": "Patiently explain the intuition, guide them to write or build it themselves, and point them to good documentation"
      },
      {
        "id": "opt_2",
        "text": "Refuse to share knowledge to protect your competitive edge"
      },
      {
        "id": "opt_3",
        "text": "Do their entire work for them so they learn nothing"
      },
      {
        "id": "opt_4",
        "text": "Make fun of them for not knowing the concept"
      }
    ]
  },
  {
    "id": 59,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "Why is multi-disciplinary collaboration (Software + Hardware + Design + Robotics) critical for modern innovation at Zairza?",
    "options": [
      {
        "id": "opt_1",
        "text": "Because groundbreaking tech products require hardware sensors, intelligent algorithms, robust cloud backends, and intuitive human interfaces working harmoniously"
      },
      {
        "id": "opt_2",
        "text": "It isn't; every wing should remain in total isolation"
      },
      {
        "id": "opt_3",
        "text": "Only software matters in modern engineering"
      },
      {
        "id": "opt_4",
        "text": "Just to increase club headcount"
      }
    ]
  },
  {
    "id": 60,
    "section": "hr",
    "sectionTitle": "Part 3: HR & Cultural Alignment",
    "prompt": "The team votes on two competing architectural designs for an induction project, and your favorite proposal is not chosen. What is your attitude?",
    "options": [
      {
        "id": "opt_1",
        "text": "Disagree and commit: fully back the team's chosen decision and contribute 100% of your energy to execute it successfully"
      },
      {
        "id": "opt_2",
        "text": "Actively sabotage the chosen design so your idea looks better"
      },
      {
        "id": "opt_3",
        "text": "Stop contributing to the team"
      },
      {
        "id": "opt_4",
        "text": "Complain repeatedly during team meetings"
      }
    ]
  }
];

// ==============================================================================
// SECURED ISOLATED ANSWER KEYS TABLE (Server-side / Post-15min Evaluation)
// ==============================================================================
export const QUIZ_ANSWER_KEYS = {
  "1": {
    "correctOptionId": "opt_1",
    "explanation": "Each letter is shifted forward: Z(+1)->A, A(+2)->C, I(+2)->K, R(+2)->T, Z(+2)->B, A(+2)->C. Following the +1, +2, +2, +2 pattern, I(+1)->K, N(+2)->P, D(+2)->F, U(+2)->W, C(+2)->E, T(+2)->V."
  },
  "2": {
    "correctOptionId": "opt_3",
    "explanation": "These are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime number is 17, and 17^2 = 289."
  },
  "3": {
    "correctOptionId": "opt_2",
    "explanation": "1 robot takes 5 minutes to assemble 1 board. Hence, 100 robots working concurrently will finish 100 boards in 5 minutes."
  },
  "4": {
    "correctOptionId": "opt_3",
    "explanation": "Neither conclusion is guaranteed by classical syllogistic deduction."
  },
  "5": {
    "correctOptionId": "opt_2",
    "explanation": "Horizontal displacement = sqrt(12^2 + 5^2) = 13m. Total 3D displacement = sqrt(13^2 + 13^2) = 13*sqrt(2) approx 18.38m."
  },
  "6": {
    "correctOptionId": "opt_2",
    "explanation": "The analogy is binary representation to base-10 decimal integer: 10001 in binary = 16 + 1 = 17."
  },
  "7": {
    "correctOptionId": "opt_2",
    "explanation": "Arranging clockwise around the circle: A -> B -> F -> D -> E -> C. The person to the immediate left of D (facing center) is E."
  },
  "8": {
    "correctOptionId": "opt_2",
    "explanation": "Hour hand moves 0.5 degrees per minute. In 15 minutes, it moves 7.5 degrees past the 3 o'clock mark."
  },
  "9": {
    "correctOptionId": "opt_2",
    "explanation": "n*(n-1)/2 = 28 => n*(n-1) = 56 => 8 * 7 = 56. Hence n = 8."
  },
  "10": {
    "correctOptionId": "opt_4",
    "explanation": "The first three are software language translation tools; Microcontroller is an integrated hardware component."
  },
  "11": {
    "correctOptionId": "opt_1",
    "explanation": "In 1947, computer pioneer Grace Hopper recorded an actual moth taped into the Harvard Mark II logbook as the 'First actual case of bug being found'."
  },
  "12": {
    "correctOptionId": "opt_1",
    "explanation": "GPT stands for Generative Pre-trained Transformer, an AI model architecture introduced by Google researchers in 2017 and expanded by OpenAI."
  },
  "13": {
    "correctOptionId": "opt_1",
    "explanation": "Ada Lovelace wrote an algorithm in 1843 to calculate Bernoulli numbers on Babbage's Analytical Engine, making her the world's first programmer."
  },
  "14": {
    "correctOptionId": "opt_1",
    "explanation": "RAM is volatile memory: it provides ultra-fast temporary working memory to the CPU while powered on, but wipes completely upon shutdown."
  },
  "15": {
    "correctOptionId": "opt_1",
    "explanation": "NVIDIA's specialized graphics chips (like H100 and B200) execute matrix math in parallel, making them indispensable for training modern AI models."
  },
  "16": {
    "correctOptionId": "opt_1",
    "explanation": "Silicon Valley folklore is filled with garage beginnings: Jobs & Wozniak in Los Altos, Page & Brin in Susan Wojcicki's Menlo Park garage, and Bezos in Bellevue."
  },
  "17": {
    "correctOptionId": "opt_1",
    "explanation": "HTTP 404 Not Found is a standard web protocol client-side error status indicating that the browser could communicate with the server, but the requested page does not exist."
  },
  "18": {
    "correctOptionId": "opt_1",
    "explanation": "National Payments Corporation of India (NPCI) launched UPI in 2016, enabling instant mobile payments across competing banks."
  },
  "19": {
    "correctOptionId": "opt_1",
    "explanation": "The Chandrayaan-3 lander was named Vikram (after Dr. Vikram Sarabhai), while the robotic surface rover was named Pragyan ('Wisdom')."
  },
  "20": {
    "correctOptionId": "opt_1",
    "explanation": "Over 99% of global internet traffic travels through underwater fiber-optic submarine cables laid across ocean floors using pulses of laser light."
  },
  "21": {
    "correctOptionId": "opt_1",
    "explanation": "USB Type-C (reversible connector, high-speed data, and USB Power Delivery) has been adopted as the common standard to eliminate e-waste."
  },
  "22": {
    "correctOptionId": "opt_1",
    "explanation": "Linus Torvalds released the Linux kernel as free open-source software in 1991. It now powers the Android OS, cloud web servers, and supercomputers."
  },
  "23": {
    "correctOptionId": "opt_1",
    "explanation": "SSDs have no mechanical spinning parts or latency-heavy read heads, delivering read speeds exceeding 5,000 MB/s compared to ~120 MB/s for mechanical HDDs."
  },
  "24": {
    "correctOptionId": "opt_1",
    "explanation": "A computer keyboard features character keys, the Space bar, the Enter key, and the Escape key!"
  },
  "25": {
    "correctOptionId": "opt_1",
    "explanation": "Open-source software provides access to human-readable source code, allowing developers worldwide to audit security, fix bugs, and create modifications."
  },
  "26": {
    "correctOptionId": "opt_1",
    "explanation": "Team empathy, active collaboration, and supportive problem-solving define great club culture."
  },
  "27": {
    "correctOptionId": "opt_1",
    "explanation": "Engineering integrity means transparency, quick mitigation, and staying composed under pressure."
  },
  "28": {
    "correctOptionId": "opt_1",
    "explanation": "Constructive feedback from experienced peers is the fastest catalyst for technical growth."
  },
  "29": {
    "correctOptionId": "opt_1",
    "explanation": "Wonder, Think, Create represents the journey from curiosity to deep logic to real hardware/software creation."
  },
  "30": {
    "correctOptionId": "opt_1",
    "explanation": "Time-blocking, self-discipline, and early planning allow engineering students to excel at both academics and innovation."
  },
  "31": {
    "correctOptionId": "opt_2",
    "explanation": "Total students = Left position + Right position - 1 = 22 + 17 - 1 = 38."
  },
  "32": {
    "correctOptionId": "opt_2",
    "explanation": "R is the father of S, and P is the brother of R (since P is brother of Q, Q is sister of R). Hence, P is the paternal uncle of S."
  },
  "33": {
    "correctOptionId": "opt_2",
    "explanation": "Angle = |30*H - 5.5*M| = |30(3) - 5.5(40)| = |90 - 220| = 130°."
  },
  "34": {
    "correctOptionId": "opt_1",
    "explanation": "Pattern is n^3 - 1: 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1=342."
  },
  "35": {
    "correctOptionId": "opt_1",
    "explanation": "In circular arrangement facing center, A is between E and C, so to immediate left of C is A."
  },
  "36": {
    "correctOptionId": "opt_1",
    "explanation": "Pattern shifts letters: R(+2)->T, O(+2)->Q, B(+2)->D, O(+0), T(+0) -> similarly D(+2)->F, R(+2)->T, O(+2)->Q, N(+2)->P, E(+2)->G => FTQPG."
  },
  "37": {
    "correctOptionId": "opt_4",
    "explanation": "Since all algorithms are logic and no logic is emotional, no algorithm is emotional (I). Also, if all algorithms are logic, some logic must be algorithms (II)."
  },
  "38": {
    "correctOptionId": "opt_2",
    "explanation": "Only daughter of Ananya's mother is Ananya herself. Hence Ananya is his mother."
  },
  "39": {
    "correctOptionId": "opt_1",
    "explanation": "CPUs handle complex branching logic with low latency; GPUs compute thousands of repetitive mathematical vector calculations concurrently."
  },
  "40": {
    "correctOptionId": "opt_1",
    "explanation": "Journalist Don Hoefler coined 'Silicon Valley' in 1971 because silicon is the base element for semiconductors made by Fairchild, Intel, and AMD."
  },
  "41": {
    "correctOptionId": "opt_1",
    "explanation": "LLMs like Claude, GPT-4, and Gemini use deep transformer neural networks to calculate statistical token probabilities without sentience."
  },
  "42": {
    "correctOptionId": "opt_1",
    "explanation": "Incognito only clears local browser cache, cookies, and history when closed; it does not cloak traffic from your school Wi-Fi or website servers."
  },
  "43": {
    "correctOptionId": "opt_1",
    "explanation": "IBM Deep Blue defeated World Champion Garry Kasparov 3.5–2.5 in May 1997, calculating up to 200 million positions per second."
  },
  "44": {
    "correctOptionId": "opt_1",
    "explanation": "SpaceX's autonomous rocket recovery has flown individual Falcon 9 first stages over 20+ times each, dramatically lowering the cost of spaceflight."
  },
  "45": {
    "correctOptionId": "opt_1",
    "explanation": "BackRub was Google's original 1996 name because the PageRank algorithm estimated website importance by tracking backlinks."
  },
  "46": {
    "correctOptionId": "opt_1",
    "explanation": "8 bits = 1 byte. (4 bits is called a 'nibble'). A byte can represent 256 unique numbers (from 0 to 255), enough for one ASCII character."
  },
  "47": {
    "correctOptionId": "opt_1",
    "explanation": "2FA combines something you know (password) with something you physically have (phone, authenticator app, or YubiKey), blocking 99% of automated credential stuffing."
  },
  "48": {
    "correctOptionId": "opt_1",
    "explanation": "Spot is Boston Dynamics' commercial quadruped robot used worldwide for autonomous plant inspections and disaster search-and-rescue."
  },
  "49": {
    "correctOptionId": "opt_1",
    "explanation": "ARPANET (Advanced Research Projects Agency Network) launched packet-switching communications between UCLA and Stanford in October 1969."
  },
  "50": {
    "correctOptionId": "opt_1",
    "explanation": "David Bradley designed Ctrl+Alt+Del for the original IBM PC as a quick hardware interrupt reset without cycling the power switch."
  },
  "51": {
    "correctOptionId": "opt_1",
    "explanation": "Cloud services are physical hyperscale data centers with miles of server racks and redundant power backups that you rent remotely over fiber cables."
  },
  "52": {
    "correctOptionId": "opt_1",
    "explanation": "Guido van Rossum was a fan of the BBC comedy show 'Monty Python's Flying Circus' and named the language to make programming feel fun and lighthearted."
  },
  "53": {
    "correctOptionId": "opt_1",
    "explanation": "Team empathy, active collaboration, and supportive problem-solving define great club culture."
  },
  "54": {
    "correctOptionId": "opt_1",
    "explanation": "Engineering integrity means transparency, quick mitigation, and staying composed under pressure."
  },
  "55": {
    "correctOptionId": "opt_1",
    "explanation": "Constructive feedback from experienced peers is the fastest catalyst for technical growth."
  },
  "56": {
    "correctOptionId": "opt_1",
    "explanation": "Wonder, Think, Create represents the journey from curiosity to deep logic to real hardware/software creation."
  },
  "57": {
    "correctOptionId": "opt_1",
    "explanation": "Time-blocking, self-discipline, and early planning allow engineering students to excel at both academics and innovation."
  },
  "58": {
    "correctOptionId": "opt_1",
    "explanation": "Peer mentorship and open knowledge-sharing are the foundational pillars of Zairza."
  },
  "59": {
    "correctOptionId": "opt_1",
    "explanation": "Real-world engineering triumphs occur at the intersection of mechanical, electrical, software, and design disciplines."
  },
  "60": {
    "correctOptionId": "opt_1",
    "explanation": "Disagree and commit: professional teams debate ideas openly, but execute the collective decision with 100% solidarity."
  }
};

export const INITIAL_CANDIDATES = [
  {
    "rollNumber": "2401106042",
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
    "rollNumber": "2401106118",
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
    "rollNumber": "2401106205",
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
    "action": "CURRICULUM_REFRESH",
    "admin": "Super Admin",
    "details": "Refreshed Tech Knowledge section for 1st Year Freshers (Tech History, Fun Riddles, AI & Space News).",
    "timestamp": "2026-09-29 22:15"
  }
];
