"use client";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { services } from "@/data/site";

const accentStyles = {
  cyan: {
    border: "border-cyan-500/30 hover:border-cyan-400/70",
    bar: "from-cyan-400 to-cyan-600",
    iconBg: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-cyan-500/10",
    number: "text-cyan-400",
    tag: "bg-cyan-500/10 border-cyan-400/30 text-cyan-200 font-medium",
    button: "hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300",
    glow: "shadow-cyan-500/5",
  },
  blue: {
    border: "border-blue-500/30 hover:border-blue-400/70",
    bar: "from-blue-400 to-indigo-600",
    iconBg: "bg-blue-500/15 border-blue-400/40 text-blue-300 shadow-blue-500/10",
    number: "text-blue-400",
    tag: "bg-blue-500/10 border-blue-400/30 text-blue-200 font-medium",
    button: "hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-300",
    glow: "shadow-blue-500/5",
  },
  mint: {
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    bar: "from-emerald-400 to-teal-600",
    iconBg: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-emerald-500/10",
    number: "text-emerald-400",
    tag: "bg-emerald-500/10 border-emerald-400/30 text-emerald-200 font-medium",
    button: "hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300",
    glow: "shadow-emerald-500/5",
  },
  violet: {
    border: "border-purple-500/30 hover:border-purple-400/70",
    bar: "from-purple-400 to-fuchsia-600",
    iconBg: "bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-purple-500/10",
    number: "text-purple-400",
    tag: "bg-purple-500/10 border-purple-400/30 text-purple-200 font-medium",
    button: "hover:border-purple-400 hover:bg-purple-500/20 hover:text-purple-300",
    glow: "shadow-purple-500/5",
  },
  silver: {
    border: "border-amber-500/30 hover:border-amber-400/70",
    bar: "from-amber-400 to-orange-600",
    iconBg: "bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-amber-500/10",
    number: "text-amber-400",
    tag: "bg-amber-500/10 border-amber-400/30 text-amber-200 font-medium",
    button: "hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-300",
    glow: "shadow-amber-500/5",
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

        <div className="flex flex-col gap-6 mt-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const style = accentStyles[service.accent as keyof typeof accentStyles] || accentStyles.cyan;

            return (
              <Reveal key={service.title} delay={index * 0.05} className="w-full">
                <Interactive3DTilt maxTilt={3} scale={1.008} className="w-full">
                  <article
                    className={`relative w-full rounded-2xl bg-slate-900/90 border ${style.border} p-6 sm:p-8 backdrop-blur-2xl shadow-xl ${style.glow} transition-all duration-300 group overflow-hidden`}
                  >
                    {/* Glowing Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${style.bar}`} />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-5 flex-1">
                        <div className={`p-3.5 rounded-xl border ${style.iconBg} shrink-0 shadow-lg`}>
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono font-bold ${style.number}`}>
                              {service.number}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                              {service.title}
                            </h3>
                          </div>

                          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                            {service.description}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[11px] font-mono tracking-wide px-3 py-1 rounded-md border ${style.tag}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <a
                        href="#contact"
                        className={`self-end md:self-center p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 ${style.button} transition-all duration-200 group-hover:translate-x-1 shadow-md`}
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
