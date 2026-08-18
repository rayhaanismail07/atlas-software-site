"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { navigationItems } from "@/data/site";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${hasScrolled ? "site-header--scrolled" : ""}`}>
        <Container>
          <nav className="navbar" aria-label="Main navigation">
            <Link href="#home" className="brand" aria-label="Atlas Software home">
              <span className="brand__mark">
                <Image
                  src="/images/atlas-logo.png"
                  alt="Atlas Software Logo"
                  width={54}
                  height={54}
                  priority
                />
              </span>
              <span className="brand__copy">
                <strong className="brand__title">ATLAS</strong>
                <small className="brand__subtitle">SOFTWARE</small>
              </span>
            </Link>

            <div className="navbar__links">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="#contact" className="navbar__cta">
              Start a project
              <ArrowUpRight aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="navbar__menu-button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </nav>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="mobile-nav"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="mobile-nav__backdrop"
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className="mobile-nav__panel"
              initial={reduceMotion ? false : { opacity: 0, y: -18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.985 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-nav__head">
                <span>Navigation</span>
                <small>Atlas Software</small>
              </div>

              <div className="mobile-nav__links">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.label}</strong>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <Link
                href="#contact"
                className="mobile-nav__cta"
                onClick={() => setMenuOpen(false)}
              >
                Start a project
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
