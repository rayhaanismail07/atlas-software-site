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
        <small>ATLAS / OPERATIONS</small>
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
            {["Active", "Review", "Complete"].map((label, index) => (
              <div key={label}><small>{label}</small><strong>{[24, 7, 91][index]}</strong></div>
            ))}
          </div>
          <div className="ops-board">
            {[0, 1, 2].map((column) => (
              <div key={column}>
                <span>{['Queued', 'In progress', 'Approved'][column]}</span>
                {[0, 1, 2].slice(0, column === 2 ? 2 : 3).map((card) => (
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
        <small>ATLAS / INTELLIGENCE</small>
        <MoreHorizontal />
      </div>
      <div className="data-layout">
        <div className="data-title"><span /></div>
        <div className="data-metrics">
          {["Revenue", "Efficiency", "Forecast"].map((item, index) => (
            <article key={item}><small>{item}</small><strong>{["R 2.4M", "84%", "+18%"][index]}</strong></article>
          ))}
        </div>
        <div className="data-chart">
          <svg viewBox="0 0 600 210" preserveAspectRatio="none">
            <defs>
              <linearGradient id="atlasChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5eeaff" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#5eeaff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 178 C52 160 60 122 118 132 C177 142 178 78 236 96 C294 114 309 50 372 70 C431 89 459 38 520 54 C555 62 575 34 600 24 L600 210 L0 210 Z" fill="url(#atlasChartFill)" />
            <path d="M0 178 C52 160 60 122 118 132 C177 142 178 78 236 96 C294 114 309 50 372 70 C431 89 459 38 520 54 C555 62 575 34 600 24" fill="none" stroke="#78edff" strokeWidth="3" />
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
          <small>WELCOME BACK</small>
          <strong>Your workspace</strong>
          <p>Everything you need, in one clear place.</p>
        </div>
        <div className="portal-cards">
          {["Documents", "Requests", "Messages"].map((label, index) => (
            <article key={label}>
              <small>{label}</small>
              <strong>{[12, 3, 5][index]}</strong>
            </article>
          ))}
        </div>
        <div className="portal-progress">
          <span><Check /> Profile complete</span>
          <small>92%</small>
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
