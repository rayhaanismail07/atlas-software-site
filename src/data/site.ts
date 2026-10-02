import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Braces,
  CloudCog,
  Gauge,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react";

export const siteConfig = {
  name: "Atlas Software",
  shortName: "Atlas",
  tagline: "Your vision, engineered.",
  description:
    "Atlas Software designs and builds high-performance digital products, intelligent automation, data platforms, growth marketing, and cloud systems for modern businesses.",
  location: "Johannesburg, South Africa",
  instagram: "https://www.instagram.com/atlas__software/",
  contactEmail: "info@atlassoftware.co.za",
  whatsapp: "https://wa.me/27605551491?text=Hi%20Atlas%20Software%2C%20I%27d%20like%20to%20discuss%20a%20project.",
};

export const navigationItems = [
  { label: "Capabilities", href: "#services" },
  { label: "Marketing", href: "#marketing" },
  { label: "Systems", href: "#systems" },
  { label: "Process", href: "#process" },
  { label: "Studio", href: "#studio" },
  { label: "Tech Stack", href: "#tech-stack" },
];

export const capabilities = [
  "Digital products",
  "Business automation",
  "Data intelligence",
  "Digital marketing",
  "Cloud architecture",
  "AI-enabled systems",
  "Platform engineering",
];

export const services = [
  {
    number: "01",
    title: "Product engineering",
    description:
      "Purpose-built web applications, internal platforms, portals, and APIs designed around how your business actually operates.",
    icon: Braces,
    tags: ["Web applications", "APIs", "Client portals"],
    accent: "blue",
    size: "large",
  },
  {
    number: "02",
    title: "Digital marketing & growth",
    description:
      "Precision search engine optimization (SEO), paid performance acquisition, CRO, and analytics telemetry to scale client reach and revenue.",
    icon: TrendingUp,
    tags: ["Technical SEO", "Paid Search & Social", "CRO", "Attribution"],
    accent: "mint",
    size: "large",
  },
  {
    number: "03",
    title: "Automation systems",
    description:
      "Connected workflows that remove repetitive admin, reduce errors, and keep work moving across teams and tools.",
    icon: Workflow,
    tags: ["Workflows", "Integrations", "Operations"],
    accent: "cyan",
    size: "large",
  },
  {
    number: "04",
    title: "Data intelligence",
    description:
      "Reliable data pipelines, executive reporting, and decision-ready dashboards that turn information into action.",
    icon: BarChart3,
    tags: ["Analytics", "Dashboards", "Reporting"],
    accent: "violet",
    size: "small",
  },
  {
    number: "05",
    title: "Cloud & platform",
    description:
      "Secure, maintainable infrastructure built for performance, deployment confidence, and long-term growth.",
    icon: CloudCog,
    tags: ["Cloud", "DevOps", "Architecture"],
    accent: "amber",
    size: "small",
  },
  {
    number: "06",
    title: "Intelligent software",
    description:
      "Practical AI features and intelligent tools embedded into real workflows—not novelty demos disconnected from the business.",
    icon: Bot,
    tags: ["AI features", "Assistants", "Knowledge tools"],
    accent: "silver",
    size: "wide",
  },
] as const;

export const systemShowcases = [
  {
    number: "01",
    eyebrow: "Full-Stack Web Platforms",
    title: "End-to-end web applications built for speed, scale, and longevity.",
    description:
      "High-performance React and Next.js frontends powered by TypeScript, seamless server-side rendering, typed API contracts, and real-time state synchronization.",
    points: [
      "Server-side rendering (SSR) & Edge runtime",
      "Modular design systems & component architecture",
      "Real-time client portals & interactive state management",
    ],
    visual: "operations",
  },
  {
    number: "02",
    eyebrow: "High-Throughput APIs & Backends",
    title: "Resilient microservices, asynchronous queues, and clean endpoints.",
    description:
      "High-concurrency Python (FastAPI) and Node.js backend runtimes engineered with robust authentication, rigorous data validation, and asynchronous background worker pipelines.",
    points: [
      "Async job queues & Redis in-memory caching",
      "JWT & role-based zero-trust security",
      "Automated webhook pipelines & third-party integrations",
    ],
    visual: "data",
  },
  {
    number: "03",
    eyebrow: "Cloud, Database & DevOps Pipelines",
    title: "Scalable relational schemas and automated zero-downtime releases.",
    description:
      "Production-ready PostgreSQL databases, Redis caching layers, and containerized Docker and AWS environments built for continuous deployment and predictable performance.",
    points: [
      "PostgreSQL relational schema & query optimization",
      "Dockerized microservice container orchestration",
      "Automated CI/CD pipelines & production monitoring",
    ],
    visual: "portal",
  },
] as const;

export const principles = [
  {
    title: "Clarity before code",
    description: "We define the real business problem, users, constraints, and success measures before choosing technology.",
    icon: Sparkles,
  },
  {
    title: "Built as a system",
    description: "Product, data, automation, and infrastructure are designed to work together—not as disconnected pieces.",
    icon: Network,
  },
  {
    title: "Engineered to last",
    description: "Maintainable architecture, thoughtful security, and dependable delivery are part of the product from day one.",
    icon: ShieldCheck,
  },
  {
    title: "Designed for momentum",
    description: "Focused releases create value early while preserving a clear path for future capability and scale.",
    icon: Gauge,
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Frame",
    description: "Clarify the opportunity, users, workflow, constraints, and the outcome worth building toward.",
  },
  {
    number: "02",
    title: "Architect",
    description: "Shape the experience, system boundaries, data model, integrations, and delivery roadmap.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Build in focused iterations with visible progress, quality checks, and practical technical decisions.",
  },
  {
    number: "04",
    title: "Evolve",
    description: "Launch, monitor, improve, and expand the system as the business learns and grows.",
  },
];

export const footerLinks = [
  { label: "Instagram", href: siteConfig.instagram, external: true },
  { label: "Email", href: `mailto:${siteConfig.contactEmail}`, external: true },
  { label: "WhatsApp", href: siteConfig.whatsapp, external: true },
  { label: "Privacy", href: "/privacy", external: false },
];

export const availability = {
  label: "Project enquiries open",
  icon: ArrowUpRight,
};
