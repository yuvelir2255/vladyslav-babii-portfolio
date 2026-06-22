# Spec — Contact author signature ("The Signature")

> 2026-06-22 · feature branch `feat/contact-author-signature`

## Goal

Close the site narrative with an **author signature** at the very bottom of the
`#contact` section: the full name **Vladyslav Babii** appearing **super smoothly**
as you scroll into it. Concept fit — after the cold "Case File" (stamps, dossier,
cell door), the file is closed with a living, handwritten signature. This is the
"signed by the author" sign-off many portfolios place at the very bottom.

Owner decisions: variant **02 · The Signature** (handwritten), with **noticeable
breathing room** (the name gets its own "moment", ~half screen of air). Emphasis:
the name reveal must feel **buttery / super smooth**, not a hard wipe.

## Placement & spacing

- New block at the end of `#contact`, inside the existing `max-w-[1100px]`
  container, after the `signature` line ("Ready when it matters."). Left-aligned
  (consistent with the section's editorial grid).
- Noticeable air: large top margin (~`30vh`, `20vh` mobile) + bottom padding
  (~`12vh`) so the signature reads as a finale. Tuned in-browser at 390 / 768 /
  1280.

> Note: a full-bleed (edge-to-edge giant name) variant was prototyped per owner
> reference (Olha Lazarieva / Bogdan Kolomiyets footers) and then reverted — owner
> preferred the original handwritten signature. Kept here only as history.

## Content (in `src/content/contact.ts`)

```ts
author: {
  name: 'Vladyslav Babii',
  caption: 'Signed · release authorized · 21 · 06 · 2026',
}
```

(Date matches the booking placard `21 · 06 · 2026`.)

## Markup — new component `components/contact/AuthorSignature.tsx`

Presentational, with `data-` hooks for the motion (no animation logic inside):

1. `[data-sign-name]` — the name in Permanent Marker (`--font-marker`), slight
   `-2deg` tilt, large display size (`clamp(30px,8.5vw,84px)`). Real text
   (screen-reader reads the name). Base CSS state = fully visible (no-JS safe).
2. `[data-sign-underline]` — inline `<svg aria-hidden>` with one slightly-wavy
   orange stroke `<path>` for DrawSVG.
3. `[data-sign-cap]` — the caption (mono, `--color-dim`, uppercase, tracked).

Rendered by `Contact.tsx` after the existing `signature` `<p>`, inside the
`max-w-[1100px]` container.

## Motion — extend `components/contact/ReleaseMotion.tsx`

Hidden states set by GSAP (no-JS = visible), consistent with the site's reveal
model. Reversible on scroll-up.

**Decision (changed from scrub during in-browser tuning):** the signature sits at
the very bottom of the page, so while the name is on screen there are only ~390px
of scroll left — a scroll-scrub reveal came out short and quick, not "buttery".
The whole point here is super-smooth, so the name reveal is a **self-playing
one-shot timeline** triggered on enter (`toggleActions: 'play none none reverse'`),
decoupling smoothness from how much scroll remains. This is the kind of accent
CLAUDE.md allows to be one-shot instead of scrubbed (stamps, scramble) — the rest
of the section stays scrub.

- **Name (the "super smooth" hero reveal):** one timeline tween, `expo.out`, ~1.6s:
  soft **feathered mask wipe** left→right (CSS variable `--reveal` in a
  `mask`/`-webkit-mask` linear-gradient with a soft ~18% band → blurred edge, not
  hard) **+** `filter: blur(14px)→0` (desktop only, `matchMedia(min-width:768px)`)
  **+** `opacity 0→1` **+** small `y` rise.
- **Underline:** real **DrawSVG** `drawSVG: 0 → 100%`, `power2.out`, starting after
  the name (~0.7s offset).
- **Caption:** `autoAlpha + y`, `power2.out`, last (~1.05s offset).

Trigger `start: 'top 78%'` on the `[data-sign]` block. No dependency on the
`vb:released` event — purely scroll-into-view driven.

## Accessibility

- Name + caption are real text. Contrast on `--color-bg`: bone 15.5:1, dim 4.62:1
  (both AA). Underline SVG is decorative (`aria-hidden`).
- `prefers-reduced-motion` intentionally not honored (owner decision, sitewide).

## Tests (TDD, Vitest)

Motion is not unit-tested (verified in browser). Unit tests assert content/markup:

- `AuthorSignature` renders the name text and the caption text.
- Name is present as readable text in the DOM (query by text/data-attr, robust to
  reveal motion per project NB).
- (If kept) `Contact` renders the signature block after the directory.

Done = clean `npm run build` + `npm test` green + verified in browser at
375 / 768 / 1280 (the name reveal looks genuinely smooth).

## Out of scope

- True per-stroke pen handwriting via DrawSVG on a traced centerline path of the
  name (Permanent Marker is a filled font, not single-stroke). Possible future
  upgrade if a hand-traced SVG path of the name is provided.
