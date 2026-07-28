import { ArrowUpRight, Binary, Boxes, Orbit } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    icon: Orbit,
    label: "Think in systems",
    description: "Map the workflow, data, people, and edge cases before a screen is drawn.",
  },
  {
    icon: Boxes,
    label: "Design for people",
    description: "Shape tools around the decisions and actions real teams need every day.",
  },
  {
    icon: Binary,
    label: "Engineer for reality",
    description: "Build durable software that survives messy operations and changing priorities.",
  },
];

export function Introduction() {
  return (
    <section className="atlas-section introduction-section">
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

        <Reveal className="introduction-rail" delay={0.12}>
          <span className="introduction-rail__line" aria-hidden="true" />
          {pillars.map(({ icon: Icon, label, description }, index) => (
            <article key={label}>
              <small>0{index + 1}</small>
              <Icon aria-hidden="true" />
              <div>
                <strong>{label}</strong>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
