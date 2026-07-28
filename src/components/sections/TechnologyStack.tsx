"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { FaAws } from "react-icons/fa6";
import {
  SiCss,
  SiDocker,
  SiDotnet,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSharp,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

const Tech3DCanvas = dynamic(
  () => import("@/components/sections/Tech3DCanvas").then((m) => m.Tech3DCanvas),
  { ssr: false },
);

const stackGroups = [
  {
    number: "01",
    label: "Languages",
    accent: "#61e7fb",
    items: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "Python", icon: SiPython, color: "#4b8bbe" },
      { name: "C#", icon: SiSharp, color: "#9b4f96" },
      { name: "HTML5", icon: SiHtml5, color: "#e34f26" },
      { name: "CSS", icon: SiCss, color: "#663399" },
    ],
  },
  {
    number: "02",
    label: "Applications",
    accent: "#6ca8ff",
    items: [
      { name: "React", icon: SiReact, color: "#61dafb" },
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06b6d4" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
      { name: ".NET", icon: SiDotnet, color: "#8a5cd7" },
      { name: "GraphQL", icon: SiGraphql, color: "#e10098" },
    ],
  },
  {
    number: "03",
    label: "Data & intelligence",
    accent: "#7bf1cd",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169e1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
      { name: "Redis", icon: SiRedis, color: "#ff4438" },
      { name: "OpenAI", icon: TbBrandOpenai, color: "#74aa9c" },
      { name: "TensorFlow", icon: SiTensorflow, color: "#ff6f00" },
    ],
  },
  {
    number: "04",
    label: "Cloud & delivery",
    accent: "#9d8cff",
    items: [
      { name: "Azure", icon: VscAzure, color: "#0089d6" },
      { name: "AWS", icon: FaAws, color: "#ff9900" },
      { name: "Docker", icon: SiDocker, color: "#2496ed" },
      { name: "Git", icon: SiGit, color: "#f05032" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088ff" },
    ],
  },
] as const;

export function TechnologyStack() {
  return (
    <div className="technology-board">
      <div className="technology-board__intro">
        <div>
          <span className="atlas-label">Technical capability</span>
          <h3>A modern stack, selected for the system.</h3>
          <p>
            We choose proven languages, frameworks, data tools, and cloud
            platforms around the product—not the other way around.
          </p>
        </div>
        <span className="technology-board__status">
          Production ready
        </span>
      </div>

      {/* 3D Tech Constellation Canvas */}
      <Tech3DCanvas />

      <div className="technology-stack">
        {stackGroups.map((group) => (
          <article
            key={group.label}
            className="technology-stack__group"
            style={{ "--group-accent": group.accent } as CSSProperties}
          >
            <header>
              <small>{group.number}</small>
              <h4>{group.label}</h4>
            </header>
            <div className="technology-stack__items">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="technology-stack__item"
                    style={{ "--tech-color": item.color } as CSSProperties}
                  >
                    <span><Icon aria-hidden="true" /></span>
                    <strong>{item.name}</strong>
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
