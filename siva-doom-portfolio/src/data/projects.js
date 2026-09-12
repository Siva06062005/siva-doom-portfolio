export const projects = [
  {
    id: "smartpanchayat",
    title: "SmartPanchayat",
    shortDescription: "Decentralized governance dApp leveraging Ethereum smart contracts and Java backend for transparent village fund tracking.",
    description:
      "Decentralized governance platform using React.js and Java backend integration, with Hardhat smart-contract deployment and an immutable Ethereum ledger for transparent fund tracking.",
    category: "Blockchain Governance dApp",
    year: "May 2026",
    image: "/images/project-smartpanchayat.svg",
    githubUrl: "https://github.com/SIva06062005",
    liveUrl: "https://smart-panchayat-p2tr.vercel.app/",
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
    technologies: ["React.js", "Java", "Hardhat", "Solidity", "Ethereum", "Web3.js"],
    stack: ["React.js", "Java", "Hardhat", "Solidity", "Ethereum", "Web3.js"]
  },
  {
    id: "fake-news-pipeline",
    title: "Fake News Data Processing & Classification Pipeline",
    shortDescription: "End-to-end data engineering and ML pipeline extracting news data, validating and loading into MySQL, and classifying real vs fake news using TF-IDF and Scikit-Learn.",
    description:
      "End-to-end Data Engineering and Machine Learning pipeline for Fake News Detection. The pipeline extracts raw news data, performs validation and transformation, loads cleaned data into MySQL, conducts exploratory data analysis (EDA), engineers features using TF-IDF, and trains machine learning models to classify news as Fake or Real.",
    category: "Data Engineering / ML",
    year: "2026",
    image: "/images/project-fakenews.svg",
    githubUrl: "https://github.com/SIva06062005",
    liveUrl: "https://fake-news-classifier-demo.vercel.app/", // DUMMY LINK: Replace with your actual live URL
    architecture: "Raw Data (44,898) → Extract & Validate → Transform → Load (MySQL 44,058) → EDA → TF-IDF Vectorization → ML Classifier Training → Prediction",
    metrics: [
      { label: "Clean Records", value: "44,058" },
      { label: "ETL Accuracy", value: "99.1%" },
      { label: "Train / Test", value: "80 / 20" },
      { label: "Storage Engine", value: "MySQL" }
    ],
    highlights: [
      "Built a complete ETL pipeline processing 44,898 records from Fake.csv and True.csv, eliminating 209 duplicates and 631 empty rows.",
      "Conducted exploratory data analysis including fake vs real distribution, subject analysis, and text length distributions.",
      "Trained and evaluated Scikit-Learn classification models including Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting."
    ],
    technologies: ["Python", "SQL", "MySQL", "Pandas", "Scikit-Learn", "TF-IDF", "NumPy", "Matplotlib", "Git"],
    stack: ["Python", "SQL", "MySQL", "Pandas", "Scikit-Learn", "TF-IDF", "NumPy", "Matplotlib"]
  },
  {
    id: "genious-shoppy",
    title: "Genious Shoppy",
    shortDescription: "E-commerce analytics engine utilizing RFM segmentation and explainable AI (SHAP & LIME) to automate marketing campaign triggers.",
    description:
      "E-commerce analytics project using RFM analysis and explainable data workflows to support customer segmentation, pricing strategy and campaign triggers.",
    category: "E-Commerce Analytics Engine",
    year: "Jul 2025",
    image: "/images/project-genious.png",
    githubUrl: "https://github.com/SIva06062005",
    liveUrl: "https://genious-shoppy-analytics.vercel.app/", // DUMMY LINK: Replace with your actual live URL
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
    technologies: ["Python", "RFM Analysis", "SHAP", "LIME", "Pandas", "Scikit-Learn"],
    stack: ["Python", "RFM Analysis", "SHAP", "LIME", "Pandas", "Scikit-Learn"]
  },
  {
    id: "scalable-ecommerce",
    title: "Scalable E-Commerce",
    shortDescription: "High-availability Flask and MySQL e-commerce system with AWS S3 asset offloading, containerized deployment, and Nginx proxying.",
    description:
      "Secure Flask and MySQL e-commerce platform designed around high availability and AWS S3 for static assets and image storage.",
    category: "Cloud Web Application",
    year: "Apr 2025",
    image: "/images/project-ecommerce.svg",
    githubUrl: "https://github.com/SIva06062005",
    liveUrl: "https://scalable-ecommerce-platform.vercel.app/", // DUMMY LINK: Replace with your actual live URL
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
    technologies: ["AWS S3", "Flask", "MySQL", "Python", "Nginx", "Docker"],
    stack: ["AWS S3", "Flask", "MySQL", "Python", "Nginx", "Docker"]
  }
];
