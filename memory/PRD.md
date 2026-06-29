# PRD — Chandan Gowda AH · Cyberpunk Portfolio

## Original problem statement
> https://chandan-ai-engineer.vercel.app/ — this is the current portfolio website I want to make it more professional and futuristic so that it should be one of the best portfolio websites with all animations.
> GitHub: https://github.com/ChandanRocky/portfolio.git

## User choices
- **Aesthetic:** Dark cyberpunk + 3D immersive (design agent free to pick)
- **Animation level:** Heavy
- **Content source:** Existing live portfolio + uploaded resume (`Chandan_Gowda_AH_Resume_Updated (2).docx`)
- **Tech stack:** No preference → React + Three.js + Framer Motion + Lenis
- **Sections:** "nothing much" to add → kept original sections, added Education + Awards + Meet-Me Hologram from resume

## Architecture
- **Frontend:** React 19 (CRA + craco), Tailwind, Framer Motion, Lenis smooth scroll, Three.js (HeroScene), JetBrains Mono + Orbitron
- **Backend:** FastAPI starter (no app logic needed — portfolio is static)
- **Database:** MongoDB (unused for this iteration)
- **Hosting:** Container via supervisor (frontend on :3000, backend on :8001)

## Components
- `App.js` — Routes: `/` → `SmoothScroll(CustomCursor, Nav, Hero, Character, About, Skills, Projects, Career, Contact)` + grain overlay
- `Hero.js` — Three.js particle field + wireframe icosahedron, glitch text "CHANDAN / GOWDA.AH", typewriter role, 3 CTAs (Projects, Contact, Resume download)
- `Character.js` — "Meet Me" hologram: real photo with lime/cyan tint + RGB glitch when speaking + scan-sweep + 22-bar animated equalizer + HUD labels + terminal speech bubble that cycles 6 first-person intro lines
- `About.js` — Bento stat counters (3+, 10+, 7, 10+, 4) + bio from resume summary + focus tags
- `Skills.js` — 7 terminal-style cards across 2 domains (AI/GenAI, Data Eng & Cloud)
- `Projects.js` — 13 cards + filter pills (All / AI Agents / Data Eng / Full Stack)
- `Career.js` — Certs marquee (7 imgs × 2 loop) + glowing timeline (Accion Labs + Koantek) + Education card + Awards card (4 awards)
- `Contact.js` — Headline "Ready to build something intelligent?" + 5 cards (LinkedIn, Email, Phone, GitHub, Resume)
- `Nav.js`, `CustomCursor.js`, `SmoothScroll.js`, `HeroScene.js`

## What's been implemented (2026-06-29)
- Full single-page portfolio rebuilt from scratch in dark cyberpunk + 3D immersive style
- Three.js particle hero with mouse-parallax + wireframe icosahedron/octahedron
- Custom neon cursor (auto-disabled on touch devices) + Lenis smooth scroll
- "Meet Me" hologram with real uploaded photo, scan-sweep, RGB glitch, equalizer, HUD labels, 6-line auto-cycling speech terminal
- All 13 projects ported from live site with category filter (All=13, AI Agents=8, Data Eng=3, Full Stack=2)
- Stats counters with intersection-observer driven count-up
- Certs marquee + glowing career timeline
- Education + Awards added from the uploaded resume
- Resume download button (Hero + Contact) → `/Chandan_Gowda_AH_Resume.docx` served from `frontend/public/`
- 60+ `data-testid` attributes across interactive + key info elements
- Tested by `testing_agent_v3` (iteration_2): all pass, zero console errors, mobile-responsive

## Backlog / Future ideas
- **P1** — Real screenshots / cover art per project card (currently text-only)
- **P1** — Working contact form (e.g., Resend) so visitors can write directly instead of mailto
- **P2** — Blog / Notes section for sharing GenAI write-ups + boosting SEO
- **P2** — Project case-study deep-dive pages (AccionTube architecture, Shorts Creator demo video)
- **P2** — Light-mode toggle
- **P3** — Recorded voice intro in Meet-Me section (TTS or real recording)
- **P3** — Visitor analytics / lead tracking (PostHog already injected in public/index.html)

## Test credentials
None — site is fully static / public. No auth flow exists.

## Notes
- Resume file lives at `/app/frontend/public/Chandan_Gowda_AH_Resume.docx`
- Avatar photo loaded from Emergent customer assets (uploaded by user)
- Original avatar `closed/open` PNGs from chandan-ai-engineer.vercel.app are NO LONGER used (replaced by hologram of real photo)
