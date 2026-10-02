"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Cpu,
  Layers,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HeroScene = dynamic(
  () => import("@/components/sections/HeroScene").then((module) => module.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="hero-three hero-three--loading" aria-hidden="true">
        <span />
      </div>
    ),
  },
);

const telemetryPills = [
  {
    icon: Layers,
    title: "Full-Stack Products",
    desc: "React, Next.js & TypeScript",
    accent: "text-sky-300 bg-blue-500/15 border-blue-400/30",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    desc: "Async Python, APIs & ETL",
    accent: "text-blue-300 bg-blue-500/15 border-blue-400/30",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Cloud",
    desc: "AWS, Docker & Zero-Trust",
    accent: "text-emerald-300 bg-emerald-500/15 border-emerald-400/30",
  },
  {
    icon: Cpu,
    title: "Data & AI Runtimes",
    desc: "Postgres, Vector & Models",
    accent: "text-purple-300 bg-purple-500/15 border-purple-400/30",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero hero--cinematic relative overflow-hidden">
      {/* 3D Interactive Cyber Wave Canvas (Full Viewport Background) */}
      <div className="hero-canvas-wrap" aria-hidden="true">
        <HeroScene />
      </div>

      <Container className="hero__inner hero__inner--centered relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="hero__copy-centered"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Hero Main Headline */}
          <h1 className="hero__title-cinematic">
            Your Vision,
            <span className="block bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,119,255,0.35)] pb-3 sm:pb-4">
              Precision Engineered.
            </span>
          </h1>

          {/* Hero Lead Subheading */}
          <p className="hero__lead hero__lead--centered max-w-2xl mx-auto mt-6 text-slate-300/90 text-base sm:text-lg leading-relaxed">
            Atlas Software designs and builds scalable digital products, intelligent automation,
            data platforms, and enterprise cloud systems that empower businesses to lead.
          </p>

          {/* Action Buttons */}
          <div className="hero__actions hero__actions--centered flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button
              href="#contact"
              className="atlas-button--primary shadow-[0_0_35px_rgba(0,119,255,0.35)] hover:shadow-[0_0_50px_rgba(0,119,255,0.55)]"
            >
              Start a project <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button
              href="#services"
              variant="secondary"
              className="backdrop-blur-xl border-white/15 hover:border-sky-400/50 hover:bg-blue-500/10"
            >
              Explore capabilities <ArrowDownRight aria-hidden="true" />
            </Button>
          </div>

          {/* Live Engineering Telemetry Strip */}
          <motion.div
            className="hero__dock grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl w-full mt-12 mx-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {telemetryPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.title}
                  className="telemetry-pill p-3.5 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl flex items-center gap-3.5 hover:border-sky-400/40 hover:bg-slate-900/80 transition-all duration-300 group shadow-lg text-left"
                >
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ${pill.accent}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white font-mono tracking-tight truncate">
                      {pill.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {pill.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>

      <a
        href="#services"
        className="hero__bottom-line hover:text-sky-300 transition-colors flex flex-col items-center gap-1 cursor-pointer group"
        aria-label="Scroll to discover"
      >
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-sky-300 transition-colors">
          Scroll to discover
        </span>
        <ChevronDown className="w-4 h-4 text-sky-400 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
