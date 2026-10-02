"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Sparkles, Terminal, Code2, Rocket, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pipelinePhases = [
  {
    number: "01",
    phase: "Discovery & Blueprint",
    duration: "Week 01",
    icon: Sparkles,
    tagline: "Uncovering root problems and establishing technical scope.",
    description: "Before writing any code, we clarify commercial objectives, map user journeys, assess data dependencies, and lock in exact system boundaries.",
    deliverables: [
      "Technical architecture specification & scope",
      "Core user journeys & permission matrices",
      "Typed API & relational schema contracts",
    ],
    accentColor: "from-sky-400 to-blue-600",
    dotColor: "bg-sky-400",
    glowColor: "rgba(56, 189, 248, 0.2)",
    badgeStyle: "bg-blue-500/10 text-sky-300 border-sky-400/30",
  },
  {
    number: "02",
    phase: "UX & Interface Architecture",
    duration: "Weeks 02–03",
    icon: Terminal,
    tagline: "Translating workflows into intuitive, high-velocity tools.",
    description: "We construct reusable design tokens, responsive layout hierarchies, and high-fidelity interactive prototypes designed for operator speed and zero friction.",
    deliverables: [
      "Modular design tokens & UI components",
      "Interactive high-fidelity clickable prototype",
      "Accessibility (WCAG 2.1 AA) & mobile validation",
    ],
    accentColor: "from-emerald-400 to-teal-600",
    dotColor: "bg-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    badgeStyle: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  },
  {
    number: "03",
    phase: "Full-Stack Agile Sprint",
    duration: "Weeks 04–07",
    icon: Code2,
    tagline: "Disciplined engineering sprints with continuous visibility.",
    description: "Production development across frontend components, API endpoints, relational schemas, and background worker queues with weekly live preview releases.",
    deliverables: [
      "Type-safe React & Next.js client layers",
      "High-throughput Python/Node API microservices",
      "Continuous weekly staging environment deployments",
    ],
    accentColor: "from-purple-400 to-indigo-600",
    dotColor: "bg-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    badgeStyle: "bg-purple-500/10 text-purple-300 border-purple-400/30",
  },
  {
    number: "04",
    phase: "CI/CD Deploy & Scale",
    duration: "Week 08 & Ongoing",
    icon: Rocket,
    tagline: "Zero-downtime release, automated telemetry, and evolution.",
    description: "We orchestrate containerized cloud deployments with automated security auditing, real-time performance telemetry, and ongoing optimization.",
    deliverables: [
      "Dockerized AWS / Cloud production provisioning",
      "Real-time error logging & performance telemetry",
      "Full repository hand-off & continuous feature scaling",
    ],
    accentColor: "from-amber-400 to-orange-600",
    dotColor: "bg-amber-400",
    glowColor: "rgba(245, 158, 11, 0.2)",
    badgeStyle: "bg-amber-500/10 text-amber-300 border-amber-400/30",
  },
];

export function Process() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="atlas-section process-section relative z-1 overflow-hidden">
      <Container>
        <div className="process-section__head mb-12">
          <Reveal>
            <SectionHeading
              label="04 / Process"
              title="A disciplined path from ambiguity to momentum."
              description="Clear decisions, visible progress, and an engineering rhythm that keeps business outcomes and code execution in sync."
            />
          </Reveal>
        </div>

        {/* Connected Technical Delivery Pipeline */}
        <div className="relative mt-8">
          {/* Top Progress Rail (Desktop) */}
          <div className="hidden lg:grid grid-cols-4 gap-4 relative mb-10 pb-4 border-b border-white/10">
            {/* Pulsing conduit track */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-gradient-to-r from-sky-500/30 via-emerald-500/30 via-purple-500/30 to-amber-500/30 pointer-events-none" />

            {pipelinePhases.map((phase, idx) => {
              const Icon = phase.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-3 rounded-xl transition-all duration-300 relative z-10 flex flex-col gap-2 group cursor-pointer ${
                    isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border ${
                        isActive
                          ? `${phase.dotColor} text-slate-950 font-black shadow-[0_0_20px_${phase.glowColor}] border-white`
                          : "bg-slate-900 border-white/20 text-slate-400 group-hover:border-white/40 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                      Phase {phase.number}
                    </span>
                  </div>
                  <strong
                    className={`text-sm font-semibold tracking-tight transition-colors line-clamp-1 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {phase.phase}
                  </strong>
                </button>
              );
            })}
          </div>

          {/* Full Pipeline Flow Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {pipelinePhases.map((phase, index) => {
              const Icon = phase.icon;
              const isSelected = activeStep === index;
              return (
                <Reveal key={phase.number} delay={index * 0.06} className="h-full">
                  <div
                    onMouseEnter={() => setActiveStep(index)}
                    className={`h-full rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl border ${
                      isSelected
                        ? "bg-slate-900/90 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                        : "bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Top gradient highlight bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.accentColor} transition-opacity duration-300 ${
                        isSelected ? "opacity-100" : "opacity-30"
                      }`}
                    />

                    <div>
                      {/* Phase Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-mono text-2xl font-bold text-white tracking-tight">
                          {phase.number}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border tracking-wider ${phase.badgeStyle}`}
                        >
                          <Clock className="w-3 h-3" />
                          {phase.duration}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-2">
                        {phase.phase}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed mb-6 font-normal">
                        {phase.description}
                      </p>

                      {/* Deliverables Checklist */}
                      <div className="pt-4 border-t border-white/10 space-y-2.5">
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
                          Key Deliverables
                        </span>
                        {phase.deliverables.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-2.5 text-xs text-slate-300/90 leading-normal"
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isSelected ? "text-sky-400" : "text-slate-500"
                              }`}
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Conduit */}
                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Milestone {index + 1}/4</span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isSelected ? "translate-x-1 text-white" : "text-slate-600"
                        }`}
                      />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
