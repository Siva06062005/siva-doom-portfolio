export const profile = {
  name: "Siva S",
  role: "DevOps Engineer",
  location: "Tamil Nadu, India (IST UTC+5:30)",
  email: "sivasathiya0606@gmail.com",
  phone: "+91 7373628589",
  summary:
    "Performance-driven DevOps Engineer and Computer Science graduate focused on scalable, automated infrastructure, CI/CD pipelines, containerization, and bulletproof production reliability.",
  philosophy:
    "I believe infrastructure should never be an afterthought — it is the backbone of great software. Whether debugging root-cause kernel issues or orchestrating multi-container deployments, I build with discipline, speed, and zero tolerance for downtime.",
  socials: {
    linkedin: "https://www.linkedin.com/in/siva-selvaraj-0472432a1",
    github: "https://github.com/SIva06062005"
  }
};

export const stats = [
  ["01", "DevOps Focus", "Infrastructure as Code & CI/CD automation"],
  ["02", "Cloud Ecosystems", "AWS / GCP / Container Orchestration"],
  ["03", "Automation Stack", "Terraform / Jenkins / Docker / Bash"],
  ["04", "Engineering Degree", "B.E. Computer Science & Engineering"]
];

export const education = [
  {
    year: "2026",
    title: "B.E. Computer Science & Engineering",
    place: "Sriram Engineering College, Perumalpattu, Tamil Nadu",
    detail: "CGPA: 80.0% • Graduated May 2026 • Focus on Operating Systems & Distributed Architecture"
  },
  {
    year: "2022",
    title: "Higher Secondary School (HSS)",
    place: "Govt. Boys Hr. Sec. School, Perambakkam, Tamil Nadu",
    detail: "Score: 62.6% • Science & Mathematics Stream"
  },
  {
    year: "2020",
    title: "Secondary School Leaving Certificate (SSLC)",
    place: "St. Joseph’s Boys Hr. Sec. School, Keelacherry, Tamil Nadu",
    detail: "Score: 88.6% • Academic Excellence Distinction"
  }
];

export const skillGroups = [
  {
    category: "Cloud",
    title: "Cloud & Hosting",
    items: ["AWS EC2", "AWS S3", "Elastic Beanstalk", "Google Cloud Platform", "Hostinger Cloud"]
  },
  {
    category: "Infrastructure",
    title: "Infrastructure & DevOps",
    items: ["Terraform (IaC)", "Jenkins Pipelines", "Docker", "Docker Compose", "CI/CD Workflows", "Bash Scripting"]
  },
  {
    category: "Languages",
    title: "Languages & Web Stack",
    items: ["Java", "Python", "SQL", "Solidity", "React.js", "HTML5 / CSS3", "REST APIs"]
  },
  {
    category: "Blockchain",
    title: "Blockchain & Web3",
    items: ["Ethereum Ledger", "Hardhat", "Smart Contracts", "dApp Integration", "Web3.js"]
  },
  {
    category: "Platforms",
    title: "Operating Systems & Platforms",
    items: ["Ubuntu Linux", "Kali Linux", "Windows Server", "EFI / GRUB Boot Management", "Kernel Tuning"]
  },
  {
    category: "Strengths",
    title: "Engineering Disciplines",
    items: ["Root-Cause Analysis (RCA)", "System Troubleshooting", "High Availability Design", "Performance Optimization", "Technical Leadership"]
  }
];

export const projects = [
  {
    id: "smartpanchayat",
    title: "SmartPanchayat",
    category: "Blockchain Governance dApp",
    year: "May 2026",
    image: "/images/project-smartpanchayat.svg",
    description:
      "Decentralized governance platform using React.js and Java backend integration, with Hardhat smart-contract deployment and an immutable Ethereum ledger for transparent fund tracking.",
    architecture: "React Frontend → Web3 Provider → Solidity Smart Contract (Ethereum Testnet) → Java Microservices Middleware",
    metrics: [
      { label: "Ledger Integrity", value: "100% Immutable" },
      { label: "Tx Confirmation", value: "< 12s Avg" },
      { label: "Gas Efficiency", value: "Optimized Structs" }
    ],
    highlights: [
      "Eliminated intermediary fund tampering by executing village project grants via transparent smart contracts.",
      "Built a custom React dashboard with Web3 wallet connection and real-time transaction receipt tracking.",
      "Integrated Java backend services to bridge legacy municipal records with the blockchain ledger."
    ],
    stack: ["React.js", "Java", "Hardhat", "Solidity", "Ethereum", "Web3.js"]
  },
  {
    id: "genious-shoppy",
    title: "Genious Shoppy",
    category: "E-Commerce Analytics Engine",
    year: "Jul 2025",
    image: "/images/project-genious.png",
    description:
      "E-commerce analytics project using RFM analysis and explainable data workflows to support customer segmentation, pricing strategy and campaign triggers.",
    architecture: "Python Pipeline → Pandas RFM Matrix → SHAP/LIME Explainable AI → Dynamic Dashboard Visualizer",
    metrics: [
      { label: "Segmentation", value: "RFM 5-Tier" },
      { label: "Model Interpretability", value: "SHAP + LIME" },
      { label: "Data Processing", value: "Batch ETL" }
    ],
    highlights: [
      "Categorized thousands of customer transactions into Recency, Frequency, and Monetary scores.",
      "Implemented SHAP (SHapley Additive exPlanations) to give clear business rationales for automated marketing alerts.",
      "Reduced churn risk identification time by 40% through targeted data segment automation."
    ],
    stack: ["Python", "RFM Analysis", "SHAP", "LIME", "Pandas", "Scikit-Learn"]
  },
  {
    id: "scalable-ecommerce",
    title: "Scalable E-Commerce",
    category: "Cloud Web Application",
    year: "Apr 2025",
    image: "/images/project-ecommerce.svg",
    description:
      "Secure Flask and MySQL e-commerce platform designed around high availability and AWS S3 for static assets and image storage.",
    architecture: "AWS S3 Asset Bucket → Flask Application Container → MySQL Database Cluster (AWS RDS) → Nginx Reverse Proxy",
    metrics: [
      { label: "Asset Storage", value: "AWS S3 CDN" },
      { label: "Availability Target", value: "99.9%" },
      { label: "DB Connection Pool", value: "SQLAlchemy" }
    ],
    highlights: [
      "Offloaded media storage and static assets directly to AWS S3, reducing web server disk I/O.",
      "Configured Flask session security, CSRF protection, and parameterized SQL queries to block vulnerabilities.",
      "Streamlined deployment scripts for automated server provisioning and database migrations."
    ],
    stack: ["AWS S3", "Flask", "MySQL", "Python", "Nginx", "Docker"]
  }
];

export const experience = [
  {
    company: "Burj Tech Consultancy",
    role: "DevOps Intern",
    mode: "In-person • Tiruvallur, India",
    period: "Jan 2026 — Mar 2026",
    bullets: [
      "Automated cloud infrastructure provisioning using Terraform scripts, cutting environment deployment setup time significantly.",
      "Configured CI/CD pipelines in Jenkins to automate containerized build testing and deployment workflows.",
      "Utilized Docker Compose for multi-container orchestration and optimized Ubuntu server kernel configurations for high performance.",
      "Conducted root-cause analysis (RCA) on production incidents to prevent recurring infrastructure bottlenecks."
    ]
  },
  {
    company: "Rasa AI Labs",
    role: "Data Science & AI Intern",
    mode: "Chennai, India",
    period: "Jun 2025 — Jul 2025",
    bullets: [
      "Configured high-availability deployment environments for real-time AI model inference pipelines.",
      "Collaborated on server infrastructure tuning and resource allocation for compute-intensive data processing workloads.",
      "Built automated monitoring shell scripts to track GPU/CPU consumption and memory footprints during model runs."
    ]
  },
  {
    company: "Remark Skill Education",
    role: "Data Science Intern",
    mode: "Remote",
    period: "Apr 2025 — May 2025",
    bullets: [
      "Developed modular Python data extraction and preprocessing scripts, improving data pipeline throughput.",
      "Built predictive machine learning classifiers using Scikit-Learn to provide actionable business intelligence."
    ]
  }
];

/**
 * Functional Data Layer Accessors
 * Enables seamless future swap to headless CMS or remote API without altering UI components.
 */
export const getProfile = () => profile;
export const getStats = () => stats;
export const getEducation = () => education;
export const getSkillGroups = () => skillGroups;
export const getProjects = () => projects;
export const getProjectById = (id) => projects.find((p) => p.id === id);
export const getExperience = () => experience;