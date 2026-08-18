"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Mail, MapPin, Instagram, CheckCircle2, MessageCircle, Globe } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { siteConfig } from "@/data/site";

const Cta3DCanvas = dynamic(
  () => import("@/components/sections/Cta3DCanvas").then((m) => m.Cta3DCanvas),
  { ssr: false },
);

export function FinalCTA() {
  return (
    <section id="contact" className="atlas-section contact-section">
      <Container>
        <Reveal>
          <Interactive3DTilt maxTilt={2} scale={1.005} className="w-full">
            <div className="contact-card relative overflow-hidden rounded-[32px] border border-cyan-500/25 bg-slate-950/85 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(97,231,251,0.06)] group">
              {/* Rounded Top Border Glow Highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-[32px] border-t-2 border-cyan-400/70 [mask-image:linear-gradient(to_bottom,black_0%,black_20%,transparent_70%)]" />
              
              {/* Ambient Radial Background Glows */}
              <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px]" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Heading & Primary Actions */}
                <div className="contact-card__copy lg:col-span-7 flex flex-col justify-center gap-6 w-full">
                  <div>
                    <span className="atlas-label mb-4">06 / Start a project</span>

                    <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-medium tracking-tight leading-[1.12] text-white">
                      Bring the ambition.
                      <span className="block mt-1 bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                        We’ll engineer the system.
                      </span>
                    </h2>

                    <p className="mt-4 text-slate-300 text-base leading-relaxed max-w-xl">
                      Tell us what is slowing the business down, what opportunity you want
                      to unlock, or what you are ready to build next.
                    </p>

                    <div className="contact-card__actions flex flex-wrap gap-4 mt-6">
                      <Button href={`mailto:${siteConfig.contactEmail}`} className="px-6 py-3.5 text-sm font-semibold">
                        Email Atlas <Mail className="w-4 h-4 ml-2" aria-hidden="true" />
                      </Button>
                      <Button href={siteConfig.whatsapp} variant="secondary" external className="px-6 py-3.5 text-sm font-semibold">
                        WhatsApp <ArrowUpRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-slate-800/80 text-slate-400 text-xs font-mono">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Direct Engineer Access
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      Fixed-Scope Commitment
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      Rapid Onboarding
                    </span>
                  </div>
                </div>

                {/* Right Column: 3D Core & Full-Width Contact Detail Cards */}
                <div className="contact-card__details lg:col-span-5 w-full flex flex-col gap-3 lg:border-l lg:border-slate-800/80 lg:pl-10">
                  {/* Interactive 3D WebGL Core */}
                  <Cta3DCanvas />

                  {/* Full-width Glassmorphic Contact Cards */}
                  <div className="w-full flex flex-col gap-2.5">
                    {/* Direct Email Card */}
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900 shadow-xl backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all flex-shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Direct Email</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">{siteConfig.contactEmail}</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-2" />
                    </a>

                    {/* WhatsApp Quick Connect Card */}
                    <a
                      href={siteConfig.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all flex-shrink-0">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">WhatsApp</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">Start Instant Project Chat</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-2" />
                    </a>

                    {/* Location Card */}
                    <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-xl">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 flex-shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">HQ Location</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">{siteConfig.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono flex-shrink-0 ml-2">
                        <Globe className="w-3 h-3 text-teal-400" />
                        <span>UTC+2</span>
                      </div>
                    </div>

                    {/* Instagram Card */}
                    <a
                      href={siteConfig.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-pink-500/50 hover:bg-slate-900 shadow-xl backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all flex-shrink-0">
                          <Instagram className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Social</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-pink-300 transition-colors">Follow on Instagram</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Interactive3DTilt>
        </Reveal>
      </Container>
    </section>
  );
}
