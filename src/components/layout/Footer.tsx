import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { footerLinks, navigationItems, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        {/* Top Statement Band */}
        <div className="site-footer__top">
          <div className="site-footer__statement">
            <span className="site-footer__eyebrow">Atlas Software</span>
            <h2>
              Systems with purpose.
              <span>Software with staying power.</span>
            </h2>
          </div>

          <a className="site-footer__email" href={`mailto:${siteConfig.contactEmail}`}>
            <span>New project enquiries</span>
            <strong>{siteConfig.contactEmail}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        {/* Main Footer Grid */}
        <div className="site-footer__main">
          {/* Brand */}
          <div className="site-footer__brand-col">
            <Link href="#home" className="footer-brand" aria-label="Atlas Software home">
              <span className="footer-brand__mark">
                <Image src="/images/atlas-logo.png" alt="" width={64} height={64} />
              </span>
              <span>
                <strong>ATLAS</strong>
                <small>SOFTWARE</small>
              </span>
            </Link>
            <p className="site-footer__tagline">
              Independent software engineering for ambitious businesses.
            </p>
            <div className="site-footer__social">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="site-footer__social-link"
              >
                <ArrowUpRight aria-hidden="true" />
                <span>Instagram</span>
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="site-footer__social-link"
              >
                <MessageCircle aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                aria-label="Email"
                className="site-footer__social-link"
              >
                <Mail aria-hidden="true" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="site-footer__column">
            <h3>Explore</h3>
            {navigationItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Connect */}
          <div className="site-footer__column">
            <h3>Connect</h3>
            {footerLinks.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ),
            )}
          </div>

          {/* Location */}
          <div className="site-footer__column">
            <h3>Based In</h3>
            <div className="site-footer__location">
              <MapPin className="site-footer__location-icon" aria-hidden="true" />
              <strong>{siteConfig.location}</strong>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Atlas Software. All rights reserved.</span>
          <span>{siteConfig.tagline}</span>
        </div>
      </Container>
    </footer>
  );
}
