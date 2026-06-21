# Vladyslav Babii — Portfolio

> A personal portfolio that reads like a case file. Dark concrete, cold steel, and prison‑orange — the story of a builder who keeps escaping the cage of demos.

**Live:** https://portfolio-vladyslav-s-projects9.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)

Developer of **Telegram Mini Apps, websites, and AI products**. This site is an
interactive, scroll‑driven experience — built section by section, each with bespoke motion.

---

## Concept — "Case File"

The whole site is staged as an inmate's case file (subject **VB‑19**). The metaphor is
simple: an unstoppable builder who ships real products, not demos — "escaping the cage of
demos." Every chapter is a beat in that story, and the prison/dossier framing is carried
through typography, copy, and motion rather than gimmicks.

## Chapters

| # | Section | What it is |
|---|---------|------------|
| 00 | **The Yard** | Hero — animated manifest (word‑by‑word highlight on scroll), mugshot, an "intake" preloader. |
| 01 | **The Inmate** | About — a redacted dossier that declassifies on interaction (count‑up age, self‑drawing fingerprint, stamp). |
| 02 | **Charges** | Services — an indictment; each offering is a "count" slammed with a `GUILTY` stamp, ending on a verdict. |
| 03 | **Evidence** | Work — the flagship case, **Dream Gold** (a live Telegram Mini App), presented as a bagged exhibit with a live‑screenshot carousel. |
| 04 | **Visiting Hours** | Contact — the finale: the cell door opens to daylight when you reach out. _(in progress)_ |

## Craft

- **Motion** — scroll‑driven choreography with **GSAP** (ScrollTrigger, SplitText,
  ScrambleText, DrawSVG) over **Lenis** smooth scroll. Each section has its own signature
  reveal; motion is part of the build, not decoration.
- **Atmosphere** — a single WebGL concrete‑shader background (**OGL**) and one custom cursor
  unify the whole site.
- **Quality** — mobile‑first responsive (375 / 768 / 1280), AA contrast, visible keyboard
  focus, semantic HTML, `next/image` + `next/font` with no layout shift.
- **Tested** — content and presentational components covered with Vitest; motion verified in
  the browser.

## Tech stack

- **Framework** — Next.js 16 (App Router) · React 19 · TypeScript (strict)
- **Styling** — Tailwind CSS v4 (CSS‑first design tokens via `@theme`, no config file)
- **Motion** — GSAP 3.15 + `@gsap/react` · Lenis · OGL (WebGL)
- **Fonts** — Anton, JetBrains Mono, Oswald, Saira Stencil One, Permanent Marker (`next/font`)
- **Tooling** — Vitest + Testing Library · ESLint · Prettier · Husky + lint‑staged
- **Hosting** — Vercel

## Getting started

```bash
git clone https://github.com/yuvelir2255/vladyslav-babii-portfolio.git
cd vladyslav-babii-portfolio
npm install
npm run dev   # → http://localhost:3000
```

No environment variables are needed to run the site. (The contact form, shipping with
*Visiting Hours*, will post to a Telegram bot via `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.)

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the test suite (Vitest) |
| `npm run typecheck` | Type‑check with `tsc --noEmit` |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Project structure

```
src/
  app/          App Router — layout, page, OG/Twitter images, API routes
  components/   hero · about · services · work · contact · bg · motion · cursor · chrome
  content/      typed section copy & data
  lib/          GSAP registry + helpers
docs/superpowers/  design specs & implementation plans (how each section was built)
public/media/   images — mugshot, Dream Gold screenshots
```

## Contact

- **Email** — vladbabii31@gmail.com
- **Telegram** — [@BabiiVladyslav](https://t.me/BabiiVladyslav)
- **LinkedIn** — [vladyslav-babii](https://www.linkedin.com/in/vladyslav-babii-886052385/)
- **Location** — Warsaw, PL

---

© 2026 Vladyslav Babii. Personal portfolio — code is public for reference; please don't
re‑publish the design as your own.
