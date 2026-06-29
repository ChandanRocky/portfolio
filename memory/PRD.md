# PRD — Chandan Gowda AH · Cyberpunk Portfolio v4.0

## Original Problem Statement
> "https://chandan-ai-engineer.vercel.app/ — make this portfolio more professional and futuristic, one of the best portfolio websites with all animations."
> Source content: existing live site + GitHub (https://github.com/ChandanRocky/portfolio.git)

## User Choices
- Visual: Dark cyberpunk + 3D immersive (design agent's pick)
- Animations: Heavy
- Content: Pulled from live `chandan-ai-engineer.vercel.app`
- Tech stack: open — chose React + Three.js + Framer Motion + Lenis
- Sections: same as live (no add/remove)

## Architecture
- Frontend: React 19 + CRA/CRACO, Tailwind 3, framer-motion 11, three 0.185, lenis 1.3
- Backend: untouched starter FastAPI (`/api/`, `/api/status`)
- Design tokens & components per `/app/design_guidelines.json`
  - Colors: void #050505, neon-lime #CCFF00, neon-cyan #00F0FF, danger #FF003C
  - Fonts: Orbitron (display) + JetBrains Mono (body)

## Sections Implemented (Jan 2026)
1. **Custom neon cursor** — dot + trailing ring, mix-blend-difference, hover-state for interactive elements
2. **Lenis smooth-scroll** wrapping the entire app
3. **Sticky nav** with backdrop blur on scroll, 5 anchor links + "Available" CTA + mobile hamburger menu
4. **Hero** — full-viewport Three.js scene (wireframe icosahedron + octahedron + 1400 neon particles + mouse parallax), glitch-text name, typewriter role, scanlines, grid background, CTA buttons
5. **About** — bento-grid stats with animated counters (3+ / 10+ / 7 / 10+ / 4), focus tags
6. **Skills** — 2 domain groups, 7 terminal-style category cards (traffic-light dots + ~/path header)
7. **Projects** — 13 cards with category filters (All / AI Agents / Data Eng / Full Stack), staggered AnimatePresence layout transitions, completion badge, tech tags, components count
8. **Career** — 7-cert continuously scrolling marquee + glowing vertical timeline with 2 jobs (Accion Labs, Koantek)
9. **Contact** — massive headline with giant background "LET'S BUILD" text, 3 contact cards (LinkedIn / Email / Phone), focus tag pills, footer line

## Design Touches
- Sitewide grain/noise SVG overlay
- CSS scanlines on hero
- Glitch text effect (chromatic aberration) on name
- Magnetic + ghost button styles with cubic-bezier slide-fill
- Corner accent ticks on every "bento" cell
- Animated pulse "Available" dot in nav

## Test Status (iteration_1.json)
- Frontend: **100% pass** (9/9 review items verified on desktop + mobile)
- No console errors. Only non-blocking THREE.Clock deprecation notices from inside three.js.

## Files of Note
- `/app/frontend/src/App.js`
- `/app/frontend/src/components/{CustomCursor,SmoothScroll,Nav,Hero,HeroScene,About,Skills,Projects,Career,Contact}.js`
- `/app/frontend/src/data/portfolio.js`
- `/app/frontend/src/index.css` (global tokens, animations, components)
- `/app/frontend/tailwind.config.js` (neon + void color tokens)
- `/app/frontend/public/index.html` (Orbitron + JetBrains Mono fonts, page title)

## Backlog / P1+
- P1: Add resume PDF download button in hero/contact (user mentioned they can share a resume — currently not used)
- P1: Real project URLs and case-study modals on card click (currently cards link nowhere — "↗" is cosmetic)
- P2: prefers-reduced-motion support to disable cursor / 3D scene / parallax
- P2: Add OpenGraph + SEO meta + sitemap.xml
- P2: Replace marquee with lightbox-able cert gallery
- P3: Lighthouse audit and image optimization for cert PNGs
