import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { footerLinks, navigationItems, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <div className="site-footer__statement">
            <span className="site-footer__eyebrow">Atlas Software</span>
            <h2>Systems with purpose.<br />Software with staying power.</h2>
          </div>

          <a className="site-footer__email" href={`mailto:${siteConfig.contactEmail}`}>
            <span>New project enquiries</span>
            <strong>{siteConfig.contactEmail}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="site-footer__main">
          <Link href="#home" className="footer-brand" aria-label="Atlas Software home">
            <span className="footer-brand__mark">
              <Image src="/images/atlas-logo.png" alt="" width={64} height={64} />
            </span>
            <span>
              <strong>ATLAS</strong>
              <small>SOFTWARE</small>
            </span>
          </Link>

          <div className="site-footer__column">
            <h3>Explore</h3>
            {navigationItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

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

          <div className="site-footer__meta">
            <span>Based in</span>
            <strong>{siteConfig.location}</strong>
            <p>Independent software engineering for ambitious businesses.</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Atlas Software. All rights reserved.</span>
          <span>{siteConfig.tagline}</span>
        </div>
      </Container>
    </footer>
  );
}
