"use client";

import dynamic from "next/dynamic";
import { Check, MoreHorizontal } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { systemShowcases } from "@/data/site";

const System3DCanvas = dynamic(
  () => import("@/components/sections/System3DCanvas").then((m) => m.System3DCanvas),
  { ssr: false },
);

function OperationsVisual() {
  return (
    <div className="system-mock system-mock--operations" aria-hidden="true">
      <div className="mock-window__bar">
        <small>ATLAS / FULL-STACK PLATFORM</small>
        <MoreHorizontal />
      </div>
      <div className="ops-layout">
        <aside>
          <b>A</b>
          {[0, 1, 2, 3].map((item) => <span key={item} className={item === 0 ? "active" : ""} />)}
        </aside>
        <div className="ops-main">
          <div className="ops-head"><span /></div>
          <div className="ops-stats">
            {["SSR Latency", "Edge Hit Rate", "Active Sessions"].map((label, index) => (
              <div key={label}><small>{label}</small><strong>{["114ms", "99.4%", "14.2k"][index]}</strong></div>
            ))}
          </div>
          <div className="ops-board">
            {["Next.js App", "API Routes", "Production"].map((column, colIdx) => (
              <div key={column}>
                <span>{column}</span>
                {[0, 1, 2].slice(0, colIdx === 2 ? 2 : 3).map((card) => (
                  <article key={card}><i /><b /><small /></article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataVisual() {
  return (
    <div className="system-mock system-mock--data" aria-hidden="true">
      <div className="mock-window__bar">
        <small>ATLAS / ASYNC API &amp; BACKEND</small>
        <MoreHorizontal />
      </div>
      <div className="data-layout">
        <div className="data-title"><span /></div>
        <div className="data-metrics">
          {["Active Endpoints", "Throughput", "p95 Latency"].map((item, index) => (
            <article key={item}><small>{item}</small><strong>{["52 APIs", "3.4k req/s", "14ms"][index]}</strong></article>
          ))}
        </div>
        <div className="data-chart">
          <svg viewBox="0 0 600 210" preserveAspectRatio="none">
            <defs>
              <linearGradient id="atlasChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0077ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 178 C52 160 60 122 118 132 C177 142 178 78 236 96 C294 114 309 50 372 70 C431 89 459 38 520 54 C555 62 575 34 600 24 L600 210 L0 210 Z" fill="url(#atlasChartFill)" />
            <path d="M0 178 C52 160 60 122 118 132 C177 142 178 78 236 96 C294 114 309 50 372 70 C431 89 459 38 520 54 C555 62 575 34 600 24" fill="none" stroke="#38bdf8" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PortalVisual() {
  return (
    <div className="system-mock system-mock--portal" aria-hidden="true">
      <div className="portal-shell">
        <div className="portal-brand"><b>A</b></div>
        <div className="portal-welcome">
          <small>DATABASE &amp; CLOUD PIPELINE</small>
          <strong>PostgreSQL &amp; Docker Core</strong>
          <p>Automated zero-downtime releases and managed cluster state.</p>
        </div>
        <div className="portal-cards">
          {["PostgreSQL Pool", "Docker Containers", "CI/CD Pipeline"].map((label, index) => (
            <article key={label}>
              <small>{label}</small>
              <strong>{["Connected", "8 Active", "Passing"][index]}</strong>
            </article>
          ))}
        </div>
        <div className="portal-progress">
          <span><Check /> Zero-Downtime Deployment Verified</span>
          <small>100%</small>
        </div>
      </div>
    </div>
  );
}

const visuals = {
  operations: OperationsVisual,
  data: DataVisual,
  portal: PortalVisual,
};

export function SystemArchitecture() {
  return (
    <section id="systems" className="atlas-section systems-section">
      <Container>
        <Reveal>
          <SectionHeading
            label="03 / Systems"
            title="Not just screens. Complete working systems."
            description="Examples of the kinds of digital systems Atlas can shape around your operations, data, teams, and customers."
          />
        </Reveal>

        {/* Real-time 3D Architectural Flow Canvas */}
        <System3DCanvas />

        <div className="systems-list">
          {systemShowcases.map((system, index) => {
            const Visual = visuals[system.visual];
            return (
              <Reveal key={system.number} className="system-row" delay={index * 0.04}>
                <div className="system-row__copy">
                  <span className="system-row__number">{system.number}</span>
                  <small>{system.eyebrow}</small>
                  <h3>{system.title}</h3>
                  <p>{system.description}</p>
                  <ul>
                    {system.points.map((point) => (
                      <li key={point}><Check aria-hidden="true" /> {point}</li>
                    ))}
                  </ul>
                </div>
                <div className="system-row__visual">
                  <Interactive3DTilt maxTilt={8} scale={1.015}>
                    <Visual />
                  </Interactive3DTilt>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
