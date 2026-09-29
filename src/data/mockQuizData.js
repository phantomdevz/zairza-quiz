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
      "name": "Part 2: Tech Knowledge",
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
// Random questions drawn from each section for each candidate
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
    "sectionTitle": "Part 2: Tech Knowledge (Software & Systems)",
    "prompt": "In Git, what is the key difference between 'git pull' and 'git fetch'?",
    "options": [
      {
        "id": "opt_1",
        "text": "'git fetch' downloads commits and immediately merges them into working tree."
      },
      {
        "id": "opt_2",
        "text": "'git pull' executes 'git fetch' followed by 'git merge' into the active branch."
      },
      {
        "id": "opt_3",
        "text": "'git pull' only works on the main branch, whereas fetch works everywhere."
      },
      {
        "id": "opt_4",
        "text": "'git fetch' deletes local branches that no longer exist on remote."
      }
    ]
  },
  {
    "id": 12,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Software & Algorithms)",
    "prompt": "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
    "options": [
      {
        "id": "opt_1",
        "text": "O(1)"
      },
      {
        "id": "opt_2",
        "text": "O(log N)"
      },
      {
        "id": "opt_3",
        "text": "O(N)"
      },
      {
        "id": "opt_4",
        "text": "O(N log N)"
      }
    ]
  },
  {
    "id": 13,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics & IoT)",
    "prompt": "Which communication protocol is full-duplex, synchronous, uses master-slave architecture, and relies on 4 lines (MISO, MOSI, SCK, SS)?",
    "options": [
      {
        "id": "opt_1",
        "text": "I2C"
      },
      {
        "id": "opt_2",
        "text": "UART"
      },
      {
        "id": "opt_3",
        "text": "SPI"
      },
      {
        "id": "opt_4",
        "text": "CAN Bus"
      }
    ]
  },
  {
    "id": 14,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics & Hardware)",
    "prompt": "What is the primary role of an H-bridge circuit in mobile robotics?",
    "options": [
      {
        "id": "opt_1",
        "text": "To amplify radio frequency signals from RC controller"
      },
      {
        "id": "opt_2",
        "text": "To allow DC motors to run in both forward and reverse directions"
      },
      {
        "id": "opt_3",
        "text": "To convert 5V DC into 220V AC for microcontrollers"
      },
      {
        "id": "opt_4",
        "text": "To filter electromagnetic interference from sensors"
      }
    ]
  },
  {
    "id": 15,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Design & UI/UX)",
    "prompt": "According to Fitts's Law in UI/UX design, what two factors determine the time required to rapidly move to a target area?",
    "options": [
      {
        "id": "opt_1",
        "text": "Color contrast and typography weight"
      },
      {
        "id": "opt_2",
        "text": "Distance to the target and target size/width"
      },
      {
        "id": "opt_3",
        "text": "Viewport refresh rate and finger pressure"
      },
      {
        "id": "opt_4",
        "text": "Shadow blur radius and animation duration"
      }
    ]
  },
  {
    "id": 16,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Software & Web)",
    "prompt": "In modern JavaScript / React, what is the key difference between 'localStorage' and 'sessionStorage'?",
    "options": [
      {
        "id": "opt_1",
        "text": "localStorage data persists until explicitly cleared, while sessionStorage expires when browser tab closes."
      },
      {
        "id": "opt_2",
        "text": "sessionStorage holds up to 50MB, whereas localStorage only holds 5KB."
      },
      {
        "id": "opt_3",
        "text": "localStorage is accessible only over HTTPS; sessionStorage works on HTTP."
      },
      {
        "id": "opt_4",
        "text": "sessionStorage can be accessed by server headers; localStorage cannot."
      }
    ]
  },
  {
    "id": 17,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics & Sensors)",
    "prompt": "Which sensor would you use to calculate both the angular velocity and linear acceleration of an autonomous drone?",
    "options": [
      {
        "id": "opt_1",
        "text": "HC-SR04 Ultrasonic Sensor"
      },
      {
        "id": "opt_2",
        "text": "6-DoF IMU (Inertial Measurement Unit like MPU6050)"
      },
      {
        "id": "opt_3",
        "text": "LDR (Light Dependent Resistor)"
      },
      {
        "id": "opt_4",
        "text": "PIR Motion Sensor"
      }
    ]
  },
  {
    "id": 18,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Design & Systems)",
    "prompt": "What does the 60-30-10 color rule in UI and brand design prescribe?",
    "options": [
      {
        "id": "opt_1",
        "text": "60% font size, 30% line height, 10% letter spacing"
      },
      {
        "id": "opt_2",
        "text": "60% dominant base color, 30% secondary/surface color, 10% accent color"
      },
      {
        "id": "opt_3",
        "text": "60% imagery, 30% text, 10% whitespace"
      },
      {
        "id": "opt_4",
        "text": "60% dark mode, 30% light mode, 10% high-contrast mode"
      }
    ]
  },
  {
    "id": 19,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Software & Networking)",
    "prompt": "Which HTTP status code is returned when a requested client resource requires authentication or permission is denied?",
    "options": [
      {
        "id": "opt_1",
        "text": "301 Moved Permanently"
      },
      {
        "id": "opt_2",
        "text": "403 Forbidden"
      },
      {
        "id": "opt_3",
        "text": "502 Bad Gateway"
      },
      {
        "id": "opt_4",
        "text": "204 No Content"
      }
    ]
  },
  {
    "id": 20,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Computer Science)",
    "prompt": "Which data structure follows the LIFO (Last-In, First-Out) principle and is used for function call stacks?",
    "options": [
      {
        "id": "opt_1",
        "text": "Queue"
      },
      {
        "id": "opt_2",
        "text": "Stack"
      },
      {
        "id": "opt_3",
        "text": "Priority Queue"
      },
      {
        "id": "opt_4",
        "text": "Circular Buffer"
      }
    ]
  },
  {
    "id": 21,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics & IoT)",
    "prompt": "On an ESP32 or Arduino board, what does PWM (Pulse Width Modulation) allow you to do with a digital output pin?",
    "options": [
      {
        "id": "opt_1",
        "text": "Simulate variable analog voltage output by rapidly cycling on/off duty cycle"
      },
      {
        "id": "opt_2",
        "text": "Double the processor clock frequency dynamically"
      },
      {
        "id": "opt_3",
        "text": "Read ambient atmospheric pressure directly"
      },
      {
        "id": "opt_4",
        "text": "Connect to Wi-Fi without antennas"
      }
    ]
  },
  {
    "id": 22,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Software & Database)",
    "prompt": "In relational databases, what does the ACID acronym stand for?",
    "options": [
      {
        "id": "opt_1",
        "text": "Asynchronous, Consistent, Indexed, Distributed"
      },
      {
        "id": "opt_2",
        "text": "Atomicity, Consistency, Isolation, Durability"
      },
      {
        "id": "opt_3",
        "text": "Authentication, Cryptography, Integrity, Decryption"
      },
      {
        "id": "opt_4",
        "text": "Automated, Clustered, Integrated, Dynamic"
      }
    ]
  },
  {
    "id": 23,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Design & Graphics)",
    "prompt": "What is the primary advantage of SVG (Scalable Vector Graphics) over raster formats like PNG and JPEG?",
    "options": [
      {
        "id": "opt_1",
        "text": "SVGs can store audio clips inside them"
      },
      {
        "id": "opt_2",
        "text": "SVGs scale to any screen resolution without loss of clarity or pixelation"
      },
      {
        "id": "opt_3",
        "text": "SVGs require specialized GPU hardware to render"
      },
      {
        "id": "opt_4",
        "text": "SVGs cannot be styled with CSS"
      }
    ]
  },
  {
    "id": 24,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Software Development)",
    "prompt": "What does the command 'git commit -m \"message\"' do?",
    "options": [
      {
        "id": "opt_1",
        "text": "Pushes local files directly to GitHub"
      },
      {
        "id": "opt_2",
        "text": "Records a snapshot of the staged changes in the local repository with a log message"
      },
      {
        "id": "opt_3",
        "text": "Discards all modified files since the last clone"
      },
      {
        "id": "opt_4",
        "text": "Creates a new branch named 'message'"
      }
    ]
  },
  {
    "id": 25,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics / Computing)",
    "prompt": "Which operating system framework is widely used in cutting-edge robotics for inter-process node messaging, publishers, and subscribers?",
    "options": [
      {
        "id": "opt_1",
        "text": "ROS (Robot Operating System)"
      },
      {
        "id": "opt_2",
        "text": "FreeDOS"
      },
      {
        "id": "opt_3",
        "text": "OpenWrt"
      },
      {
        "id": "opt_4",
        "text": "ReactOS"
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
    "sectionTitle": "Part 2: Tech Knowledge (Software Engineering)",
    "prompt": "Which Git command allows you to select a specific individual commit from another branch and apply it to your current working branch?",
    "options": [
      {
        "id": "opt_1",
        "text": "git rebase --onto"
      },
      {
        "id": "opt_2",
        "text": "git cherry-pick <commit-hash>"
      },
      {
        "id": "opt_3",
        "text": "git merge --squash"
      },
      {
        "id": "opt_4",
        "text": "git stash apply"
      }
    ]
  },
  {
    "id": 40,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Electronics & IoT)",
    "prompt": "In digital electronics and microcontrollers, what is the primary role of a pull-up or pull-down resistor on an input pin connected to a momentary button?",
    "options": [
      {
        "id": "opt_1",
        "text": "To prevent a floating high-impedance state and ensure a deterministic digital voltage level (HIGH or LOW)"
      },
      {
        "id": "opt_2",
        "text": "To amplify small wireless radio signals"
      },
      {
        "id": "opt_3",
        "text": "To speed up serial clock transmission"
      },
      {
        "id": "opt_4",
        "text": "To regulate USB power from 5V to 3.3V"
      }
    ]
  },
  {
    "id": 41,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Database & Systems)",
    "prompt": "What does the 'ACID' acronym stand for in relational database transactional processing?",
    "options": [
      {
        "id": "opt_1",
        "text": "Atomicity, Consistency, Isolation, Durability"
      },
      {
        "id": "opt_2",
        "text": "Access, Control, Indexing, Delivery"
      },
      {
        "id": "opt_3",
        "text": "Authentication, Cryptography, Integrity, Decryption"
      },
      {
        "id": "opt_4",
        "text": "Asynchronous, Cached, Idempotent, Distributed"
      }
    ]
  },
  {
    "id": 42,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Robotics)",
    "prompt": "Which sensor module integrates a 3-axis accelerometer and a 3-axis gyroscope to track angular velocity, roll, pitch, and yaw for rovers and drones?",
    "options": [
      {
        "id": "opt_1",
        "text": "IMU (Inertial Measurement Unit e.g. MPU6050)"
      },
      {
        "id": "opt_2",
        "text": "Ultrasonic HC-SR04"
      },
      {
        "id": "opt_3",
        "text": "DHT11 Humidity Sensor"
      },
      {
        "id": "opt_4",
        "text": "PIR Passive Infrared Detector"
      }
    ]
  },
  {
    "id": 43,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Algorithms)",
    "prompt": "What is the worst-case time complexity of searching for an item in a balanced self-sorting Binary Search Tree (like an AVL or Red-Black Tree)?",
    "options": [
      {
        "id": "opt_1",
        "text": "O(1)"
      },
      {
        "id": "opt_2",
        "text": "O(log n)"
      },
      {
        "id": "opt_3",
        "text": "O(n)"
      },
      {
        "id": "opt_4",
        "text": "O(n log n)"
      }
    ]
  },
  {
    "id": 44,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Web Development)",
    "prompt": "In modern React.js, which Hook is used to execute side effects such as data synchronization, subscriptions, or manual DOM adjustments?",
    "options": [
      {
        "id": "opt_1",
        "text": "useState"
      },
      {
        "id": "opt_2",
        "text": "useEffect"
      },
      {
        "id": "opt_3",
        "text": "useContext"
      },
      {
        "id": "opt_4",
        "text": "useMemo"
      }
    ]
  },
  {
    "id": 45,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Hardware Design)",
    "prompt": "Why are decoupling ceramic capacitors (typically 0.1 µF) placed as close as physically possible to the power pins of integrated circuits (ICs) on PCBs?",
    "options": [
      {
        "id": "opt_1",
        "text": "To bypass high-frequency voltage noise to ground and supply instantaneous local charge during clock switching"
      },
      {
        "id": "opt_2",
        "text": "To boost battery life by converting heat back to electricity"
      },
      {
        "id": "opt_3",
        "text": "To act as digital memory cells"
      },
      {
        "id": "opt_4",
        "text": "To radiate RF radio signals for telemetry"
      }
    ]
  },
  {
    "id": 46,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (UI/UX & CSS)",
    "prompt": "In modern responsive CSS, what does setting 'justify-content: space-between' on a flex container achieve?",
    "options": [
      {
        "id": "opt_1",
        "text": "Items are aligned flush against the top and bottom edges"
      },
      {
        "id": "opt_2",
        "text": "First item is on the start line, last on the end line, with equal space distributed between adjacent items"
      },
      {
        "id": "opt_3",
        "text": "All items are packed tightly in the exact center"
      },
      {
        "id": "opt_4",
        "text": "Items wrap automatically onto a new line"
      }
    ]
  },
  {
    "id": 47,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Computer Networks)",
    "prompt": "Which layer in the 7-layer OSI networking reference model provides end-to-end data transmission reliability, segment flow control, and port multiplexing?",
    "options": [
      {
        "id": "opt_1",
        "text": "Network Layer"
      },
      {
        "id": "opt_2",
        "text": "Transport Layer"
      },
      {
        "id": "opt_3",
        "text": "Data Link Layer"
      },
      {
        "id": "opt_4",
        "text": "Session Layer"
      }
    ]
  },
  {
    "id": 48,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Computer Vision & AI)",
    "prompt": "In convolutional neural networks (CNNs) and OpenCV edge detection, what mathematical operation slides a small matrix (kernel) across pixels to compute feature maps?",
    "options": [
      {
        "id": "opt_1",
        "text": "Matrix Convolution"
      },
      {
        "id": "opt_2",
        "text": "Euclidean Distance"
      },
      {
        "id": "opt_3",
        "text": "Fast Fourier Transform"
      },
      {
        "id": "opt_4",
        "text": "Singular Value Decomposition"
      }
    ]
  },
  {
    "id": 49,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Aeronautics & Drones)",
    "prompt": "Why do standard X-configuration quadcopters use two Clockwise (CW) and two Counter-Clockwise (CCW) rotating propellers rather than all four spinning in the same direction?",
    "options": [
      {
        "id": "opt_1",
        "text": "To cancel out aerodynamic reaction torque (yaw momentum) so the drone does not spin continuously in place"
      },
      {
        "id": "opt_2",
        "text": "Because CW motors use half as much electrical current as CCW motors"
      },
      {
        "id": "opt_3",
        "text": "To maintain forward momentum without using battery power"
      },
      {
        "id": "opt_4",
        "text": "To enable underwater navigation mode"
      }
    ]
  },
  {
    "id": 50,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Linux & DevOps)",
    "prompt": "Which Linux terminal utility provides an interactive, real-time visual monitor of system processes, CPU thread load, memory usage, and swap space?",
    "options": [
      {
        "id": "opt_1",
        "text": "ls -la"
      },
      {
        "id": "opt_2",
        "text": "htop / top"
      },
      {
        "id": "opt_3",
        "text": "grep -r"
      },
      {
        "id": "opt_4",
        "text": "chmod 777"
      }
    ]
  },
  {
    "id": 51,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Object-Oriented Programming)",
    "prompt": "Which core OOP pillar allows a child subclass to provide a specific, customized implementation of a method that is already declared in its parent class?",
    "options": [
      {
        "id": "opt_1",
        "text": "Polymorphism (Method Overriding)"
      },
      {
        "id": "opt_2",
        "text": "Encapsulation"
      },
      {
        "id": "opt_3",
        "text": "Data Hiding"
      },
      {
        "id": "opt_4",
        "text": "Static Compilation"
      }
    ]
  },
  {
    "id": 52,
    "section": "tech",
    "sectionTitle": "Part 2: Tech Knowledge (Embedded Protocols)",
    "prompt": "Comparing I2C and SPI serial communication buses on microcontrollers, which statement is physically correct?",
    "options": [
      {
        "id": "opt_1",
        "text": "I2C uses 2 lines (SDA/SCL) with addressing, while SPI uses 4 lines (MOSI/MISO/SCK/CS) and achieves significantly higher clock throughput"
      },
      {
        "id": "opt_2",
        "text": "SPI only works over optical fiber cables"
      },
      {
        "id": "opt_3",
        "text": "I2C requires 8 wires for parallel communication"
      },
      {
        "id": "opt_4",
        "text": "SPI does not use a master clock signal"
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
    "correctOptionId": "opt_2",
    "explanation": "git pull is a convenience command that downloads the remote changes (git fetch) and immediately merges them into the current active branch (git merge)."
  },
  "12": {
    "correctOptionId": "opt_2",
    "explanation": "Balanced binary search trees maintain a height strictly bounded by O(log N), guaranteeing O(log N) search even in the worst case."
  },
  "13": {
    "correctOptionId": "opt_3",
    "explanation": "Serial Peripheral Interface (SPI) is a synchronous, full-duplex protocol using four dedicated lines."
  },
  "14": {
    "correctOptionId": "opt_2",
    "explanation": "An H-bridge circuit enables voltage to be applied across a load (such as a DC motor) in either direction."
  },
  "15": {
    "correctOptionId": "opt_2",
    "explanation": "Fitts's Law states that MT = a + b * log2(2D / W), where D is distance and W is target width."
  },
  "16": {
    "correctOptionId": "opt_1",
    "explanation": "localStorage persists across browser sessions and tab closes, whereas sessionStorage is scoped to the tab lifecycle."
  },
  "17": {
    "correctOptionId": "opt_2",
    "explanation": "An IMU combines a 3-axis accelerometer (linear acceleration) and a 3-axis gyroscope (angular rate)."
  },
  "18": {
    "correctOptionId": "opt_2",
    "explanation": "The 60-30-10 rule creates visual balance: 60% neutral/dominant backdrop, 30% structure/secondary, and 10% punchy accent for CTAs."
  },
  "19": {
    "correctOptionId": "opt_2",
    "explanation": "403 Forbidden indicates the server understood the request but refuses to authorize access."
  },
  "20": {
    "correctOptionId": "opt_2",
    "explanation": "Stacks operate on LIFO, matching function calls pushing frames and returning."
  },
  "21": {
    "correctOptionId": "opt_1",
    "explanation": "PWM varies the duty cycle (percentage of time high vs low) to emulate variable output levels for LED brightness or motor speed."
  },
  "22": {
    "correctOptionId": "opt_2",
    "explanation": "ACID stands for Atomicity, Consistency, Isolation, and Durability."
  },
  "23": {
    "correctOptionId": "opt_2",
    "explanation": "SVGs are vector-based XML paths that scale infinitely without pixel degradation."
  },
  "24": {
    "correctOptionId": "opt_2",
    "explanation": "git commit records staged changes into the local repository history."
  },
  "25": {
    "correctOptionId": "opt_1",
    "explanation": "ROS (Robot Operating System) is the global open-source robotics middleware standard."
  },
  "26": {
    "correctOptionId": "opt_1",
    "explanation": "Proactive communication, systematic troubleshooting, and collaborative resilience are core to Zairza culture."
  },
  "27": {
    "correctOptionId": "opt_2",
    "explanation": "A growth mindset and receptiveness to peer critique enable continuous technical leveling-up."
  },
  "28": {
    "correctOptionId": "opt_1",
    "explanation": "Genuine passion to learn, innovate, and contribute to the collective club ecosystem."
  },
  "29": {
    "correctOptionId": "opt_2",
    "explanation": "Self-driven curiosity coupled with disciplined inquiry is what separates true engineers."
  },
  "30": {
    "correctOptionId": "opt_1",
    "explanation": "Balanced dedication and personal organization ensure academic excellence and impactful club contributions."
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
    "correctOptionId": "opt_2",
    "explanation": "git cherry-pick applies the diff of a specific commit onto the current branch."
  },
  "40": {
    "correctOptionId": "opt_1",
    "explanation": "Pull-up/down resistors eliminate high-impedance floating inputs, giving steady Vcc or GND."
  },
  "41": {
    "correctOptionId": "opt_1",
    "explanation": "ACID guarantees Atomicity, Consistency, Isolation, and Durability."
  },
  "42": {
    "correctOptionId": "opt_1",
    "explanation": "An IMU combining accelerometer and gyro delivers attitude/orientation telemetry."
  },
  "43": {
    "correctOptionId": "opt_2",
    "explanation": "Balanced BSTs (AVL, Red-Black) maintain height O(log n), providing O(log n) search."
  },
  "44": {
    "correctOptionId": "opt_2",
    "explanation": "useEffect manages lifecycle side effects in React functional components."
  },
  "45": {
    "correctOptionId": "opt_1",
    "explanation": "Decoupling caps act as local charge reservoirs filtering high-frequency noise spikes."
  },
  "46": {
    "correctOptionId": "opt_2",
    "explanation": "space-between pushes first item to start, last to end, and spaces out the middle."
  },
  "47": {
    "correctOptionId": "opt_2",
    "explanation": "OSI Layer 4 (Transport, TCP/UDP) handles port multiplexing and end-to-end reliability."
  },
  "48": {
    "correctOptionId": "opt_1",
    "explanation": "2D Convolution slides the kernel matrix over pixels to detect visual features."
  },
  "49": {
    "correctOptionId": "opt_1",
    "explanation": "Equal pairs of CW and CCW props cancel out reactive rotational torque on the yaw axis."
  },
  "50": {
    "correctOptionId": "opt_2",
    "explanation": "htop/top is the standard interactive process and resource monitor on Linux."
  },
  "51": {
    "correctOptionId": "opt_1",
    "explanation": "Polymorphism through method overriding enables child classes to specialize parent behavior."
  },
  "52": {
    "correctOptionId": "opt_1",
    "explanation": "I2C uses 2 wires (SDA/SCL), while SPI uses 4 wires with higher data rates and dedicated CS lines."
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
    "technicalInterests": ["React.js", "Python / ML", "Cybersecurity"],
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
    "technicalInterests": ["Embedded C", "Drone Aerodynamics", "ROS2"],
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
    "technicalInterests": ["Figma Design Systems", "3D Blender", "Next.js"],
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
    "action": "QUESTION_POOL_EXPANDED",
    "admin": "Super Admin",
    "details": "Expanded question pool to 60 questions with random section sampling (10 Logical, 15 Tech, 5 HR).",
    "timestamp": "2026-09-29 17:00"
  }
];
