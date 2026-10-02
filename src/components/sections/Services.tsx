"use client";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { services } from "@/data/site";

const accentStyles = {
  cyan: {
    border: "border-sky-500/25 hover:border-sky-400/60",
    bar: "from-sky-400 to-blue-600",
    iconBg: "bg-blue-500/15 border-sky-400/35 text-sky-300 shadow-blue-500/15",
    number: "text-sky-400",
    tag: "bg-sky-500/10 border-sky-400/25 text-sky-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(0,119,255,0.18)]",
    topLine: "via-sky-400/50",
  },
  blue: {
    border: "border-blue-500/20 hover:border-blue-400/60",
    bar: "from-blue-400 to-indigo-600",
    iconBg: "bg-blue-500/15 border-blue-400/35 text-blue-300 shadow-blue-500/15",
    number: "text-blue-400",
    tag: "bg-blue-500/10 border-blue-400/25 text-blue-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(0,119,255,0.12)]",
    topLine: "via-blue-400/50",
  },
  mint: {
    border: "border-emerald-500/20 hover:border-emerald-400/60",
    bar: "from-emerald-400 to-teal-600",
    iconBg: "bg-emerald-500/15 border-emerald-400/35 text-emerald-300 shadow-emerald-500/15",
    number: "text-emerald-400",
    tag: "bg-emerald-500/10 border-emerald-400/25 text-emerald-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(0,245,184,0.12)]",
    topLine: "via-emerald-400/50",
  },
  violet: {
    border: "border-purple-500/20 hover:border-purple-400/60",
    bar: "from-purple-400 to-fuchsia-600",
    iconBg: "bg-purple-500/15 border-purple-400/35 text-purple-300 shadow-purple-500/15",
    number: "text-purple-400",
    tag: "bg-purple-500/10 border-purple-400/25 text-purple-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(167,139,250,0.12)]",
    topLine: "via-purple-400/50",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-400/60",
    bar: "from-amber-400 to-orange-600",
    iconBg: "bg-amber-500/15 border-amber-400/35 text-amber-300 shadow-amber-500/15",
    number: "text-amber-400",
    tag: "bg-amber-500/10 border-amber-400/25 text-amber-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(251,191,36,0.14)]",
    topLine: "via-amber-400/50",
  },
  silver: {
    border: "border-slate-400/25 hover:border-slate-300/60",
    bar: "from-slate-300 to-slate-500",
    iconBg: "bg-white/10 border-white/20 text-slate-200 shadow-white/10",
    number: "text-slate-300",
    tag: "bg-white/5 border-white/15 text-slate-200 font-medium",
    glow: "hover:shadow-[0_0_35px_rgba(255,255,255,0.12)]",
    topLine: "via-slate-300/50",
  },
};

export function Services() {
  return (
    <section id="services" className="atlas-section services-section relative z-1">
      <Container>
        <Reveal>
          <SectionHeading
            label="02 / Capabilities"
            title="Built around the outcome—not a list of technologies."
            description="From a single high-value workflow to a connected business platform, Atlas brings product thinking, interface design, engineering, data, and cloud architecture into one delivery system."
          />
        </Reveal>

        <div className="flex flex-col gap-5 mt-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const style = accentStyles[service.accent as keyof typeof accentStyles] || accentStyles.cyan;

            return (
              <Reveal key={service.title} delay={index * 0.05} className="w-full">
                <Interactive3DTilt maxTilt={3} scale={1.006} className="w-full">
                  <article
                    className={`relative w-full rounded-2xl bg-gradient-to-br from-slate-900/80 via-[#0a0f18]/85 to-[#06090f]/95 border ${style.border} p-6 sm:p-8 backdrop-blur-2xl shadow-xl ${style.glow} transition-all duration-300 group overflow-hidden`}
                  >
                    {/* Top ambient glow line */}
                    <div
                      className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent ${style.topLine} to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    {/* Glowing Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${style.bar}`} />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-5 flex-1">
                        <div
                          className={`p-4 rounded-2xl border ${style.iconBg} shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${style.tag}`}
                            >
                              {service.number}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-sky-100 transition-colors">
                              {service.title}
                            </h3>
                          </div>

                          <p className="text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                            {service.description}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[11px] font-mono tracking-wide px-3 py-1 rounded-lg border ${style.tag} flex items-center gap-1.5 hover:bg-white/5 transition-colors`}
                              >
                                <span className="w-1 h-1 rounded-full bg-current opacity-70" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <a
                        href="#contact"
                        className="self-end md:self-center p-3.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 hover:border-sky-400/60 hover:bg-blue-500/15 hover:text-sky-200 transition-all duration-300 group-hover:scale-110 shadow-lg shrink-0"
                        aria-label={`Discuss ${service.title}`}
                      >
                        <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                </Interactive3DTilt>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
