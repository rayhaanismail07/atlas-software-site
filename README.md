# Atlas Software — Premium Website

A polished, responsive software-studio website built with Next.js, TypeScript, Motion, Lucide, and native Three.js.

## Design direction

The redesign moves away from a generic neon/cyberpunk agency template and toward a more refined premium technology identity:

- editorial typography and stronger visual hierarchy
- restrained cyan accents on deep graphite surfaces
- a custom interactive Three.js Atlas core in the hero
- sophisticated bento capability cards
- product-system mockups built entirely in CSS/SVG
- accessible motion with reduced-motion support
- responsive layouts from mobile through wide desktop
- direct email, WhatsApp, and Instagram contact paths

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS 4 base layer
- Motion for reveal transitions
- Native Three.js for the hero scene
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run typecheck
npm run build
npm start
```

## Main files

- `src/app/page.tsx` — homepage composition
- `src/app/globals.css` — complete responsive design system
- `src/components/sections/Hero.tsx` — hero content and UI
- `src/components/sections/HeroScene.tsx` — native Three.js scene
- `src/components/sections/Services.tsx` — capability bento grid
- `src/components/sections/SystemArchitecture.tsx` — system showcases and mockups
- `src/data/site.ts` — copy, links, services, process, and contact details

## Before launch

1. Confirm the live domain through `NEXT_PUBLIC_SITE_URL`.
2. Replace the privacy-page starter wording with a policy reviewed for the services used by the live website.
3. Optimise or replace the current PNG logo with a transparent, production-ready SVG/PNG mark.
4. Add verified portfolio case studies once client approval is available.
5. Connect analytics and a form endpoint only after the privacy policy is updated.
