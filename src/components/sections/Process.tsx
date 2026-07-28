"use client";

import { ArrowDownRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Interactive3DTilt } from "@/components/ui/Interactive3DTilt";
import { processSteps } from "@/data/site";

export function Process() {
  return (
    <section id="process" className="atlas-section process-section relative z-1">
      <Container>
        <div className="process-section__head">
          <Reveal>
            <SectionHeading
              label="04 / Process"
              title="A disciplined path from ambiguity to momentum."
              description="Clear decisions, visible progress, and a delivery rhythm that keeps business and engineering aligned."
            />
          </Reveal>
          <Reveal className="process-section__note" delay={0.08}>
            <span>How Atlas works</span>
            <p>Focused enough to move quickly. Structured enough to build with confidence.</p>
          </Reveal>
        </div>

        <div className="process-list">
          {processSteps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.055}>
              <Interactive3DTilt maxTilt={8} scale={1.02} className="h-full">
                <article className="process-item h-full">
                  <div className="process-item__top">
                    <span>{step.number}</span>
                    <ArrowDownRight aria-hidden="true" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </Interactive3DTilt>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
