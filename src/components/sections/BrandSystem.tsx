"use client";

import { motion } from "motion/react";
import {
  Globe,
  Cloud,
  Code2,
  ShieldCheck,
  BarChart3,
  Cpu,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const brandPersonality = [
  { label: "Innovative", desc: "Pushing limits with modern WebGL, AI features, and resilient architecture." },
  { label: "Global", desc: "Engineered for international connectivity, cloud scale, and distributed teams." },
  { label: "Trustworthy", desc: "Strict type safety, robust security, and dependable execution every step." },
  { label: "Future-Driven", desc: "Built with forward-compatible tech stacks designed to evolve over decades." },
];

const brandIcons = [
  { icon: Globe, label: "Global", sub: "Global Infrastructure" },
  { icon: Cloud, label: "Cloud", sub: "Cloud Architecture" },
  { icon: Code2, label: "Development", sub: "Product Engineering" },
  { icon: ShieldCheck, label: "Security", sub: "Enterprise Protection" },
  { icon: BarChart3, label: "Analytics", sub: "Data Intelligence" },
];

export function BrandSystem() {
  return (
    <section id="brand" className="atlas-section relative bg-[#070809] border-t border-[rgba(0,225,255,0.08)] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,225,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <Container>
        <SectionHeading
          label="BRAND IDENTITY SYSTEM"
          title="Engineered to empower. Designed for scale."
          description="The official Atlas Software brand system represents precision, global connectivity, and future-driven digital engineering."
        />

        {/* Grid 1: Brand Essence & Personality */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Essence Showcase Card */}
          <motion.div
            className="lg:col-span-5 p-8 rounded-2xl bg-[#0F1115] border border-[rgba(0,225,255,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[radial-gradient(circle,rgba(0,119,255,0.25)_0%,transparent_70%)] pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00E1FF]">Brand Essence</span>
                <span className="text-[10px] font-mono text-[#C0C0C8] px-2 py-1 rounded bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]">
                  ATLAS CORE
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-snug">
                Engineered. Scalable. Global.
              </h3>
              <p className="mt-4 text-[#C0C0C8] text-sm leading-relaxed">
                Software solutions that empower businesses, streamline operational complexities, and drive the digital future.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E1FF]" />
                <span className="font-mono text-xs text-white uppercase tracking-wider">YOUR VISION, ENGINEERED.</span>
              </div>
              <Cpu className="w-5 h-5 text-[#0077FF]" />
            </div>
          </motion.div>

          {/* Brand Personality Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandPersonality.map((item, idx) => (
              <motion.div
                key={item.label}
                className="p-6 rounded-2xl bg-[#0F1115] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,225,255,0.3)] transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#00E1FF] group-hover:scale-150 transition-transform" />
                  <h4 className="font-display text-lg font-bold text-white tracking-wide">{item.label}</h4>
                </div>
                <p className="text-xs text-[#C0C0C8] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>



        {/* Section 3: Iconography & Typography Standards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Typography Spec Sheet */}
          <motion.div
            className="lg:col-span-6 p-6 rounded-2xl bg-[#0F1115] border border-[rgba(255,255,255,0.08)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#00E1FF]">Typography System</span>
            <div className="mt-6 space-y-6">
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
                <div className="flex justify-between text-xs font-mono text-[#7C8795] mb-1">
                  <span>HEADINGS</span>
                  <span className="text-[#00E1FF]">EXO 2</span>
                </div>
                <p className="font-display text-2xl font-bold text-white tracking-wide">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#7C8795] mb-1">
                  <span>BODY TEXT & UI</span>
                  <span className="text-[#00E1FF]">INTER</span>
                </div>
                <p className="font-sans text-sm text-[#C0C0C8] leading-relaxed">
                  Clean, neutral typography optimized for effortless readability across desktop, tablet, and mobile platforms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Iconography Spec */}
          <motion.div
            className="lg:col-span-6 p-6 rounded-2xl bg-[#0F1115] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#00E1FF]">Iconography Style</span>
              <p className="mt-2 text-xs text-[#C0C0C8]">
                Modern vector line icons with vibrant cyan & electric blue accents. Global, connected, and futuristic.
              </p>

              <div className="mt-6 grid grid-cols-5 gap-3 text-center">
                {brandIcons.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-[#070809] border border-[rgba(0,225,255,0.15)] flex flex-col items-center gap-2 group hover:border-[#00E1FF] transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-[#00E1FF] group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[10px] text-white font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#7C8795]">
              <span>STYLE: LINE & CYAN GLOW</span>
              <span>ATLAS DESIGN SYSTEM v1.0</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
