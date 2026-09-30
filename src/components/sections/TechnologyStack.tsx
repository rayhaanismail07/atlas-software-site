"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { FaAws, FaJava, FaLinux } from "react-icons/fa6";
import {
  SiCloudflare,
  SiCss,
  SiDocker,
  SiDotnet,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGooglecloud,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiSass,
  SiSharp,
  SiSpringboot,
  SiSqlite,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWordpress,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

const Tech3DCanvas = dynamic(
  () => import("@/components/sections/Tech3DCanvas").then((m) => m.Tech3DCanvas),
  { ssr: false },
);

type TechItem = {
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  color: string;
};

type StackGroup = {
  number: string;
  label: string;
  description: string;
  accent: string;
  items: TechItem[];
};

export const stackGroups: StackGroup[] = [
  {
    number: "01",
    label: "Programming Languages",
    description: "Core algorithms, strongly typed architectures, and high-throughput runtimes.",
    accent: "#38bdf8",
    items: [
      { name: "Python", role: "Automation, AI & Scripting", icon: SiPython, color: "#3776AB" },
      { name: "TypeScript", role: "Type-Safe Architecture", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript (ES6+)", role: "Web & Node.js Runtime", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Java", role: "Enterprise OOP & Systems", icon: FaJava, color: "#ED8B00" },
      { name: "C# / .NET Core", role: "Full-Stack MVC Services", icon: SiSharp, color: "#9B4F96" },
      { name: "PHP 8+", role: "LAMP & Custom Modules", icon: SiPhp, color: "#777BB4" },
    ],
  },
  {
    number: "02",
    label: "Frontend UI Systems",
    description: "Component architecture, high-performance rendering, and motion-rich interfaces.",
    accent: "#60a5fa",
    items: [
      { name: "React.js", role: "Component Architecture", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", role: "SSR, SSG & App Router", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Tailwind CSS", role: "Design Tokens & Utilities", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Three.js & WebGL", role: "3D Canvas, Shaders & Motion", icon: SiThreedotjs, color: "#00F0FF" },
      { name: "Semantic HTML5", role: "WCAG 2.1 AA Accessibility", icon: SiHtml5, color: "#E34F26" },
      { name: "SASS & Modern CSS", role: "Fluid Animations & Grids", icon: SiSass, color: "#CC6699" },
    ],
  },
  {
    number: "03",
    label: "Backend & APIs",
    description: "High-throughput asynchronous services, resilient microservices, and contract APIs.",
    accent: "#4ade80",
    items: [
      { name: "Node.js / Express", role: "RESTful Microservices", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "FastAPI / Python", role: "High-Throughput Async APIs", icon: SiFastapi, color: "#009688" },
      { name: "ASP.NET Core", role: "Enterprise Security Services", icon: SiDotnet, color: "#512BD4" },
      { name: "Spring Boot", role: "Java Cloud Services & DI", icon: SiSpringboot, color: "#6DB33F" },
      { name: "WordPress / WooCommerce", role: "Custom Hooks & Plugins", icon: SiWordpress, color: "#21759B" },
      { name: "REST & GraphQL", role: "API Contract Architecture", icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    number: "04",
    label: "Databases & Storage",
    description: "Relational clusters, sub-millisecond in-memory caching, and vector embedding stores.",
    accent: "#a78bfa",
    items: [
      { name: "PostgreSQL & pgvector", role: "Relational & AI Embeddings", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL Server", role: "High-Availability RDBMS", icon: SiMysql, color: "#4479A1" },
      { name: "Redis In-Memory", role: "Sub-ms Caching & Queues", icon: SiRedis, color: "#DC382D" },
      { name: "SQLite / Embedded", role: "Serverless Datastores", icon: SiSqlite, color: "#003B57" },
      { name: "OpenAI / AI Embeddings", role: "Vector Search & Retrieval", icon: TbBrandOpenai, color: "#74AA9C" },
      { name: "Schema & Index Design", role: "ACID Query Optimization", icon: SiPostgresql, color: "#38BDF8" },
    ],
  },
  {
    number: "05",
    label: "Cloud & Infrastructure",
    description: "Scalable containerized deployment, automated orchestration, and edge networks.",
    accent: "#fbbf24",
    items: [
      { name: "AWS Cloud", role: "EC2, S3, CloudFront & Lambda", icon: FaAws, color: "#FF9900" },
      { name: "Google Cloud (GCP)", role: "Cloud Run & BigQuery", icon: SiGooglecloud, color: "#4285F4" },
      { name: "Docker & Containers", role: "Multi-Stage Isolated Builds", icon: SiDocker, color: "#2496ED" },
      { name: "Linux / Ubuntu", role: "Server Hardening & Shell", icon: FaLinux, color: "#FCC624" },
      { name: "Nginx & Proxies", role: "Reverse Proxy & SSL", icon: SiNginx, color: "#009639" },
      { name: "Cloudflare & Edge", role: "Global CDN & WAF Security", icon: SiCloudflare, color: "#F38020" },
    ],
  },
  {
    number: "06",
    label: "DevOps & Tooling",
    description: "Automated continuous delivery pipelines, contract testing, and production telemetry.",
    accent: "#f472b6",
    items: [
      { name: "Git & GitHub Actions", role: "CI/CD Automation Pipelines", icon: SiGit, color: "#F05032" },
      { name: "Vite & Modern Bundlers", role: "ESM Build Tooling", icon: SiVite, color: "#646CFF" },
      { name: "Postman & Newman", role: "Automated API Contract Tests", icon: SiPostman, color: "#FF6C37" },
      { name: "Vercel & Production", role: "Serverless Edge Deployments", icon: SiVercel, color: "#FFFFFF" },
      { name: "VS Code Ecosystem", role: "Profiling, Linters & Workflows", icon: VscVscode, color: "#007ACC" },
      { name: "GitHub DevSecOps", role: "Branch Protection & Scans", icon: SiGithubactions, color: "#2088FF" },
    ],
  },
];

export function TechnologyStack() {
  return (
    <div className="technology-board">
      <div className="technology-board__intro">
        <div>
          <span className="atlas-label">04 // Technical capability</span>
          <h3>Engineering Ecosystem &amp; Production Stack.</h3>
          <p>
            Production-grade languages, reactive frontend frameworks, resilient backend systems,
            scalable databases, and DevOps infrastructure selected specifically for your product&apos;s
            scalability and performance.
          </p>
        </div>
        <span className="technology-board__status">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2 inline-block" />
          Production ready
        </span>
      </div>

      {/* 3D Tech Constellation Canvas */}
      <Tech3DCanvas />

      {/* Complete 6-Category Grid from Portfolio */}
      <div className="technology-stack">
        {stackGroups.map((group) => (
          <article
            key={group.label}
            className="technology-stack__group"
            style={{ "--group-accent": group.accent } as CSSProperties}
          >
            <header>
              <div className="flex items-center gap-2.5">
                <small>{group.number}</small>
                <h4>{group.label}</h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">6 tools</span>
            </header>
            <p className="text-xs text-slate-400/80 mt-2 mb-3 leading-relaxed font-normal">
              {group.description}
            </p>
            <div className="technology-stack__items">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="technology-stack__item"
                    style={{ "--tech-color": item.color } as CSSProperties}
                  >
                    <span>
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="technology-stack__item-copy min-w-0 flex-1">
                      <strong className="block truncate">{item.name}</strong>
                      <small className="block truncate text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.role}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
