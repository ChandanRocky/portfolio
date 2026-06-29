# PRD — Chandan Gowda AH · Cyberpunk Portfolio

## Original problem statement
> https://chandan-ai-engineer.vercel.app/ — this is the current portfolio website I want to make it more professional and futuristic so that it should be one of the best portfolio websites with all animations.
> GitHub: https://github.com/ChandanRocky/portfolio.git

## User choices
- **Aesthetic:** Dark cyberpunk + 3D immersive
- **Animation level:** Heavy
- **Content source:** Live portfolio + uploaded resume
- **Tech stack:** React + Three.js + Framer Motion + Lenis + FastAPI (Resend)
- **Voice for Meet-Me:** OpenAI TTS `onyx` (Emergent LLM key)
- **Background music:** Synthesized cyberpunk bed via ffmpeg (royalty-free, generated locally)
- **Contact backend:** Resend transactional email → chandangowdaa.h17@gmail.com (sandbox sender `onboarding@resend.dev`)

## Architecture
- **Frontend:** React 19 + Tailwind + Framer Motion + Lenis + Three.js (HeroScene) + Web Audio API (Meet-Me equalizer) — JetBrains Mono + Orbitron
- **Backend:** FastAPI on :8001 — endpoints `/api/`, `/api/status` (legacy), `/api/contact` (Resend)
- **Audio generator:** `/app/backend/scripts/generate_meet_me_audio.py` (one-shot — re-run to regenerate `/app/frontend/public/audio/meet-me.mp3` if the script changes)
- **Mongo:** Available but unused for this iteration

## Components
- `App.js`, `Nav.js`, `CustomCursor.js`, `SmoothScroll.js`, `HeroScene.js`
- `Hero.js` — Three.js scene + glitch text + typewriter + 3 CTAs (Projects, Contact, Resume download)
- `Character.js` — "Meet Me" hologram with real photo + pre-rendered 35-sec OpenAI TTS intro + cyberpunk synth bed + Web Audio AnalyserNode-driven equalizer + play/restart/seek controls + caption ticker
- `About.js` — Animated stat counters + resume-derived bio + focus tags
- `Skills.js` — Terminal-style cards for 7 categories across 2 domains
- `Projects.js` — 13 cards + filter pills
- `Career.js` — Certs marquee + glowing timeline + Education + Awards cards
- `ContactForm.js` — Real Resend-backed form (name / email / subject / message) with live status
- `Contact.js` — Headline + form (left) + 5 side cards (LinkedIn / Email / Phone / GitHub / Resume)

## Iteration 3 — What's been implemented (2026-06-29)
- ✅ Real ~35-sec OpenAI TTS audio intro ("onyx" voice) + synthesized cyberpunk ambient bed (sine + fifth + flanger + brown noise + echo + loudnorm), pre-mixed via ffmpeg to `/audio/meet-me.mp3` (836 KB, 192 kbps)
- ✅ Web Audio API AnalyserNode wired to a real-time 22-bar equalizer that reacts to actual playback waveform
- ✅ Play / Pause / Restart / Seek controls, live caption ticker mapped to 8 script lines
- ✅ Working `POST /api/contact` endpoint with Resend SDK + Pydantic validation + branded HTML email to owner + auto-reply confirmation (best-effort)
- ✅ React contact form with inline status (idle / sending / ✓ delivered / ✗ error) + auto-clear status on next edit
- ✅ Latest resume `.docx` served at `/Chandan_Gowda_AH_Resume.docx` (linked from Hero CTA + Contact card)
- ✅ Form inputs allow native text cursor (overrode the global `cursor:none`)
- ✅ Verified by `testing_agent_v3` (iteration_3): 7/7 backend pytest, 100% frontend, 0 console errors

## What's left for the user to do
- (Optional) **Verify your own domain in Resend** to switch the FROM address from `onboarding@resend.dev` → e.g. `hello@yourdomain.com`. Until then, sender shows as Resend's onboarding inbox (deliverable, just less branded). Auto-reply to the visitor may bounce in sandbox; the owner email always arrives.

## Backlog / Future ideas
- **P1** — Real screenshots/cover art per project card
- **P2** — Replace synthesized bed with a richer composed track once user provides one (drop into `/app/frontend/public/audio/` and rerun the generator with `--bg <file>`)
- **P2** — Blog / Notes section + project case-study deep-dives
- **P3** — Captions overlay synced to audio timecodes (currently uses uniform 8-line split)
- **P3** — Visitor analytics on contact submissions

## Notes
- Resend API key + LLM key are in `/app/backend/.env` (gitignored)
- To regenerate the audio:  `python /app/backend/scripts/generate_meet_me_audio.py`
- To re-test contact endpoint:  `curl -X POST $REACT_APP_BACKEND_URL/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"chandangowdaa.h17@gmail.com","subject":"Test","message":"Hello"}'`

## Test credentials
None — site is fully static / public. No auth flow exists.
