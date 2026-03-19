/* ============================================
   PORTFOLIO DATA STORE
   Edit this file to update your portfolio content.
   ============================================ */

const PROFILE = {
  name: "Kapil Thakur",
  title: "AI / ML Developer",
  tagline: "Building Intelligent Systems — From Neural Networks to IoT Edge Devices",
  bio: `Passionate AI/ML developer specializing in building end-to-end intelligent systems. 
  From crafting NLP pipelines and computer vision solutions to deploying models on IoT edge devices, 
  I bridge the gap between cutting-edge research and real-world applications. 
  I believe in practical, scalable solutions — engineering that works.`,
  bioYaml: {
    name: "Kapil Thakur",
    role: "AI/ML Developer & Engineer",
    specialization: ["NLP", "Computer Vision", "IoT", "Deep Learning"],
    languages: ["Python", "JavaScript", "SQL", "C++"],
    location: "India",
    status: "Open to Opportunities"
  },
  socials: {
    github: "https://github.com/kapilthakur",
    linkedin: "https://linkedin.com/in/kapilthakur",
    email: "mailto:kapil@example.com",
    twitter: "https://twitter.com/kapilthakur"
  },
  resumeUrl: "assets/Kapil_Thakur_Resume.pdf"
};


/* ============================================
   SHOWCASE PROJECTS — Curated, rich content
   githubRepo links to GITHUB_REPOS[].name for live stats
   ============================================ */
const PROJECTS = [
  {
    id: "precisecall-voice-bot",
    githubRepo: "Voice_Bot",
    title: "PreciseCall Voice Bot",
    tagline: "AI-Powered Conversational Recruiter",
    category: "nlp",
    categoryLabel: "NLP / Voice AI",
    accent: "#ff6b6b",
    shortDescription: "A production-ready AI voice bot that handles phone conversations using NLP, speech recognition, and text-to-speech — built to streamline the recruiting process.",
    fullDescription: `PreciseCall is a production-ready AI voice bot designed to streamline the recruiting and hiring process. It handles phone conversations using speech-to-text, natural language understanding, and text-to-speech to create a seamless conversational experience.

The system integrates with Twilio for telephony, uses a FastAPI backend for real-time processing, and features a React frontend dashboard for monitoring active calls and managing conversation flows. Built with WebSocket connections for low-latency real-time updates.`,
    techStack: ["Python", "FastAPI", "React", "Twilio", "WebSocket", "NLP", "TTS/STT", "Docker"],
    features: [
      "Real-time speech-to-text transcription",
      "NLP-powered intent recognition & response generation",
      "Natural text-to-speech voice synthesis",
      "Twilio WhatsApp & voice call integration",
      "React dashboard for call monitoring",
      "WebSocket-based real-time updates",
      "Docker containerized deployment"
    ],
    challenges: "Achieving low-latency responses in voice conversations — the bot needs to respond within 1-2 seconds to feel natural, requiring optimized NLP inference and audio streaming pipelines.",
    architecture: "Phone Call → Twilio → FastAPI WebSocket → STT → NLP Engine → Response Generator → TTS → Caller"
  },
  {
    id: "face-recognition-system",
    githubRepo: "FaceRecognitionX",
    title: "FaceRecognitionX",
    tagline: "Real-Time Identity Verification System",
    category: "cv",
    categoryLabel: "Computer Vision",
    accent: "#ffd93d",
    shortDescription: "A deep learning-based face recognition system using MTCNN for detection and InsightFace for high-accuracy identity matching across varying conditions.",
    fullDescription: `A comprehensive face recognition pipeline that combines multiple state-of-the-art models for robust identity verification. The system uses MTCNN for face detection, followed by InsightFace (ArcFace) for generating discriminative face embeddings.

The pipeline handles the complete workflow: face detection → alignment → embedding generation → similarity matching against a known identity database. Built to work reliably across varying lighting conditions, angles, and partial occlusions.`,
    techStack: ["Python", "MTCNN", "InsightFace", "OpenCV", "PyTorch", "NumPy"],
    features: [
      "Multi-face detection with MTCNN",
      "ArcFace embedding generation via InsightFace",
      "Real-time webcam-based recognition",
      "Known/Unknown classification with configurable thresholds",
      "Batch processing for database enrollment",
      "Performance logging and accuracy metrics"
    ],
    challenges: "Balancing false positive and false negative rates — choosing the right similarity threshold is critical and varies depending on the deployment environment and lighting conditions.",
    architecture: "Camera Feed → MTCNN Detector → Face Alignment → InsightFace Embeddings → Cosine Similarity → Identity Database → Result"
  },
  {
    id: "tnp-portal",
    githubRepo: "TnP_Portal",
    title: "Training & Placement Portal",
    tagline: "Full-Stack Campus Recruitment Platform",
    category: "fullstack",
    categoryLabel: "Full Stack",
    accent: "#a855f7",
    shortDescription: "A comprehensive campus recruitment management system — handling student profiles, company listings, placement drives, and role-based access control.",
    fullDescription: `A full-featured campus recruitment management system built for Training & Placement cells. The portal digitizes the entire placement workflow — from student registration and resume management to company onboarding and interview scheduling.

Features role-based access control (students, TPO admins, companies), database migrations with Alembic for reliable schema evolution, and a clean, responsive interface.`,
    techStack: ["Python", "FastAPI", "PostgreSQL", "Alembic", "React", "Docker"],
    features: [
      "Student profile & resume management",
      "Company registration and job posting",
      "Placement drive scheduling and management",
      "Role-based access control (Student/Admin/Company)",
      "Database migrations with Alembic",
      "RESTful API architecture"
    ],
    challenges: "Designing a system flexible enough to handle different placement processes across departments while maintaining a consistent, intuitive user experience.",
    architecture: "React Frontend → FastAPI Backend → PostgreSQL (Alembic Migrations) → Docker"
  },
  {
    id: "iot-vision-system",
    githubRepo: "IOT-based-face-detection-and-recognition-using-ESP-32",
    title: "IoT Vision System",
    tagline: "Edge AI for Industrial Inspection",
    category: "iot",
    categoryLabel: "IoT / Edge AI",
    accent: "#4ecdc4",
    shortDescription: "A fault-tolerant wireless computer vision system using ESP32-CAM and Python OpenCV — built for real-time industrial inspection with face detection at the edge.",
    fullDescription: `A robust, fault-tolerant wireless computer vision system using ESP32-CAM and Python OpenCV. The system captures real-time video from ESP32-CAM modules, processes frames using a Producer-Consumer pattern, and performs face detection and recognition at the edge.

Designed for industrial inspection scenarios with features like active frame dropping for real-time performance, auto-reconnection on network failures, and a data-fusion logging engine for comprehensive audit trails.`,
    techStack: ["Python", "ESP32-CAM", "OpenCV", "face_recognition", "Arduino C++", "Streamlit"],
    features: [
      "ESP32-CAM firmware with optimized streaming",
      "Fault-tolerant auto-reconnection mechanism",
      "Active frame dropping for real-time performance",
      "Producer-Consumer pattern for video processing",
      "Data-fusion logging engine for inspection records",
      "Streamlit dashboard for monitoring"
    ],
    challenges: "Maintaining stable, low-latency video streams over WiFi from ESP32-CAM modules while running real-time face recognition — all within the memory and bandwidth constraints of edge hardware.",
    architecture: "ESP32-CAM → WiFi Stream → Python VideoStream (Producer) → Frame Queue → Detector (Consumer) → Logger → Dashboard"
  },
  {
    id: "reviewemote",
    githubRepo: "ReviewEmote-CSV-Sentiment-Visualizer",
    title: "ReviewEmote",
    tagline: "DistilBERT-Powered Sentiment Analyzer",
    category: "nlp",
    categoryLabel: "NLP / ML",
    accent: "#00f0ff",
    shortDescription: "A Streamlit app for CSV sentiment analysis using DistilBERT with emoji ratings, real-time progress tracking, and interactive Plotly charts.",
    fullDescription: `ReviewEmote is a zero-setup Streamlit application that brings production-grade sentiment analysis to non-technical users. Upload a CSV of customer reviews, and the app automatically processes each entry through a DistilBERT transformer model.

Features intelligent text chunking for long reviews, a 1-10 emoji rating system for intuitive visualization, real-time progress tracking with ETA, and interactive Plotly charts for exploring sentiment distributions and trends.`,
    techStack: ["Python", "Streamlit", "DistilBERT", "HuggingFace", "Plotly", "Pandas"],
    features: [
      "DistilBERT transformer-based sentiment classification",
      "Smart text chunking for long-form reviews",
      "1-10 emoji rating scale visualization",
      "Real-time progress tracking with ETA",
      "Interactive Plotly charts and distributions",
      "Zero-setup CSV upload interface"
    ],
    challenges: "Handling extremely long reviews that exceed the model's token limit — implemented intelligent text chunking that splits reviews into overlapping segments and aggregates predictions for accurate composite scores.",
    architecture: "CSV Upload → Text Chunking → DistilBERT Inference → Score Aggregation → Emoji Mapping → Plotly Visualization"
  },
  {
    id: "research-paper-summarizer",
    githubRepo: null,
    title: "Research Paper Summarizer",
    tagline: "Recursive Meta-Analysis Engine",
    category: "nlp",
    categoryLabel: "NLP / Data",
    accent: "#b026ff",
    shortDescription: "An end-to-end pipeline that recursively processes research papers — extracting summaries from sections, tables, diagrams, and references into structured Markdown.",
    fullDescription: `A sophisticated document processing system built to automate the painful process of reading and summarizing research papers. The system uses a recursive approach — first extracting individual sections, then analyzing tables and figures independently, and finally cross-referencing everything to produce a coherent, structured summary.

The pipeline is orchestrated using Apache Airflow for reliability and reproducibility, with each processing step containerized in Docker for consistent environments. NLP models from HuggingFace handle the heavy lifting of text understanding and generation.`,
    techStack: ["Python", "Apache Airflow", "Docker", "HuggingFace Transformers", "NLP", "Markdown"],
    features: [
      "Recursive PDF section extraction and parsing",
      "Independent table & diagram analysis pipeline",
      "Reference cross-linking and verification",
      "Structured Markdown output with visual evidence",
      "Dockerized multi-container deployment",
      "Airflow DAG orchestration for pipeline reliability"
    ],
    challenges: "Handling the diversity of PDF layouts across different journals. Papers from IEEE, arXiv, and Nature each have unique formatting, requiring adaptive extraction logic.",
    architecture: "Airflow DAG → PDF Parser → Section Extractor → NLP Summarizer → Cross-Referencing Engine → Markdown Generator"
  },
  {
    id: "smart-job-automation",
    githubRepo: null,
    title: "Smart Job Automation",
    tagline: "AI-Powered Job Discovery Pipeline",
    category: "data",
    categoryLabel: "Data Engineering",
    accent: "#f97316",
    shortDescription: "An automated n8n workflow that fetches, verifies, and catalogs job openings from multiple sources into structured Excel reports.",
    fullDescription: `An intelligent job discovery system that automates the tedious process of finding relevant job openings. The pipeline uses n8n for workflow orchestration, connecting to the JSearch API (via RapidAPI) to fetch real-time job listings.

The system doesn't just scrape — it cross-verifies listings across sources, filters by relevance (role, location, experience level), and generates clean Excel reports with all the details a job seeker needs. Specifically tuned for Data Science roles in India.`,
    techStack: ["n8n", "JSearch API", "RapidAPI", "JavaScript", "Excel", "REST APIs"],
    features: [
      "Automated job fetching from JSearch API",
      "Cross-verification across multiple sources",
      "Role & location-based intelligent filtering",
      "Structured Excel report generation",
      "Scheduled daily/weekly pipeline runs",
      "Duplicate detection and deduplication"
    ],
    challenges: "Ensuring data accuracy — job listings from aggregator APIs can be duplicated, outdated, or misclassified. Building robust deduplication and verification logic was key.",
    architecture: "n8n Trigger → JSearch API → Data Cleaner → Deduplication → Verification → Excel Writer → Email Notification"
  },
  {
    id: "mileage-tracker",
    githubRepo: null,
    title: "Jugaadu Mileage Tracker",
    tagline: "Offline-First Flutter Mobile App",
    category: "mobile",
    categoryLabel: "Mobile / Flutter",
    accent: "#ec4899",
    shortDescription: "A Flutter-based offline-first mobile app for tracking vehicle mileage with photo-first data entry and automatic JSON backup.",
    fullDescription: `A practical, no-nonsense mileage tracking app built with Flutter. Designed for the real world — it works completely offline using SQLite for local storage, and features a photo-first data entry workflow where users snap a photo of the fuel meter before entering data.

The app automatically backs up data to JSON files, provides mileage trends and statistics, and features a dark automotive-style UI that's easy to use at the fuel station.`,
    techStack: ["Flutter", "Dart", "SQLite", "Provider", "Image Picker", "JSON"],
    features: [
      "Photo-first data entry workflow",
      "Offline-first SQLite database",
      "Automatic JSON backup mechanism",
      "Mileage calculation between reserve events",
      "Trend charts and statistics",
      "Dark automotive-style UI"
    ],
    challenges: "Designing the data entry flow to be usable at a fuel station — quick, one-handed operation with large touch targets and minimal steps.",
    architecture: "Flutter UI → Provider State → SQLite Database → JSON Backup → Image Storage"
  }
];

const CATEGORIES = [
  { id: "all", label: "All", icon: "⚡" },
  { id: "nlp", label: "NLP", icon: "💬" },
  { id: "cv", label: "Vision", icon: "👁️" },
  { id: "iot", label: "IoT", icon: "🔌" },
  { id: "data", label: "Data", icon: "📊" },
  { id: "fullstack", label: "Full Stack", icon: "🌐" },
  { id: "mobile", label: "Mobile", icon: "📱" }
];


const SKILLS = [
  // Row 1 — 5 items
  { name: "Python", icon: "🐍", proficiency: 95, category: "language" },
  { name: "TensorFlow", icon: "🧠", proficiency: 88, category: "ml" },
  { name: "PyTorch", icon: "🔥", proficiency: 85, category: "ml" },
  { name: "OpenCV", icon: "👁️", proficiency: 90, category: "ml" },
  { name: "Docker", icon: "🐳", proficiency: 82, category: "devops" },
  // Row 2 — 4 items (offset)
  { name: "FastAPI", icon: "⚡", proficiency: 88, category: "backend" },
  { name: "React", icon: "⚛️", proficiency: 78, category: "frontend" },
  { name: "Node.js", icon: "🟢", proficiency: 75, category: "backend" },
  { name: "PostgreSQL", icon: "🐘", proficiency: 80, category: "data" },
  // Row 3 — 5 items
  { name: "HuggingFace", icon: "🤗", proficiency: 85, category: "ml" },
  { name: "JavaScript", icon: "📜", proficiency: 82, category: "language" },
  { name: "Flutter", icon: "💙", proficiency: 72, category: "mobile" },
  { name: "AWS", icon: "☁️", proficiency: 70, category: "cloud" },
  { name: "Git", icon: "📂", proficiency: 90, category: "devops" },
  // Row 4 — 4 items (offset)
  { name: "MongoDB", icon: "🍃", proficiency: 78, category: "data" },
  { name: "Linux", icon: "🐧", proficiency: 85, category: "devops" },
  { name: "Streamlit", icon: "📊", proficiency: 88, category: "frontend" },
  { name: "C++", icon: "⚙️", proficiency: 70, category: "language" }
];

const EXPERIENCE = [
  {
    date: "2025 — Present",
    role: "AI/ML Developer",
    company: "Freelance / Independent",
    description: "Building end-to-end AI solutions — NLP pipelines, computer vision systems, and IoT edge deployments. Working with startups and research teams to bring ML models from prototype to production.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"]
  },
  {
    date: "2024 — 2025",
    role: "ML Engineering Intern",
    company: "Tech Company",
    description: "Developed and deployed machine learning models for production workloads. Built data pipelines, trained NLP models, and optimized inference latency for real-time applications.",
    tags: ["TensorFlow", "Airflow", "AWS", "PostgreSQL"]
  },
  {
    date: "2021 — 2025",
    role: "B.Tech in Computer Science",
    company: "University",
    description: "Focused on AI/ML, computer science fundamentals, and hands-on project development. Led technical teams and participated in hackathons and research projects.",
    tags: ["Algorithms", "ML", "Research", "Leadership"]
  }
];
