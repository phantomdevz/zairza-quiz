// Zairza Induction Platform — Initial Data & Assessment Configuration
// Window: 29th Sept 10:00 PM to 30th Sept 10:00 PM
// Registration Closes: 30th Sept 12:00 PM (Noon)
// Duration: 30 minutes (1800 seconds)

export const QUIZ_CONFIG = {
  title: "Zairza Induction Assessment 2026",
  societyName: "Zairza — OUTR Bhubaneswar",
  tagline: "Wonder • Think • Create",
  oaStartEpoch: "2026-09-29T22:00:00+05:30",
  oaEndEpoch: "2026-09-30T22:00:00+05:30",
  registrationCutoffEpoch: "2026-09-30T12:00:00+05:30",
  durationMinutes: 30,
  totalQuestions: 30,
  marksPerQuestion: 1,
  negativeMark: 0.25,
  maxViolationsAllowed: 3,
  sections: [
    { id: "logical", name: "Part 1: Logical Reasoning", icon: "🧩", startQ: 1, endQ: 10, total: 10 },
    { id: "tech", name: "Part 2: Tech Knowledge", icon: "⚡", startQ: 11, endQ: 25, total: 15 },
    { id: "hr", name: "Part 3: HR & Cultural Fit", icon: "🤝", startQ: 26, endQ: 30, total: 5 },
  ]
};

export const INITIAL_QUESTIONS = [
  // PART 1: LOGICAL REASONING (Q1 - Q10)
  {
    id: 1,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "In a certain code, 'ZAIRZA' is coded as 'ACKTBC'. By applying the same transformation pattern, how would 'INDUCT' be encoded?",
    options: [
      { id: "opt_1", text: "KPFWEV" },
      { id: "opt_2", text: "KQFXFW" },
      { id: "opt_3", text: "JPEXEV" },
      { id: "opt_4", text: "LPFYFV" }
    ],
    correctOptionId: "opt_1",
    explanation: "Each letter is shifted forward: Z(+1)->A, A(+2)->C, I(+2)->K, R(+2)->T, Z(+2)->B, A(+2)->C. Following the +1, +2, +2, +2 pattern, I(+1)->K, N(+2)->P, D(+2)->F, U(+2)->W, C(+2)->E, T(+2)->V."
  },
  {
    id: 2,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?",
    options: [
      { id: "opt_1", text: "225" },
      { id: "opt_2", text: "256" },
      { id: "opt_3", text: "289" },
      { id: "opt_4", text: "361" }
    ],
    correctOptionId: "opt_3",
    explanation: "These are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime number is 17, and 17^2 = 289."
  },
  {
    id: 3,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "If 5 robots assemble 5 circuit boards in 5 minutes, how many minutes will it take 100 robots to assemble 100 circuit boards?",
    options: [
      { id: "opt_1", text: "100 minutes" },
      { id: "opt_2", text: "5 minutes" },
      { id: "opt_3", text: "20 minutes" },
      { id: "opt_4", text: "50 minutes" }
    ],
    correctOptionId: "opt_2",
    explanation: "1 robot takes 5 minutes to assemble 1 board. Hence, 100 robots working concurrently will finish 100 boards in 5 minutes."
  },
  {
    id: 4,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "Statement: 'All members of Zairza are innovators. Some innovators are drone pilots.' Conclusion I: Some drone pilots are members of Zairza. Conclusion II: All innovators are members of Zairza.",
    options: [
      { id: "opt_1", text: "Only Conclusion I follows" },
      { id: "opt_2", text: "Only Conclusion II follows" },
      { id: "opt_3", text: "Neither Conclusion follows" },
      { id: "opt_4", text: "Both Conclusions follow" }
    ],
    correctOptionId: "opt_3",
    explanation: "Neither conclusion is guaranteed by classical syllogistic deduction."
  },
  {
    id: 5,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "A drone takes off from the OUTR Student Activity Centre, flies 12m North, turns East and flies 5m, then hovers straight up vertically 13m. What is the displacement from the origin?",
    options: [
      { id: "opt_1", text: "13.0 m" },
      { id: "opt_2", text: "18.38 m (approx)" },
      { id: "opt_3", text: "25.0 m" },
      { id: "opt_4", text: "17.0 m" }
    ],
    correctOptionId: "opt_2",
    explanation: "Horizontal displacement = sqrt(12^2 + 5^2) = 13m. Total 3D displacement = sqrt(13^2 + 13^2) = 13*sqrt(2) approx 18.38m."
  },
  {
    id: 6,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "Look at the binary relationship: 1010 : 10 :: 1111 : 15 :: 10001 : ?",
    options: [
      { id: "opt_1", text: "16" },
      { id: "opt_2", text: "17" },
      { id: "opt_3", text: "19" },
      { id: "opt_4", text: "33" }
    ],
    correctOptionId: "opt_2",
    explanation: "The analogy is binary representation to base-10 decimal integer: 10001 in binary = 16 + 1 = 17."
  },
  {
    id: 7,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "Six team members (A, B, C, D, E, F) sit in a circle facing the center. A sits opposite D. B is to the immediate right of A. C is between A and E. Who sits to the immediate left of D?",
    options: [
      { id: "opt_1", text: "B" },
      { id: "opt_2", text: "E" },
      { id: "opt_3", text: "F" },
      { id: "opt_4", text: "C" }
    ],
    correctOptionId: "opt_2",
    explanation: "Arranging clockwise around the circle: A -> B -> F -> D -> E -> C. The person to the immediate left of D (facing center) is E."
  },
  {
    id: 8,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "If clock hands show 3:15, what is the angle between the hour hand and minute hand?",
    options: [
      { id: "opt_1", text: "0 degrees" },
      { id: "opt_2", text: "7.5 degrees" },
      { id: "opt_3", text: "12.0 degrees" },
      { id: "opt_4", text: "15.0 degrees" }
    ],
    correctOptionId: "opt_2",
    explanation: "Hour hand moves 0.5 degrees per minute. In 15 minutes, it moves 7.5 degrees past the 3 o'clock mark."
  },
  {
    id: 9,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "In a hackathon team, each person shakes hands with every other teammate exactly once. If 28 handshakes occurred, how many members were on the team?",
    options: [
      { id: "opt_1", text: "7" },
      { id: "opt_2", text: "8" },
      { id: "opt_3", text: "9" },
      { id: "opt_4", text: "14" }
    ],
    correctOptionId: "opt_2",
    explanation: "n*(n-1)/2 = 28 => n*(n-1) = 56 => 8 * 7 = 56. Hence n = 8."
  },
  {
    id: 10,
    section: "logical",
    sectionTitle: "Part 1: Logical Reasoning",
    prompt: "Which word does NOT belong with the others: Compiler, Transpiler, Interpreter, Microcontroller?",
    options: [
      { id: "opt_1", text: "Compiler" },
      { id: "opt_2", text: "Transpiler" },
      { id: "opt_3", text: "Interpreter" },
      { id: "opt_4", text: "Microcontroller" }
    ],
    correctOptionId: "opt_4",
    explanation: "The first three are software language translation tools; Microcontroller is an integrated hardware component."
  },

  // PART 2: TECH KNOWLEDGE (Q11 - Q25)
  {
    id: 11,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software & Systems)",
    prompt: "In Git, what is the key difference between 'git pull' and 'git fetch'?",
    options: [
      { id: "opt_1", text: "'git fetch' downloads commits and immediately merges them into working tree." },
      { id: "opt_2", text: "'git pull' executes 'git fetch' followed by 'git merge' into the active branch." },
      { id: "opt_3", text: "'git pull' only works on the main branch, whereas fetch works everywhere." },
      { id: "opt_4", text: "'git fetch' deletes local branches that no longer exist on remote." }
    ],
    correctOptionId: "opt_2",
    explanation: "git pull is a convenience command that downloads the remote changes (git fetch) and immediately merges them into the current active branch (git merge)."
  },
  {
    id: 12,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software & Algorithms)",
    prompt: "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
    options: [
      { id: "opt_1", text: "O(1)" },
      { id: "opt_2", text: "O(log N)" },
      { id: "opt_3", text: "O(N)" },
      { id: "opt_4", text: "O(N log N)" }
    ],
    correctOptionId: "opt_2",
    explanation: "Balanced binary search trees maintain a height strictly bounded by O(log N), guaranteeing O(log N) search even in the worst case."
  },
  {
    id: 13,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Robotics & IoT)",
    prompt: "Which communication protocol is full-duplex, synchronous, uses master-slave architecture, and relies on 4 lines (MISO, MOSI, SCK, SS)?",
    options: [
      { id: "opt_1", text: "I2C" },
      { id: "opt_2", text: "UART" },
      { id: "opt_3", text: "SPI" },
      { id: "opt_4", text: "CAN Bus" }
    ],
    correctOptionId: "opt_3",
    explanation: "Serial Peripheral Interface (SPI) is a synchronous, full-duplex protocol using four dedicated lines."
  },
  {
    id: 14,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Robotics & Hardware)",
    prompt: "What is the primary role of an H-bridge circuit in mobile robotics?",
    options: [
      { id: "opt_1", text: "To amplify radio frequency signals from RC controller" },
      { id: "opt_2", text: "To allow DC motors to run in both forward and reverse directions" },
      { id: "opt_3", text: "To convert 5V DC into 220V AC for microcontrollers" },
      { id: "opt_4", text: "To filter electromagnetic interference from sensors" }
    ],
    correctOptionId: "opt_2",
    explanation: "An H-bridge circuit enables voltage to be applied across a load (such as a DC motor) in either direction."
  },
  {
    id: 15,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Design & UI/UX)",
    prompt: "According to Fitts's Law in UI/UX design, what two factors determine the time required to rapidly move to a target area?",
    options: [
      { id: "opt_1", text: "Color contrast and typography weight" },
      { id: "opt_2", text: "Distance to the target and target size/width" },
      { id: "opt_3", text: "Viewport refresh rate and finger pressure" },
      { id: "opt_4", text: "Shadow blur radius and animation duration" }
    ],
    correctOptionId: "opt_2",
    explanation: "Fitts's Law states that MT = a + b * log2(2D / W), where D is distance and W is target width."
  },
  {
    id: 16,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software & Web)",
    prompt: "In modern JavaScript / React, what is the key difference between 'localStorage' and 'sessionStorage'?",
    options: [
      { id: "opt_1", text: "localStorage data persists until explicitly cleared, while sessionStorage expires when browser tab closes." },
      { id: "opt_2", text: "sessionStorage holds up to 50MB, whereas localStorage only holds 5KB." },
      { id: "opt_3", text: "localStorage is accessible only over HTTPS; sessionStorage works on HTTP." },
      { id: "opt_4", text: "sessionStorage can be accessed by server headers; localStorage cannot." }
    ],
    correctOptionId: "opt_1",
    explanation: "localStorage persists across browser sessions and tab closes, whereas sessionStorage is scoped to the tab lifecycle."
  },
  {
    id: 17,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Robotics & Sensors)",
    prompt: "Which sensor would you use to calculate both the angular velocity and linear acceleration of an autonomous drone?",
    options: [
      { id: "opt_1", text: "HC-SR04 Ultrasonic Sensor" },
      { id: "opt_2", text: "6-DoF IMU (Inertial Measurement Unit like MPU6050)" },
      { id: "opt_3", text: "LDR (Light Dependent Resistor)" },
      { id: "opt_4", text: "PIR Motion Sensor" }
    ],
    correctOptionId: "opt_2",
    explanation: "An IMU combines a 3-axis accelerometer (linear acceleration) and a 3-axis gyroscope (angular rate)."
  },
  {
    id: 18,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Design & Systems)",
    prompt: "What does the 60-30-10 color rule in UI and brand design prescribe?",
    options: [
      { id: "opt_1", text: "60% font size, 30% line height, 10% letter spacing" },
      { id: "opt_2", text: "60% dominant base color, 30% secondary/surface color, 10% accent color" },
      { id: "opt_3", text: "60% imagery, 30% text, 10% whitespace" },
      { id: "opt_4", text: "60% dark mode, 30% light mode, 10% high-contrast mode" }
    ],
    correctOptionId: "opt_2",
    explanation: "The 60-30-10 rule creates visual balance: 60% neutral/dominant backdrop, 30% structure/secondary, and 10% punchy accent for CTAs."
  },
  {
    id: 19,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software & Networking)",
    prompt: "Which HTTP status code is returned when a requested client resource requires authentication or permission is denied?",
    options: [
      { id: "opt_1", text: "301 Moved Permanently" },
      { id: "opt_2", text: "403 Forbidden" },
      { id: "opt_3", text: "502 Bad Gateway" },
      { id: "opt_4", text: "204 No Content" }
    ],
    correctOptionId: "opt_2",
    explanation: "403 Forbidden indicates the server understood the request but refuses to authorize access."
  },
  {
    id: 20,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Computer Science)",
    prompt: "Which data structure follows the LIFO (Last-In, First-Out) principle and is used for function call stacks?",
    options: [
      { id: "opt_1", text: "Queue" },
      { id: "opt_2", text: "Stack" },
      { id: "opt_3", text: "Priority Queue" },
      { id: "opt_4", text: "Circular Buffer" }
    ],
    correctOptionId: "opt_2",
    explanation: "Stacks operate on LIFO, matching function calls pushing frames and returning."
  },
  {
    id: 21,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Robotics & IoT)",
    prompt: "On an ESP32 or Arduino board, what does PWM (Pulse Width Modulation) allow you to do with a digital output pin?",
    options: [
      { id: "opt_1", text: "Simulate variable analog voltage output by rapidly cycling on/off duty cycle" },
      { id: "opt_2", text: "Double the processor clock frequency dynamically" },
      { id: "opt_3", text: "Read ambient atmospheric pressure directly" },
      { id: "opt_4", text: "Connect to Wi-Fi without antennas" }
    ],
    correctOptionId: "opt_1",
    explanation: "PWM varies the duty cycle (percentage of time high vs low) to emulate variable output levels for LED brightness or motor speed."
  },
  {
    id: 22,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software & Database)",
    prompt: "In relational databases, what does the ACID acronym stand for?",
    options: [
      { id: "opt_1", text: "Asynchronous, Consistent, Indexed, Distributed" },
      { id: "opt_2", text: "Atomicity, Consistency, Isolation, Durability" },
      { id: "opt_3", text: "Authentication, Cryptography, Integrity, Decryption" },
      { id: "opt_4", text: "Automated, Clustered, Integrated, Dynamic" }
    ],
    correctOptionId: "opt_2",
    explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
  },
  {
    id: 23,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Design & Graphics)",
    prompt: "What is the primary advantage of SVG (Scalable Vector Graphics) over raster formats like PNG and JPEG?",
    options: [
      { id: "opt_1", text: "SVGs can store audio clips inside them" },
      { id: "opt_2", text: "SVGs scale to any screen resolution without loss of clarity or pixelation" },
      { id: "opt_3", text: "SVGs require specialized GPU hardware to render" },
      { id: "opt_4", text: "SVGs cannot be styled with CSS" }
    ],
    correctOptionId: "opt_2",
    explanation: "SVGs are vector-based XML paths that scale infinitely without pixel degradation."
  },
  {
    id: 24,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Software Development)",
    prompt: "What does the command 'git commit -m \"message\"' do?",
    options: [
      { id: "opt_1", text: "Pushes local files directly to GitHub" },
      { id: "opt_2", text: "Records a snapshot of the staged changes in the local repository with a log message" },
      { id: "opt_3", text: "Discards all modified files since the last clone" },
      { id: "opt_4", text: "Creates a new branch named 'message'" }
    ],
    correctOptionId: "opt_2",
    explanation: "git commit records staged changes into the local repository history."
  },
  {
    id: 25,
    section: "tech",
    sectionTitle: "Part 2: Tech Knowledge (Robotics / Computing)",
    prompt: "Which operating system framework is widely used in cutting-edge robotics for inter-process node messaging, publishers, and subscribers?",
    options: [
      { id: "opt_1", text: "ROS (Robot Operating System)" },
      { id: "opt_2", text: "FreeDOS" },
      { id: "opt_3", text: "OpenWrt" },
      { id: "opt_4", text: "ReactOS" }
    ],
    correctOptionId: "opt_1",
    explanation: "ROS (Robot Operating System) is the global open-source robotics middleware standard."
  },

  // PART 3: HR & CULTURAL ALIGNMENT (Q26 - Q30)
  {
    id: 26,
    section: "hr",
    sectionTitle: "Part 3: HR & Cultural Alignment",
    prompt: "It's 48 hours before the annual tech fest exhibition, and your team's hardware sensor module suddenly stops communicating with the software dashboard. How do you respond?",
    options: [
      { id: "opt_1", text: "Immediately notify the team leads, isolate the issue between hardware wiring and API endpoints, and collaborate on a fallback demo." },
      { id: "opt_2", text: "Wait until the leads ask about status before mentioning the issue." },
      { id: "opt_3", text: "Blame the software wing for changing data formatting." },
      { id: "opt_4", text: "Drop out of the project since there's insufficient time left." }
    ],
    correctOptionId: "opt_1",
    explanation: "Proactive communication, systematic troubleshooting, and collaborative resilience are core to Zairza culture."
  },
  {
    id: 27,
    section: "hr",
    sectionTitle: "Part 3: HR & Cultural Alignment",
    prompt: "A senior mentor gives you critical feedback that your submitted UI or code design lacks structure and needs substantial refactoring. How do you handle it?",
    options: [
      { id: "opt_1", text: "Ignore the feedback because it worked fine on your personal device." },
      { id: "opt_2", text: "Take notes on specific pain points, ask clarifying questions to understand society standards, and iterate." },
      { id: "opt_3", text: "Argue that aesthetic choices are purely subjective." },
      { id: "opt_4", text: "Stop contributing to avoid further reviews." }
    ],
    correctOptionId: "opt_2",
    explanation: "A growth mindset and receptiveness to peer critique enable continuous technical leveling-up."
  },
  {
    id: 28,
    section: "hr",
    sectionTitle: "Part 3: HR & Cultural Alignment",
    prompt: "What is your primary motivation for seeking induction into Zairza (Technical Society of OUTR)?",
    options: [
      { id: "opt_1", text: "To collaborate on real multidisciplinary projects (drones, apps, design), gain peer mentorship, and build meaningful technology." },
      { id: "opt_2", text: "Only to add a certificate line on my CV without participating actively." },
      { id: "opt_3", text: "Because my classmates forced me to fill the form." },
      { id: "opt_4", text: "To attend social gatherings exclusively." }
    ],
    correctOptionId: "opt_1",
    explanation: "Genuine passion to learn, innovate, and contribute to the collective club ecosystem."
  },
  {
    id: 29,
    section: "hr",
    sectionTitle: "Part 3: HR & Cultural Alignment",
    prompt: "You are assigned a task involving a framework or microcontroller tool you have never touched before. What is your course of action?",
    options: [
      { id: "opt_1", text: "Refuse the assignment until someone conducts a personal lecture for you." },
      { id: "opt_2", text: "Explore the official documentation, experiment with starter repos, and ask targeted questions to seniors when stuck." },
      { id: "opt_3", text: "Wait for the deadline to pass and state that it wasn't taught in the college syllabus." },
      { id: "opt_4", text: "Copy code from an untrusted source without understanding how it works." }
    ],
    correctOptionId: "opt_2",
    explanation: "Self-driven curiosity coupled with disciplined inquiry is what separates true engineers."
  },
  {
    id: 30,
    section: "hr",
    sectionTitle: "Part 3: HR & Cultural Alignment",
    prompt: "Club induction requires dedicating 5-8 hours per week to workshops, lab sessions, and internal hackathons alongside college coursework. How do you balance this?",
    options: [
      { id: "opt_1", text: "Prioritize structured time-blocking, stay disciplined with coursework deadlines, and treat club sessions as high-priority skill-building." },
      { id: "opt_2", text: "Skip all academic lectures to spend time in the club lab." },
      { id: "opt_3", text: "Promise commitment now, but stop showing up after induction." },
      { id: "opt_4", text: "Complain that engineering doesn't leave room for extracurricular development." }
    ],
    correctOptionId: "opt_1",
    explanation: "Balanced dedication and personal organization ensure academic excellence and impactful club contributions."
  }
];

export const INITIAL_CANDIDATES = [
  {
    rollNumber: "2401106042",
    fullName: "Aarav Mohapatra",
    email: "aarav.24cse042@outr.ac.in",
    mobile: "9876543210",
    year: "1st Year",
    branch: "Computer Science & Engineering",
    gender: "Male",
    residentialType: "Hosteller",
    preferredWing: "Software",
    technicalInterests: ["Web Development", "AI/ML", "Cloud Systems"],
    portfolioUrl: "https://github.com/aarav-outr",
    registeredAt: "2026-09-29T10:15:00+05:30",
    quizStatus: "COMPLETED",
    score: 26,
    timeTakenSeconds: 1420,
    violationsCount: 0,
    sectionScores: { logical: 9, tech: 13, hr: 4 }
  },
  {
    rollNumber: "2401106109",
    fullName: "Priyanka Dash",
    email: "priyanka.24ee109@outr.ac.in",
    mobile: "9812345678",
    year: "1st Year",
    branch: "Electrical Engineering",
    gender: "Female",
    residentialType: "Day Scholar",
    preferredWing: "Robotics & IoT",
    technicalInterests: ["Embedded Systems", "Robotics", "Circuit Design"],
    portfolioUrl: "https://linkedin.com/in/priyanka-dash",
    registeredAt: "2026-09-29T11:45:00+05:30",
    quizStatus: "IN_PROGRESS",
    score: null,
    timeTakenSeconds: 840,
    violationsCount: 2,
    currentQuestion: 18,
    sectionScores: null
  },
  {
    rollNumber: "2301106015",
    fullName: "Rohan Kumar Swain",
    email: "rohan.23me015@outr.ac.in",
    mobile: "9778899001",
    year: "2nd Year",
    branch: "Mechanical Engineering",
    gender: "Male",
    residentialType: "Hosteller",
    preferredWing: "Design",
    technicalInterests: ["3D Modelling", "UI/UX", "Brand Design"],
    portfolioUrl: "https://behance.net/rohan-swain",
    registeredAt: "2026-09-29T12:30:00+05:30",
    quizStatus: "NOT_STARTED",
    score: null,
    timeTakenSeconds: 0,
    violationsCount: 0,
    currentQuestion: 1,
    sectionScores: null
  }
];

export const INITIAL_AUDIT_LOGS = [
  { id: "log_1", action: "SYSTEM_INITIALIZED", admin: "SuperAdmin (zairza_core)", details: "Platform initialized for Induction 2026 Quiz Window", timestamp: "2026-09-29T12:00:00+05:30" },
  { id: "log_2", action: "QUIZ_CONFIG_SAVED", admin: "QuizManager (leads_team)", details: "Configured 30 questions across 3 parts (30 mins duration)", timestamp: "2026-09-29T12:15:00+05:30" },
  { id: "log_3", action: "CANDIDATE_SUBMIT", admin: "System Auto-Verifier", details: "Candidate 2401106042 successfully submitted response", timestamp: "2026-09-29T13:00:00+05:30" }
];
