// Portfolio content for Chandan Gowda AH
export const PROFILE = {
  name: "Chandan Gowda AH",
  handle: "chandan-gowda",
  role: "GenAI Data Engineer",
  tagline: "Results-driven GenAI Data Engineer designing AI-powered solutions, scalable data pipelines & enterprise automation. Deep expertise in RAG, local LLMs, Copilot Studio agents and full-stack AI platforms — certified across AWS, Databricks, Google Cloud & OCI.",
  status: "Open to GenAI · Data Engineering · LLM Engineering roles",
  location: "India",
  email: "chandangowdaa.h17@gmail.com",
  phone: "+91 7337 635 194",
  linkedin: "https://www.linkedin.com/in/chandan-gowda-a-h-744908195/",
  github: "https://github.com/ChandanRocky",
  resumeUrl: "/Chandan_Gowda_AH_Resume.docx",
  avatar: "https://chandan-ai-engineer.vercel.app/chandan_anime_closed.png",
  focusTags: ["RAG Systems", "AI Agents", "Data Pipelines", "LLM Engineering", "Cloud Architecture"],
};

export const STATS = [
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Projects Delivered", value: 10, suffix: "+" },
  { label: "AI Agents Built", value: 7, suffix: "" },
  { label: "Certifications", value: 10, suffix: "+" },
  { label: "Cloud Platforms", value: 4, suffix: "" },
];

export const SKILL_GROUPS = [
  {
    domain: "AI & GenAI — Primary Focus",
    categories: [
      { name: "GenAI & LLMs", items: ["RAG Pipelines", "Ollama Local LLMs", "Groq API", "Vector Embeddings", "Prompt Engineering"] },
      { name: "AI Agents & Platforms", items: ["Microsoft Copilot Studio", "Google AI Studio", "OCI GenAI", "AI Builder", "Azure OpenAI"] },
      { name: "AI Automation", items: ["Power Automate Cloud", "Graph API", "SharePoint REST API", "M365 Connectors", "Turbotic RPA"] },
    ],
  },
  {
    domain: "Data Engineering & Cloud",
    categories: [
      { name: "Big Data & Pipelines", items: ["Databricks", "PySpark", "Apache Airflow", "Azure Data Factory", "ADLS Gen2", "Delta Lake"] },
      { name: "Cloud Platforms", items: ["AWS (S3, Athena, Lambda)", "Azure", "Google Cloud", "OCI", "CloudFormation"] },
      { name: "Databases & Backend", items: ["Snowflake", "PostgreSQL", "MongoDB", "Redshift", "FastAPI", "ASP.NET Core", "Next.js 14"] },
      { name: "Languages & DevOps", items: ["Python", "SQL", "PySpark", "TypeScript", "Docker", "GitHub CI/CD", "FFmpeg"] },
    ],
  },
];

export const PROJECTS = [
  { id: 1, title: "AI Appointment Booking Assistant", category: "AI Agents", note: "12 conversation flows, 100% email delivery tracking and context retention.", tech: ["Copilot Studio", "Power Automate", "AI Builder", "M365 Connectors"], components: "25+" },
  { id: 2, title: "Insurance Eligibility Assistant", category: "AI Agents", note: "94% OCR accuracy with 85% confidence threshold and intelligent fallback mechanism.", tech: ["AI Builder", "Document Processing", "Copilot Studio", "Azure Cognitive Services"], components: "18+" },
  { id: 3, title: "Patient Reminders & Personalized Promotions", category: "AI Agents", note: "1000+ patient segmentation, loyalty integration and A/B testing for engagement.", tech: ["Power Automate", "Dataverse", "Azure SQL", "Dynamics 365"], components: "20+" },
  { id: 4, title: "Post-Exam Virtual Support Bot", category: "AI Agents", note: "25+ components, 15+ conversation paths and 100% pass rate for student support.", tech: ["Copilot Studio", "Azure OpenAI", "AI Builder", "SharePoint"], components: "25+" },
  { id: 5, title: "AI Tools for Doctors & Office Staff", category: "AI Agents", note: "Custom speech model, SOAP note format and 96% query accuracy for clinical workflows.", tech: ["Azure Speech Services", "Azure OpenAI", "Copilot Studio", "SharePoint"], components: "22+" },
  { id: 6, title: "Review & Feedback Sentiment Analysis", category: "AI Agents", note: "42 technical tasks, multi-format ingestion and automated PDF generation from insights.", tech: ["AI Builder", "Azure Text Analytics", "Power Automate", "Graph API"], components: "42+" },
  { id: 7, title: "CMS Database Analysis Agent", category: "AI Agents", note: "14 milestones including database migration and REST API endpoints for CMS.", tech: ["PostgreSQL", "ngrok", "REST APIs", "Custom AI Agent"], components: "14+" },
  { id: 8, title: "AccionTube — AI Video Platform", category: "Full Stack", note: "Full-stack internal video platform with RAG chatbot (Ollama), Azure AD SSO and TikTok-style Shorts.", tech: ["Next.js 14", "FastAPI", "ASP.NET Core", "MongoDB", "Ollama", "Azure AD"], components: "20+" },
  { id: 9, title: "Tech Tuesday Helper Agent", category: "AI Agents", note: "Analytics UI, Teams agent, OneDrive knowledge structure and natural-language query bot.", tech: ["Teams Graph API", "OneDrive API", "Azure Cognitive Search", "Power Apps"], components: "15+" },
  { id: 10, title: "Shorts Creator — AI Video Automation", category: "Full Stack", note: "Python CLI using Groq + Ollama for semantic analysis, auto-extracting 60-120s clips via FFmpeg.", tech: ["Python", "Ollama", "Groq API", "FFmpeg", "Graph API"], components: "—" },
  { id: 11, title: "Automated Data Ingestion Pipeline", category: "Data Eng", note: "Airflow (Docker) pipeline for chunking, validation and S3 retention with PostgreSQL tracking.", tech: ["Apache Airflow", "Docker", "AWS S3", "PostgreSQL", "Python"], components: "—" },
  { id: 12, title: "Databricks Unity Catalog Upgrade", category: "Data Eng", note: "Migrated tables from Hive Metastore to Unity Catalog with full compatibility validation.", tech: ["Databricks", "Unity Catalog", "Hive Metastore", "PySpark"], components: "—" },
  { id: 13, title: "Snowflake to Databricks Migration", category: "Data Eng", note: "Full Bronze-to-Gold transformation with automated testing ensuring zero data loss.", tech: ["Snowflake", "Databricks", "Delta Lake", "PySpark"], components: "—" },
];

export const PROJECT_FILTERS = ["All", "AI Agents", "Data Eng", "Full Stack"];

export const EXPERIENCE = [
  {
    period: "Sep 2024 – Present",
    company: "Accion Labs",
    location: "India",
    role: "GenAI Data Engineer",
    points: [
      "Shipped 7 healthcare AI agent POCs using Copilot Studio, Azure OpenAI & Google AI Studio",
      "Architected AccionTube — full-stack AI video platform with RAG chatbot (Ollama) & Azure AD SSO",
      "Built Shorts Creator: AI CLI tool using Groq + FFmpeg for automated 60–120s video extraction",
      "Designed Airflow-based data ingestion pipeline on AWS (Docker) for enterprise client Finvi",
    ],
  },
  {
    period: "Jun 2023 – Aug 2024",
    company: "Koantek Cloud & AI",
    location: "India",
    role: "Junior Data Engineer",
    points: [
      "Led Databricks Unity Catalog migration from Hive Metastore for client Claritas",
      "Executed Snowflake → Databricks Bronze-to-Gold migration with zero data loss for CommerceIQ",
      "Received Best Performer (AA Award) from client for outstanding engagement delivery",
    ],
  },
];

export const CERTIFICATIONS = [
  "/certificates/Screenshot 2026-06-29 at 10.48.10 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.48.26 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.48.38 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.49.23 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.49.50 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.51.31 AM.png",
  "/certificates/Screenshot 2026-06-29 at 10.52.03 AM.png",
];

export const NAV_LINKS = [
  { label: "Meet", href: "#meet-me" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
];

export const EDUCATION = {
  degree: "B.E. Computer Science & Engineering",
  institution: "SJC Institute of Technology, Chikkaballapur",
  period: "2018 – 2022",
};

export const AWARDS = [
  "Best Performer Award (AA) — client recognition for outstanding engagement delivery",
  "Sponsored to build Turbotic Automation RPA pipeline — recognized for RPA initiative",
  "Visual Treat Award — Best Graphics Creator at company event",
  "Top 15 — BOSCH Ideathon 2K21 (Road Safety, organized by IRSC)",
];

export const CERT_HIGHLIGHTS = [
  "Databricks Certified Data Engineer Professional",
  "Databricks Certified Data Engineer Associate",
  "Google Professional Data Engineer",
  "OCI Generative AI Professional",
  "AWS Certified Cloud Practitioner",
  "Generative AI Leader — Google",
  "Anthropic · MCP & Claude 101",
];
