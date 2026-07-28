"use client";

import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { siteConfig } from "@/data/site";

export function FinalCTA() {
  return (
    <section id="contact" className="atlas-section contact-section relative z-1">
      <Container>
        <Reveal>
          <Interactive3DTilt maxTilt={3} scale={1.005} className="w-full">
            <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950/90 border border-cyan-500/25 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl">
              {/* Left Glowing Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    06 / Start a project
                  </span>

                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                    Bring the ambition.
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                      We’ll engineer the system.
                    </span>
                  </h2>

                  <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Tell us what is slowing the business down, what opportunity you want
                    to unlock, or what you are ready to build next.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button href={`mailto:${siteConfig.contactEmail}`}>
                      Email Atlas <Mail className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button href={siteConfig.whatsapp} variant="secondary" external>
                      WhatsApp <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center space-y-6 lg:border-l lg:border-slate-800 lg:pl-10">
                  <div className="space-y-1">
                    <small className="text-xs font-mono uppercase text-slate-400">Email</small>
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="block text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      {siteConfig.contactEmail}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <small className="text-xs font-mono uppercase text-slate-400">Based in</small>
                    <strong className="block text-sm font-semibold text-slate-200">
                      {siteConfig.location}
                    </strong>
                  </div>

                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-300 hover:text-purple-200 transition-colors pt-2"
                  >
                    Follow Atlas on Instagram <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
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
