import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export function FinalCTA() {
  return (
    <section id="contact" className="atlas-section contact-section">
      <Container>
        <Reveal className="contact-card">
          <div className="contact-card__grid" aria-hidden="true" />
          <div className="contact-card__glow" aria-hidden="true" />
          <div className="contact-card__orb" aria-hidden="true"><span>A</span></div>

          <div className="contact-card__copy">
            <span className="atlas-label">06 / Start a project</span>
            <h2>Bring the ambition.<br /><span>We’ll engineer the system.</span></h2>
            <p>
              Tell us what is slowing the business down, what opportunity you want
              to unlock, or what you are ready to build next.
            </p>
            <div className="contact-card__actions">
              <Button href={`mailto:${siteConfig.contactEmail}`}>
                Email Atlas <Mail aria-hidden="true" />
              </Button>
              <Button href={siteConfig.whatsapp} variant="secondary" external>
                WhatsApp <MessageCircle aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="contact-card__details">
            <div>
              <small>Email</small>
              <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
            </div>
            <div>
              <small>Based in</small>
              <strong>{siteConfig.location}</strong>
            </div>
            <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
              Follow Atlas on Instagram <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
