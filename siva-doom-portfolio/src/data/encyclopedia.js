// ═══════════════════════════════════════════════════════════════════
// SIVA S PORTFOLIO — ENGINEERING ENCYCLOPEDIA KNOWLEDGE BASE
// Comprehensive definitions, architecture, and Siva's production implementation
// ═══════════════════════════════════════════════════════════════════

export const encyclopedia = [
  {
    id: "devops",
    title: "DevOps",
    keywords: ["devops", "development and operations", "what is devops"],
    summary:
      "DevOps is an engineering culture and methodology combining software development (Dev) and IT operations (Ops). It focuses on shortening development cycles, automating deployments, and maintaining dependable production reliability.",
    sivaContext:
      "Siva builds with a DevOps-first discipline: authoring Terraform for Infrastructure as Code, configuring Jenkins CI/CD pipelines, and practicing root cause analysis for zero production downtime."
  },
  {
    id: "docker",
    title: "Docker & Containerization",
    keywords: ["docker", "container", "containers", "containerization", "docker compose"],
    summary:
      "Docker is an open-source platform that packages applications and dependencies into standardized containers using Linux cgroups and namespaces, ensuring consistent execution across development, staging, and production.",
    sivaContext:
      "Siva designs optimized multi-stage Dockerfiles and uses Docker Compose for local microservice orchestration and isolated staging environments."
  },
  {
    id: "kubernetes",
    title: "Kubernetes (K8s)",
    keywords: ["kubernetes", "k8s", "container orchestration", "orchestration"],
    summary:
      "Kubernetes is an open-source container orchestration system for automating the deployment, scaling, and operational management of containerized workloads across server clusters.",
    sivaContext:
      "Siva leverages container orchestration concepts to ensure self-healing deployments, load-balanced traffic distribution, and automated rollouts."
  },
  {
    id: "terraform",
    title: "Terraform (Infrastructure as Code)",
    keywords: ["terraform", "iac", "infrastructure as code", "hashicorp terraform"],
    summary:
      "Terraform is an open-source Infrastructure as Code tool by HashiCorp that allows engineers to safely and predictably define, provision, and version cloud resources using declarative configuration files.",
    sivaContext:
      "During his internship at Burj Tech Consultancy, Siva wrote modular Terraform scripts to automate cloud provisioning, drastically reducing manual setup time."
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    keywords: ["ci cd", "cicd", "continuous integration", "continuous delivery", "continuous deployment", "jenkins pipeline"],
    summary:
      "CI/CD represents Continuous Integration and Continuous Deployment. It automates code merging, unit testing, security scanning, artifact packaging, and zero-downtime deployment into production environments.",
    sivaContext:
      "Siva configures Jenkins pipelines that automatically trigger containerized test suites on pull requests and gate deployments behind automated quality checks."
  },
  {
    id: "aws",
    title: "Amazon Web Services (AWS)",
    keywords: ["aws", "amazon web services", "cloud computing", "cloud infrastructure"],
    summary:
      "AWS is the world's most comprehensive cloud computing platform, providing over 200 fully featured services including virtual compute (EC2), scalable storage (S3), and managed databases (RDS).",
    sivaContext:
      "Siva builds cloud architectures on AWS EC2, S3 bucket storage, Elastic Beanstalk, and RDS MySQL, with a focus on high availability and least-privilege security."
  },
  {
    id: "s3",
    title: "Amazon S3 (Simple Storage Service)",
    keywords: ["s3", "amazon s3", "s3 bucket", "bucket storage", "object storage"],
    summary:
      "Amazon S3 is high-durability object storage offering 99.999999999% durability. It stores unformatted data files with metadata and bucket policy access controls.",
    sivaContext:
      "In his Scalable E-Commerce build, Siva offloaded media files directly to S3 buckets, dramatically reducing web server disk I/O and latency."
  },
  {
    id: "ec2",
    title: "Amazon EC2 (Elastic Compute Cloud)",
    keywords: ["ec2", "amazon ec2", "virtual server", "compute instance"],
    summary:
      "Amazon EC2 provides resizable compute capacity in the cloud. It allows engineers to launch virtual server instances with custom operating systems, security groups, and storage volumes.",
    sivaContext:
      "Siva provisions Ubuntu EC2 instances automated with custom user-data bash scripts and hardened security group ingress rules."
  },
  {
    id: "linux-kernel",
    title: "Linux Kernel & OS Tuning",
    keywords: ["linux", "kernel", "linux kernel", "kernel tuning", "ubuntu", "kali linux", "sysctl"],
    summary:
      "The Linux kernel is the core interface between computer hardware and user processes. Kernel tuning involves configuring sysctl parameters like file descriptors, socket buffers, and swapiness for high throughput.",
    sivaContext:
      "Siva has hands-on systems experience with Ubuntu and Kali Linux, tuning TCP buffers, bootloader parameters (GRUB/EFI), and monitoring process resource consumption."
  },
  {
    id: "high-availability",
    title: "High Availability (HA)",
    keywords: ["high availability", "ha", "99 9", "uptime", "fault tolerance", "redundancy"],
    summary:
      "High Availability refers to systems engineered to operate continuously without failure for critical durations, typically measured as 99.9% ('three nines') uptime through redundant nodes and automated failover.",
    sivaContext:
      "Siva designs infrastructure architectures with zero single points of failure, multi-region fallback, and automated health check probes."
  },
  {
    id: "microservices",
    title: "Microservices Architecture",
    keywords: ["microservices", "microservice", "distributed architecture", "monolith vs microservices"],
    summary:
      "Microservices is an architectural pattern that structures an application as a collection of small, independently deployable, loosely coupled services communicating over lightweight protocols like REST or gRPC.",
    sivaContext:
      "Siva integrates microservice bridges such as Java middleware and Flask backend services with containerized communication networks."
  },
  {
    id: "nginx",
    title: "Nginx Reverse Proxy & Web Server",
    keywords: ["nginx", "reverse proxy", "load balancer", "web server"],
    summary:
      "Nginx is a high-performance HTTP web server and reverse proxy that handles thousands of concurrent connections, load balancing, SSL termination, and HTTP caching with low memory usage.",
    sivaContext:
      "Siva deploys Nginx as an edge reverse proxy in his projects to enforce HTTPS encryption, mitigate rate-limiting attacks, and route traffic to application containers."
  },
  {
    id: "rca",
    title: "Root Cause Analysis (RCA)",
    keywords: ["root cause analysis", "rca", "troubleshooting", "5 whys", "incident postmortem"],
    summary:
      "Root Cause Analysis is a structured problem-solving methodology aimed at identifying the fundamental underlying factor causing an incident, preventing its recurrence through the '5 Whys' technique.",
    sivaContext:
      "Siva prioritizes RCA during system incidents: tracing kernel logs, network traces, and pipeline logs to fix underlying flaws rather than applying superficial patches."
  },
  {
    id: "blockchain",
    title: "Blockchain Technology",
    keywords: ["blockchain", "distributed ledger", "cryptography", "immutable ledger"],
    summary:
      "A blockchain is a decentralized, distributed, and publicly verifiable digital ledger that records transactions across many computers, ensuring data immutability through cryptographic hashing.",
    sivaContext:
      "Siva developed SmartPanchayat, a decentralized governance platform utilizing blockchain ledgers for 100% tamper-proof civic grant management."
  },
  {
    id: "ethereum",
    title: "Ethereum & EVM",
    keywords: ["ethereum", "evm", "ethereum virtual machine", "ether", "gas fee"],
    summary:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality. The Ethereum Virtual Machine (EVM) executes Turing-complete code across a decentralized network of nodes.",
    sivaContext:
      "Siva deploys and tests smart contracts on Ethereum testnets, optimizing data structs to minimize gas consumption and confirmation latency."
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    keywords: ["smart contract", "smart contracts", "solidity contract"],
    summary:
      "Smart contracts are self-executing programs stored on a blockchain that automatically execute when predetermined conditions are verified, removing intermediaries and human error.",
    sivaContext:
      "Siva authors Solidity smart contracts with automated modifier checks to enforce transparency in civic funds and decentralized village administration."
  },
  {
    id: "rfm",
    title: "RFM Analysis (Recency, Frequency, Monetary)",
    keywords: ["rfm", "rfm analysis", "customer segmentation", "monetary score"],
    summary:
      "RFM is a behavioral customer segmentation model that evaluates: Recency (how recently a customer made a transaction), Frequency (how often), and Monetary value (total spent) to identify VIPs and churn risks.",
    sivaContext:
      "In his Genious Shoppy project, Siva constructed a Python RFM segmentation matrix, grouping customers into actionable business tiers."
  },
  {
    id: "explainable-ai",
    title: "Explainable AI (XAI) — SHAP & LIME",
    keywords: ["explainable ai", "shap", "lime", "model interpretability", "xai"],
    summary:
      "Explainable AI refers to methods that make black-box machine learning models transparent. SHAP uses game-theoretic Shapley values, while LIME builds local surrogate models to explain specific predictions.",
    sivaContext:
      "Siva implemented SHAP and LIME in Genious Shoppy to provide business executives with clear rationales for why customers were flagged for churn risk."
  },
  {
    id: "rest-api",
    title: "REST APIs (Representational State Transfer)",
    keywords: ["rest api", "restful api", "rest", "http verbs", "api"],
    summary:
      "REST is an architectural style for networked hypermedia applications. It enforces stateless communication, uniform resource identification via URLs, and standard HTTP verbs (GET, POST, PUT, DELETE).",
    sivaContext:
      "Siva designs clean RESTful endpoints connecting React web frontends with Java and Python application servers."
  },
  {
    id: "flask",
    title: "Flask Web Framework",
    keywords: ["flask", "python flask", "wsgi", "microframework"],
    summary:
      "Flask is a lightweight Python WSGI web application framework designed to make getting started quick and easy, with the ability to scale up to complex microservices.",
    sivaContext:
      "Siva engineered his Scalable E-Commerce platform using Flask, configuring session security, parameterized SQL queries, and CSRF protection."
  },
  {
    id: "react",
    title: "React.js",
    keywords: ["react", "reactjs", "react js", "frontend framework", "virtual dom"],
    summary:
      "React is a component-based frontend JavaScript library developed by Meta. It utilizes a virtual DOM, unidirectional data flow, and reactive state management for high-speed user interfaces.",
    sivaContext:
      "Siva builds interactive applications with React, including this dual-theme portfolio, custom Web3 wallet connect dashboards, and terminal emulators."
  },
  {
    id: "sql",
    title: "SQL & Relational Databases",
    keywords: ["sql", "mysql", "database", "relational database", "acid"],
    summary:
      "SQL (Structured Query Language) is the domain-specific standard for managing relational databases, providing ACID (Atomicity, Consistency, Isolation, Durability) transactional integrity.",
    sivaContext:
      "Siva designs relational database schemas, tunes MySQL connection pools, and writes optimized queries to prevent latency bottlenecks under concurrent user traffic."
  },
  {
    id: "zero-downtime",
    title: "Zero Downtime Deployments",
    keywords: ["zero downtime", "blue green deployment", "canary deployment", "rolling update"],
    summary:
      "Zero Downtime Deployment is an operational strategy that updates application software without dropping existing user traffic, commonly achieved via Blue-Green, Canary, or rolling container updates.",
    sivaContext:
      "Siva builds deployment automation with zero tolerance for service interruption, switching reverse-proxy upstreams only after new containers pass health checks."
  },
  {
    id: "chaos-engineering",
    title: "Chaos Engineering",
    keywords: ["chaos engineering", "fault injection", "system resilience", "chaos monkey"],
    summary:
      "Chaos Engineering is the discipline of experimenting on a software system in production or staging to build confidence in the system's capability to withstand turbulent and unexpected conditions.",
    sivaContext:
      "Siva approaches infrastructure with chaos testing in mind: simulating failed nodes, testing database failover, and validating that CI/CD rollbacks function reliably."
  }
];

/**
 * Searches the encyclopedia for a matching topic.
 * Requires minimum 3 characters to prevent false positives.
 */
export function lookupEncyclopedia(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // Minimum query length to avoid false positives (e.g. "a" matching everything)
  if (q.length < 3) return null;

  // 1. Exact keyword match — query must contain the keyword OR keyword must contain the query
  for (const entry of encyclopedia) {
    if (entry.keywords.some((kw) => q.includes(kw) || (q.length >= 4 && kw.includes(q)))) {
      return entry;
    }
  }

  // 2. Title match — only if query is at least 4 characters
  if (q.length >= 4) {
    for (const entry of encyclopedia) {
      if (q.includes(entry.id) || entry.title.toLowerCase().includes(q)) {
        return entry;
      }
    }
  }

  return null;
}
