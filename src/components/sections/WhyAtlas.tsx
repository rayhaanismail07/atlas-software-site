import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TechnologyStack } from "@/components/sections/TechnologyStack";
import { principles, siteConfig } from "@/data/site";

export function WhyAtlas() {
  return (
    <section id="studio" className="atlas-section studio-section">
      <Container>
        <div className="studio-intro">
          <Reveal className="studio-intro__copy">
            <span className="atlas-label">05 / The studio</span>
            <h2>Small by design.<br /><span>Serious about the work.</span></h2>
          </Reveal>

          <Reveal className="studio-intro__aside" delay={0.08}>
            <p>
              Atlas is an independent software studio based in South Africa,
              combining strategic thinking, product design, and engineering to
              deliver focused systems without layers of agency overhead.
            </p>
            <a href={`mailto:${siteConfig.contactEmail}`}>
              Work with Atlas <ArrowUpRight aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div className="principles-grid">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <Reveal key={principle.title} delay={index * 0.055}>
                <article className="principle-card">
                  <span><Icon aria-hidden="true" /></span>
                  <small>0{index + 1}</small>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <TechnologyStack />
        </Reveal>
      </Container>
    </section>
  );
}
