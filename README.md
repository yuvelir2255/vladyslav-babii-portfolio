# Vladyslav Babii — Portfolio

> A personal portfolio that reads like a case file. Dark concrete, cold steel, and prison-orange — the story of a builder who keeps escaping the cage of demos.

**Live:** https://portfolio-vladyslav-s-projects9.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=white)
![Tests](https://img.shields.io/badge/tests-84%20passing-3FB950?logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)

A scroll-driven, single-page experience by a developer of **Telegram Mini Apps, websites, and AI integrations**. Built section by section, each with bespoke motion designed and tuned by hand — not a template.

---

## Concept — "Case File"

The site is staged as an inmate's case file (subject **VB-19**). The metaphor is deliberate: an unstoppable builder who ships real products, not demos — *escaping the cage of demos*. The prison/dossier framing lives in the typography, copy, and motion, never in gimmicks. Every chapter is a beat in that story.

## Chapters

| # | Section | What it is |
|---|---------|------------|
| 00 | **The Yard** | Hero — a manifest that lights up word-by-word as you scroll, a booking mugshot, and an "intake" preloader that runs once per session. |
| 01 | **The Inmate** | About — a redacted dossier that declassifies on interaction: count-up age, a self-drawing fingerprint, scroll-linked reveals. |
| 02 | **Charges** | Services — the offerings framed as an indictment. A horizontal lane of "charge sheets" scrolls past, each slammed with a `GUILTY` stamp, then the whole case **collapses into a verdict** in one scroll-linked transition. |
| 03 | **Evidence** | Work — the flagship case, **Dream Gold**: a production Telegram Mini App (built solo, shipped end-to-end, web demo + Telegram), presented as a bagged exhibit with a manual screenshot carousel and a chain-of-custody tag. A full marketing site is the next, pending exhibit. |
| 04 | **Visiting Hours** | Contact — the finale: send a message and a `RELEASE AUTHORIZED` stamp slams down with a burst of daylight, closed by a hand-signed sign-off. The form posts to Telegram via a serverless route. |

## Engineering highlights

- **Scroll choreography, not decoration.** Every section has a signature reveal built on **GSAP** (ScrollTrigger, SplitText, ScrambleText, DrawSVG) over **Lenis** smooth scroll. The reveal model is *scroll-scrub* — animations are bound to scroll position, so they play forward and rewind with the wheel. The pinned sections (the hero manifest and the *Charges* card lane) run independently tuned scrub timelines; the lane scrolls horizontally as you scroll down, with no snapping.
- **A bespoke verdict transition.** In *Charges*, the final count→verdict moment is a continuous, scrubbed "collapse": the indictment scales, blurs and fades to centre while the verdict assembles with a per-line mask reveal and a glow bloom — fully reversible on scroll-up.
- **One atmosphere, site-wide.** A single WebGL concrete-shader background (**OGL**) and one custom cursor unify everything; both gracefully fall back to a static background on touch / no-WebGL. A per-section "mood" system shifts the lighting from cold steel toward warm daylight as the story moves toward release.
- **Serverless contact form.** A Next.js route handler validates input, blocks bots with a honeypot, applies in-memory rate limiting, and forwards to a Telegram bot — no secrets in the client. Client-side per-field validation with `aria-invalid` / `role="alert"`.
- **Quality bar.** Mobile-first responsive (375 / 768 / 1280), AA colour contrast, visible keyboard focus, semantic HTML, `next/image` + `next/font` with no layout shift, and a branded Open Graph / Twitter image generated via `next/og`.
- **Tested.** Content, lib, route handlers and presentational components are covered by **84 Vitest tests**; motion is verified in the browser.

## Tech stack

- **Framework** — Next.js 16 (App Router, RSC, route handlers) · React 19 · TypeScript (strict)
- **Styling** — Tailwind CSS v4 (CSS-first design tokens via `@theme`, no config file)
- **Motion** — GSAP 3.15 + `@gsap/react` · Lenis · OGL (WebGL)
- **Fonts** — Anton, JetBrains Mono, Oswald, Saira Stencil One, Permanent Marker (`next/font`)
- **Tooling** — Vitest + Testing Library · ESLint · Prettier · Husky + lint-staged
- **Hosting** — Vercel (CI deploy on push)

## Getting started

```bash
git clone https://github.com/yuvelir2255/vladyslav-babii-portfolio.git
cd vladyslav-babii-portfolio
npm install
npm run dev   # → http://localhost:3000
```

No environment variables are needed to run the site locally. The contact form posts to Telegram and reads `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` (kept in `.env.local`, never committed — see `.env.example`); without them the rest of the site runs unaffected.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the test suite (Vitest) |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Project structure

```
src/
  app/          App Router — layout, page, OG/Twitter images, contact API route
  components/   hero · about · services · work · contact · bg · motion · cursor · chrome
  content/      typed, section-scoped copy & data
  lib/          GSAP plugin registry · Telegram + contact-validation helpers
docs/superpowers/  design specs & implementation plans (how each section was built)
public/media/   images — mugshot, Dream Gold screenshots
```

Each section follows the same shape: a `components/<section>/` folder, typed copy in `content/<section>.ts`, and its own motion component — so chapters stay isolated and easy to reason about.

## Contact

- **Email** — vladbabii31@gmail.com
- **Telegram** — [@BabiiVladyslav](https://t.me/BabiiVladyslav)
- **LinkedIn** — [Vladyslav Babii](https://www.linkedin.com/in/vladyslav-babii-886052385/)
- **GitHub** — [yuvelir2255](https://github.com/yuvelir2255)
- **Instagram** — [babii.vladyslavv](https://www.instagram.com/babii.vladyslavv/)
- **Location** — Warsaw, PL

---

© 2026 Vladyslav Babii. Source is public for reference — please don't re-publish the design as your own.
