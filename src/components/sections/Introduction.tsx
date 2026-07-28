"use client";

import { ArrowUpRight, Binary, Boxes, Orbit } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";

const pillars = [
  {
    icon: Orbit,
    label: "Think in systems",
    description: "Map the workflow, data, people, and edge cases before a screen is drawn.",
    accent: {
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      bar: "from-cyan-400 to-blue-500",
      iconBg: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300",
      num: "text-cyan-400",
    },
  },
  {
    icon: Boxes,
    label: "Design for people",
    description: "Shape tools around the decisions and actions real teams need every day.",
    accent: {
      border: "border-blue-500/30 hover:border-blue-400/60",
      bar: "from-blue-400 to-indigo-500",
      iconBg: "bg-blue-500/15 border-blue-400/40 text-blue-300",
      num: "text-blue-400",
    },
  },
  {
    icon: Binary,
    label: "Engineer for reality",
    description: "Build durable software that survives messy operations and changing priorities.",
    accent: {
      border: "border-purple-500/30 hover:border-purple-400/60",
      bar: "from-purple-400 to-emerald-500",
      iconBg: "bg-purple-500/15 border-purple-400/40 text-purple-300",
      num: "text-purple-400",
    },
  },
];

export function Introduction() {
  return (
    <section className="atlas-section introduction-section relative z-1">
      <Container>
        <div className="introduction-layout">
          <Reveal className="introduction-heading">
            <span className="atlas-label">01 / A better digital foundation</span>
            <h2>
              Complicated operations deserve
              <span> clear, capable software.</span>
            </h2>
          </Reveal>

          <Reveal className="introduction-copy" delay={0.08}>
            <p>
              Atlas turns fragmented processes, disconnected tools, and ambitious ideas
              into focused digital systems. Every product is shaped around the business
              outcome first—then designed and engineered to perform in the real world.
            </p>
            <a href="#services">
              Explore our capabilities <ArrowUpRight aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {pillars.map(({ icon: Icon, label, description, accent }, index) => (
            <Reveal key={label} delay={index * 0.06} className="h-full">
              <Interactive3DTilt maxTilt={6} scale={1.02} className="h-full">
                <article className={`relative h-full rounded-2xl bg-slate-900/90 border ${accent.border} p-7 backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group`}>
                  {/* Top Glowing Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent.bar}`} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${accent.num}`}>
                        0{index + 1}
                      </span>
                      <div className={`p-3 rounded-xl border ${accent.iconBg} shadow-md`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {label}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </article>
              </Interactive3DTilt>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
