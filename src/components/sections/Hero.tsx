"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Check, MapPin } from "lucide-react";

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
    <section id="home" className="hero">
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
            We engineer software that
            <span> moves business forward.</span>
          </h1>

          <p className="hero__lead">
            Atlas designs and builds digital products, intelligent automation,
            data platforms, and cloud systems for businesses ready to operate at
            a higher level.
          </p>

          <div className="hero__actions">
            <Button href="#contact">
              Start a project <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button href="#systems" variant="secondary">
              Explore our work <ArrowDownRight aria-hidden="true" />
            </Button>
          </div>

          <div className="hero__proof" aria-label="Atlas Software approach">
            <span><Check aria-hidden="true" /> Strategy-led</span>
            <span><Check aria-hidden="true" /> Production-ready</span>
            <span><Check aria-hidden="true" /> Built to evolve</span>
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
              <span>ATLAS / DIGITAL SYSTEM</span>
              <span>LIVE</span>
            </div>

            <HeroScene />

            <div className="hero-visual__brand" aria-hidden="true">
              <span>A</span>
              <small>ATLAS CORE</small>
            </div>

            <div className="hero-visual__metric hero-visual__metric--one">
              <small>Architecture</small>
              <strong>Connected</strong>
            </div>
            <div className="hero-visual__metric hero-visual__metric--two">
              <small>System state</small>
              <strong>Operational</strong>
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

      <div className="hero__bottom-line" aria-hidden="true">
        <span>Scroll to discover</span>
      </div>
    </section>
  );
}
