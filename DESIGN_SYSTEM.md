# Atlas Software Design System

## Positioning

Atlas Software is presented as a focused, premium engineering studio—not a generic web agency. The experience should feel intelligent, calm, technically capable, and trustworthy.

## Visual principles

1. **Restraint over spectacle** — Three.js and glow effects support the story without dominating it.
2. **Editorial hierarchy** — oversized statements, generous spacing, and concise supporting copy.
3. **System language** — interfaces, grids, nodes, and data visuals communicate real software capability.
4. **Clarity at every breakpoint** — mobile layouts retain hierarchy rather than simply stacking desktop blocks.
5. **Motion with purpose** — reveals, orbital movement, and hover states explain relationships and depth.

## Core colours

- Background: `#050608`
- Soft background: `#090B0E`
- Surface: `#0D1014`
- Primary text: `#F3F6F8`
- Secondary text: `#BAC4CD`
- Muted text: `#7C8994`
- Cyan accent: `#61E7FB`
- Cyan secondary: `#18BFD8`
- Supporting blue: `#6CA8FF`
- Supporting mint: `#7BF1CD`

## Type direction

- Display: geometric sans-serif with compact letter spacing
- Body: neutral, highly readable sans-serif
- Technical labels: monospace, uppercase, restrained tracking

## Spacing

The layout uses large section spacing and a 1380px maximum container. Premium feel comes from controlled negative space rather than extra decoration.

## Components

- Floating glass navigation pill
- Rounded pill CTAs
- Editorial section headers
- Bento capability cards
- System mockup panels
- Structured process rail
- Technical capability board
- Immersive closing CTA

## Three.js performance rules

- Native Three.js only; no heavy scene framework required
- Pixel ratio clamped to 1.65
- Animation pauses when the tab or hero is not visible
- Reduced-motion preference is respected
- Geometry and materials are disposed on unmount
- Responsive camera and object scaling
