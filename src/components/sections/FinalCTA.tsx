"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Mail, MapPin, Instagram } from "lucide-react";

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
          <Interactive3DTilt maxTilt={3} scale={1.005} className="w-full">
            <div className="contact-card">
              <div className="contact-card__copy">
                <span className="atlas-label">06 / Start a project</span>
                <h2>
                  Bring the ambition.
                  <span>We’ll engineer the system.</span>
                </h2>
                <p>
                  Tell us what is slowing the business down, what opportunity you want
                  to unlock, or what you are ready to build next.
                </p>
                <div className="contact-card__actions">
                  <Button href={`mailto:${siteConfig.contactEmail}`}>
                    Email Atlas <Mail aria-hidden="true" />
                  </Button>
                  <Button href={siteConfig.whatsapp} variant="secondary" external>
                    WhatsApp <ArrowUpRight aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="contact-card__details flex flex-col justify-between">
                {/* Interactive 3D WebGL Core */}
                <Cta3DCanvas />

                {/* Contact details info cards */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Direct Email</span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">{siteConfig.contactEmail}</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">HQ Location</span>
                      <span className="text-xs font-semibold text-slate-200">{siteConfig.location}</span>
                    </div>
                  </div>

                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-pink-500/40 hover:bg-slate-900/90 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                        <Instagram className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Social</span>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-pink-300 transition-colors">Follow on Instagram</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>
              </div>
            </div>
          </Interactive3DTilt>
        </Reveal>
      </Container>
    </section>
  );
}
