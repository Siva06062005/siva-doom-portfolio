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
    github: "https://github.com/SIva06062005",
    instagram: "https://www.instagram.com/siva_the_sharp"
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

export { projects } from "./projects";
export { certificates, getCertificates, getCertificateById } from "./certificates";

export const experience = [
  {
    company: "Burj Tech Consultancy",
    role: "DevOps Intern",
    mode: "In-person • Tiruvallur, Tamil Nadu, India",
    period: "Dec 2025 — Mar 2026",
    link: "https://drive.google.com/file/d/1h8JgB1kVwcsl5Tqb1w2rAhSE-BQhyQYc/view?usp=sharing",
    bullets: [
      "Automated cloud infrastructure provisioning using declarative Terraform, slashing environment setup times by over 40%.",
      "Configured end-to-end Jenkins CI/CD pipelines to automate containerized testing and builds on each pull request.",
      "Fine-tuned Ubuntu Linux kernel parameters (sysctl) and executed Root Cause Analysis (RCA) to ensure zero downtime."
    ]
  },
  {
    company: "Rasa.ai Labs (JKV Research)",
    role: "Data Science & AI Intern",
    mode: "Chennai, Tamil Nadu, India",
    period: "Jul 2025 — Aug 2025",
    link: "https://drive.google.com/file/d/1VgJxdMA_A5iKLXN1bdQyhP30_oTsyxDq/view?usp=sharing",
    bullets: [
      "Configured high-availability staging and compute environments for low-latency, real-time AI model inference pipelines.",
      "Authored custom Bash automation scripts for proactive monitoring of CPU/GPU utilization and memory footprints."
    ]
  },
  {
    company: "Remark Skill Education (IIT Hyderabad Partner)",
    role: "Data Science Intern",
    mode: "Remote",
    period: "Apr 2025 — May 2025",
    link: "https://drive.google.com/file/d/1GsY_LV3kwjT_IlbKdxRLPnntNPwJBIkW/view?usp=sharing",
    bullets: [
      "Executed customer segmentation models using K-Means clustering and built modular Python data extraction pipelines.",
      "Trained predictive classification models using Scikit-Learn and Pandas to deliver actionable business intelligence."
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