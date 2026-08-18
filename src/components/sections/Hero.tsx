"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

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

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero relative">
      <Container className="hero__inner">
        <motion.div
          className="hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__eyebrow">
            <span>Project enquiries open</span>
            <span><MapPin aria-hidden="true" /> {siteConfig.location}</span>
          </div>

          <h1>
            Your Vision,
            <span> Engineered.</span>
          </h1>

          <p className="hero__lead">
            Atlas Software designs and builds scalable digital products, intelligent automation,
            data platforms, and cloud systems that empower businesses to lead.
          </p>

          <div className="hero__actions">
            <Button href="#contact">
              Start a project <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button href="#services" variant="secondary">
              Explore capabilities <ArrowDownRight aria-hidden="true" />
            </Button>
          </div>

          <div className="hero__proof" aria-label="Atlas Software approach">
            <span><Check aria-hidden="true" /> Engineered to scale</span>
            <span><Check aria-hidden="true" /> Global architecture</span>
            <span><Check aria-hidden="true" /> Future-driven</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={reduceMotion ? false : { opacity: 0, x: 34, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-visual__frame">
            <div className="hero-visual__header">
              <span>ATLAS / CYBER GLOBE</span>
              <span>LIVE SYSTEM</span>
            </div>

            <HeroScene />

            <div className="hero-visual__brand" aria-hidden="true">
              <span>▲</span>
              <small>ATLAS ENGINE</small>
            </div>

            <div className="hero-visual__metric hero-visual__metric--one">
              <small>Global Nodes</small>
              <strong>Connected</strong>
            </div>
            <div className="hero-visual__metric hero-visual__metric--two">
              <small>System Status</small>
              <strong>100% Operational</strong>
            </div>

            <div className="hero-visual__footer">
              <span>01 / Product</span>
              <span>02 / Automation</span>
              <span>03 / Data</span>
              <span>04 / Cloud</span>
            </div>
          </div>
        </motion.div>
      </Container>

      <a
        href="#services"
        className="hero__bottom-line hover:text-cyan-300 transition-colors flex flex-col items-center gap-1 cursor-pointer group"
        aria-label="Scroll to discover"
      >
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-cyan-300 transition-colors">
          Scroll to discover
        </span>
        <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
