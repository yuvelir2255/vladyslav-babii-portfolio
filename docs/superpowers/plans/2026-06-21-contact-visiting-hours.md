# Contact «Visiting Hours / Release» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать финальную секцию `#contact` «Visiting Hours / Release» — мягкая форма-заявка (3 поля → Telegram), directory каналов, и сигнатурный моушн «Cell Door + свет» (на входе прутья садятся; на успешную отправку — прутья разъезжаются, сквозь проём бьёт дневной свет).

**Architecture:** Серверный каркас `Contact.tsx` собирает хедер + форму + directory + подпись и оборачивает в клиентский `ReleaseMotion` (on-enter таймлайн + слушатель события `vb:released` для стадии 2). Форма `VisitForm` (client) шлёт `POST /api/contact` и на успехе диспатчит `window` событие `vb:released`; декоративный слой `Bars` (прутья + дневной свет) анимируется `ReleaseMotion` через data-хуки. Бэкенд (`lib/telegram.ts` + `api/contact/route.ts`) портируется из архивной ветки почти дословно. Контент — в `src/content/contact.ts`.

**Tech Stack:** Next.js 16 (App Router, route handlers, RSC) · React 19 · TS strict · Tailwind v4 · GSAP (ScrollTrigger/SplitText, уже в `src/lib/gsap.ts`) · Vitest + @testing-library/react. Без новых зависимостей.

**Спека:** `docs/superpowers/specs/2026-06-21-contact-visiting-hours-design.md`.

---

## Заметки для исполнителя (важно)

- **Windows / cwd:** перед каждой командой `Set-Location 'C:\Users\ювелир\Desktop\portfolio'` (cwd сбрасывается).
- **Prettier на коммите:** husky + lint-staged переформатируют staged-файлы. После любого `git commit` **перечитывать файл перед следующим Edit**.
- **Токены (`globals.css`):** `--color-bg #100f0d`, `--color-bone #ece7da`, `--color-steel #9c968a`, `--color-dim #827c70`, `--color-orange #ff5a1e`, `--color-orange-soft`, `--color-line rgba(236,231,218,.12)`. Шрифты: `--font-display` (Anton), `--font-mono` (JetBrains), `--font-label` (Oswald), `--font-stencil` (Saira Stencil).
- **Классы Tailwind v4** как в проекте: `text-[var(--color-orange)]`, `font-[family-name:var(--font-display)]`, `tracking-[0.2em]`, `uppercase`, `max-md:`/`max-lg:`.
- **FileNav трогать НЕ нужно** — `Visiting Hours → #contact` (код 04) уже есть. Якорь оживёт сам, как только в DOM появится `<section id="contact">`.
- **P1-CTA править НЕ нужно** — hero-CTA уже указывают на `#work`/`#contact` (`src/content/hero.ts`). `#work` уже живой; `#contact` оживёт с этой секцией. P1 = только проверка в браузере (Task 10).
- **directory — типографская** (mono label + ссылка), без brand-иконок: это вернее «case file»-эстетике и не тащит icon-ассеты. Если позже захотим Simple Icons — добавим.
- **Reduced-motion** в проекте НЕ уважаем (решение владельца) — отдельных media-веток не добавляем.
- **Коммиты:** Conventional Commits по-русски; каждый коммит заканчивать `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Тесты:** одиночный файл — `npx vitest run <path>`; всё — `npm test`; типы — `npm run typecheck`; билд — `npm run build`. Dev/браузер — preview-инструмент.

---

## Task 0: Ветка от свежего main

**Files:** —

- [ ] **Step 1: Чистота и свежесть main**

Run: `git checkout main && git status`
Expected: на `main`, рабочее дерево чистое (Evidence уже смержена; спека контакта закоммичена).

- [ ] **Step 2: Создать ветку**

Run: `git checkout -b feat/contact-visiting-hours`
Expected: `Switched to a new branch 'feat/contact-visiting-hours'`

- [ ] **Step 3: Baseline**

Run: `npm run typecheck`
Expected: без ошибок.

---

## Task 1: Бэкенд-хелперы Telegram — `src/lib/telegram.ts` (порт)

**Files:**
- Create: `src/lib/telegram.ts`
- Test: `src/lib/telegram.test.ts`
- Create/Modify: `.env.example`

- [ ] **Step 1: Написать падающий тест (чистые функции)**

Create `src/lib/telegram.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  validateContact,
  isSpam,
  buildTelegramMessage,
} from './telegram';

describe('validateContact', () => {
  it('требует name/email/project', () => {
    const { ok, errors } = validateContact({});
    expect(ok).toBe(false);
    expect(errors).toEqual({
      name: 'required',
      email: 'required',
      project: 'required',
    });
  });
  it('ловит битый email', () => {
    const { ok, errors } = validateContact({
      name: 'A',
      email: 'bad',
      project: 'x',
    });
    expect(ok).toBe(false);
    expect(errors.email).toBe('invalid');
  });
  it('пропускает валидный вход', () => {
    const { ok } = validateContact({
      name: 'A',
      email: 'a@b.co',
      project: 'x',
    });
    expect(ok).toBe(true);
  });
});

describe('isSpam (honeypot)', () => {
  it('true когда honeypot заполнен', () => {
    expect(isSpam({ company: 'bot' })).toBe(true);
  });
  it('false когда honeypot пуст', () => {
    expect(isSpam({ name: 'A' })).toBe(false);
  });
});

describe('buildTelegramMessage', () => {
  it('включает имя, email и текст проекта', () => {
    const msg = buildTelegramMessage({
      name: 'Ann',
      email: 'a@b.co',
      project: 'Build X',
    });
    expect(msg).toContain('Ann');
    expect(msg).toContain('a@b.co');
    expect(msg).toContain('Build X');
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/lib/telegram.test.ts`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация (порт из archive)**

Create `src/lib/telegram.ts`:

```ts
/**
 * Contact-form helpers + Telegram Bot API send. Secrets are read from env on the
 * server only (never shipped to the client).
 */

export interface ContactInput {
  name: string;
  email: string;
  project: string;
  /** Honeypot — real users leave this empty. */
  company?: string;
}

export type ContactErrors = Partial<
  Record<'name' | 'email' | 'project', string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: Partial<ContactInput>): {
  ok: boolean;
  errors: ContactErrors;
} {
  const errors: ContactErrors = {};
  if (!input.name?.trim()) errors.name = 'required';
  if (!input.email?.trim()) errors.email = 'required';
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = 'invalid';
  if (!input.project?.trim()) errors.project = 'required';
  return { ok: Object.keys(errors).length === 0, errors };
}

/** True when the honeypot field is filled (i.e. a bot). */
export function isSpam(input: Partial<ContactInput>): boolean {
  return Boolean(input.company && input.company.trim().length > 0);
}

export function buildTelegramMessage(input: ContactInput): string {
  return [
    '🟢 New message from your portfolio',
    '',
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    '',
    input.project.trim(),
  ].join('\n');
}

/** Sends a message to the configured chat. Throws if env is missing. */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('telegram_not_configured');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
  return res.ok;
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/lib/telegram.test.ts`
Expected: PASS (7 тестов).

- [ ] **Step 5: Добавить env-переменные в `.env.example`**

Прочитать `.env.example` (если есть). Добавить в конец (если ещё нет этих ключей), иначе создать файл:

```
# Telegram bot for the contact form (server-only; never exposed to the client)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

> Реальные значения — только в `.env.local` (gitignored). В git попадает лишь пустой `.env.example`.

- [ ] **Step 6: Коммит**

```bash
git add src/lib/telegram.ts src/lib/telegram.test.ts .env.example
git commit -m "feat(contact): хелперы telegram + валидация/honeypot (порт из archive)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Route handler — `src/app/api/contact/route.ts` (порт)

**Files:**
- Create: `src/app/api/contact/route.ts`
- Test: `src/app/api/contact/route.test.ts`

- [ ] **Step 1: Написать падающий тест (node-окружение, send замокан)**

Create `src/app/api/contact/route.test.ts`:

```ts
/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/telegram', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/telegram')>();
  return { ...actual, sendTelegramMessage: vi.fn(async () => true) };
});

import { POST } from './route';
import { sendTelegramMessage } from '@/lib/telegram';

function req(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('honeypot заполнен → 200 без отправки', async () => {
    const r = await POST(
      req({ name: 'A', email: 'a@b.co', project: 'x', company: 'bot' }),
    );
    expect(r.status).toBe(200);
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it('невалидный email → 422, без отправки', async () => {
    const r = await POST(req({ name: 'A', email: 'bad', project: 'x' }));
    expect(r.status).toBe(422);
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it('валидный вход → отправка → 200', async () => {
    const r = await POST(req({ name: 'A', email: 'a@b.co', project: 'x' }));
    expect(r.status).toBe(200);
    expect(sendTelegramMessage).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/app/api/contact/route.test.ts`
Expected: FAIL — модуль `./route` не найден.

- [ ] **Step 3: Реализация (порт из archive)**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from 'next/server';
import {
  validateContact,
  isSpam,
  buildTelegramMessage,
  sendTelegramMessage,
} from '@/lib/telegram';

// Best-effort in-memory rate limit per IP (resets on cold start). For robust
// limiting across serverless instances, move to Upstash Redis later.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything.
  if (isSpam(body)) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const { ok, errors } = validateContact(body);
  if (!ok) {
    return NextResponse.json({ error: 'validation', errors }, { status: 422 });
  }

  try {
    const sent = await sendTelegramMessage(
      buildTelegramMessage({
        name: body.name,
        email: body.email,
        project: body.project,
      }),
    );
    if (!sent) {
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/app/api/contact/route.test.ts`
Expected: PASS (3 теста).
> Если `next/server` падает в vitest — добавить fallback не требуется: чистые функции (Task 1) уже покрывают валидацию/honeypot; в этом случае пометить route как проверяемый в браузере (Task 10) и упростить тест до проверки `isSpam`/`validateContact`. Но сначала попробовать как есть — обычно работает.

- [ ] **Step 5: Коммит**

```bash
git add src/app/api/contact/route.ts src/app/api/contact/route.test.ts
git commit -m "feat(contact): POST /api/contact — honeypot + валидация + отправка (порт)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Контент — `src/content/contact.ts`

**Files:**
- Create: `src/content/contact.ts`
- Test: `src/content/contact.test.ts`

- [ ] **Step 1: Написать падающий тест**

Create `src/content/contact.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { contact } from './contact';

describe('contact content', () => {
  it('эйдброу/заголовок/подпись на месте', () => {
    expect(contact.eyebrow).toMatch(/visiting hours/i);
    expect(contact.heading.length).toBeGreaterThan(0);
    expect(contact.signature).toMatch(/ready when it matters/i);
  });
  it('форма: 3 поля + success/error копи', () => {
    expect(contact.form.name.label).toBe('Name');
    expect(contact.form.email.label).toBe('Email');
    expect(contact.form.project.label).toMatch(/project/i);
    expect(contact.form.success.length).toBeGreaterThan(0);
    expect(contact.form.error).toMatch(/vladbabii31@gmail\.com/);
  });
  it('directory: каналы с https/mailto href + локация', () => {
    expect(contact.channels.length).toBeGreaterThanOrEqual(5);
    for (const ch of contact.channels) {
      expect(ch.href).toMatch(/^(https:\/\/|mailto:)/);
      expect(ch.label.length).toBeGreaterThan(0);
    }
    expect(contact.location).toMatch(/Warsaw/);
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/content/contact.test.ts`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/content/contact.ts`:

```ts
export const contact = {
  eyebrow: 'Visiting Hours',
  heading: 'Visiting hours are open.',
  sub: 'Got an idea, a product, or a process that should run itself? Tell me about it — I reply fast and start faster.',
  form: {
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@email.com' },
    project: { label: 'Your project', placeholder: 'What should I build?' },
    submit: 'Send message',
    sending: 'Sending…',
    success: "Released — your message is on its way. I'll reply soon.",
    error:
      'Something went wrong. Email me directly: vladbabii31@gmail.com',
  },
  channels: [
    {
      label: 'Email',
      value: 'vladbabii31@gmail.com',
      href: 'mailto:vladbabii31@gmail.com',
      external: false,
    },
    {
      label: 'Telegram',
      value: '@BabiiVladyslav',
      href: 'https://t.me/BabiiVladyslav',
      external: true,
    },
    {
      label: 'GitHub',
      value: 'yuvelir2255',
      href: 'https://github.com/yuvelir2255',
      external: true,
    },
    {
      label: 'LinkedIn',
      value: 'Vladyslav Babii',
      href: 'https://www.linkedin.com/in/vladyslav-babii-886052385/',
      external: true,
    },
    {
      label: 'Instagram',
      value: 'babii.vladyslavv',
      href: 'https://www.instagram.com/babii.vladyslavv/',
      external: true,
    },
  ],
  location: 'Warsaw, PL',
  signature: 'Ready when it matters.',
} as const;
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/content/contact.test.ts`
Expected: PASS (3 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/content/contact.ts src/content/contact.test.ts
git commit -m "feat(contact): контент contact.ts (копи формы + directory каналов)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Directory каналов — `ContactChannels.tsx`

**Files:**
- Create: `src/components/contact/ContactChannels.tsx`
- Test: `src/components/contact/ContactChannels.test.tsx`

- [ ] **Step 1: Написать падающий тест**

Create `src/components/contact/ContactChannels.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactChannels } from './ContactChannels';

describe('ContactChannels', () => {
  it('рендерит внешние каналы как ссылки с target/rel', () => {
    render(<ContactChannels />);
    const tg = screen.getByRole('link', { name: /telegram/i });
    expect(tg).toHaveAttribute('href', 'https://t.me/BabiiVladyslav');
    expect(tg).toHaveAttribute('target', '_blank');
    expect(tg).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
  it('email — mailto без target', () => {
    render(<ContactChannels />);
    const mail = screen.getByRole('link', { name: /email/i });
    expect(mail).toHaveAttribute('href', 'mailto:vladbabii31@gmail.com');
    expect(mail).not.toHaveAttribute('target');
  });
  it('показывает локацию', () => {
    render(<ContactChannels />);
    expect(screen.getByText(/Warsaw, PL/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/contact/ContactChannels.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация (типографская directory)**

Create `src/components/contact/ContactChannels.tsx`:

```tsx
import { contact } from '@/content/contact';

export function ContactChannels() {
  return (
    <div data-channels className="flex flex-col gap-3">
      <p className="mb-1 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        Directory
      </p>
      <ul className="flex flex-col gap-2">
        {contact.channels.map((ch) => (
          <li key={ch.label} className="flex items-baseline gap-3">
            <span className="w-[78px] flex-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase">
              {ch.label}
            </span>
            <a
              href={ch.href}
              {...(ch.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="inline-flex min-h-[44px] items-center gap-1 text-[14px] tracking-[0.01em] text-[var(--color-bone)] underline-offset-4 transition-colors hover:text-[var(--color-orange)] hover:underline focus-visible:text-[var(--color-orange)] focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
            >
              {ch.value}
              {ch.external && <span aria-hidden="true">↗</span>}
            </a>
          </li>
        ))}
        <li className="flex items-baseline gap-3">
          <span className="w-[78px] flex-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase">
            Held at
          </span>
          <span className="text-[14px] text-[var(--color-steel)]">
            {contact.location}
          </span>
        </li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/contact/ContactChannels.test.tsx`
Expected: PASS (3 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/contact/ContactChannels.tsx src/components/contact/ContactChannels.test.tsx
git commit -m "feat(contact): типографская directory каналов (ContactChannels)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Форма — `VisitForm.tsx`

**Files:**
- Create: `src/components/contact/VisitForm.tsx`
- Test: `src/components/contact/VisitForm.test.tsx`

- [ ] **Step 1: Написать падающий тест (рендер + honeypot + success-диспатч)**

Create `src/components/contact/VisitForm.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { VisitForm } from './VisitForm';

afterEach(() => vi.restoreAllMocks());

describe('VisitForm', () => {
  it('рендерит 3 поля с label + скрытый honeypot', () => {
    const { container } = render(<VisitForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Your project')).toBeInTheDocument();
    const hp = container.querySelector('input[name="company"]');
    expect(hp).toBeTruthy();
    expect(hp).toHaveAttribute('aria-hidden', 'true');
  });

  it('успешная отправка → success-копи + диспатч vb:released', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const onReleased = vi.fn();
    window.addEventListener('vb:released', onReleased);

    render(<VisitForm />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.co' },
    });
    fireEvent.change(screen.getByLabelText('Your project'), {
      target: { value: 'Build X' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/your message is on its way/i)).toBeInTheDocument(),
    );
    expect(onReleased).toHaveBeenCalled();
    window.removeEventListener('vb:released', onReleased);
  });

  it('ошибка сети → error-копи', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('nope', { status: 500 }),
    );
    render(<VisitForm />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.co' },
    });
    fireEvent.change(screen.getByLabelText('Your project'), {
      target: { value: 'x' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/contact/VisitForm.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/contact/VisitForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { contact } from '@/content/contact';

type Status = 'idle' | 'sending' | 'success' | 'error';

const field =
  'mt-1 w-full rounded border border-[var(--color-line)] bg-[rgba(16,15,13,0.6)] px-3 py-2.5 text-[14px] text-[var(--color-bone)] placeholder:text-[var(--color-dim)] focus-visible:border-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]';
const labelCls =
  'block text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase';

export function VisitForm() {
  const c = contact.form;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const fd = new FormData(e.currentTarget);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          project: fd.get('project'),
          company: fd.get('company'),
        }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      window.dispatchEvent(new CustomEvent('vb:released'));
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        data-form-success
        aria-live="polite"
        className="rounded border border-[var(--color-orange)] bg-[var(--color-orange-soft)] px-5 py-6"
      >
        <p className="font-[family-name:var(--font-stencil)] text-[20px] tracking-[0.06em] text-[var(--color-orange)] uppercase">
          Released
        </p>
        <p className="mt-2 text-[14px] leading-[1.6] text-[var(--color-bone)]">
          {c.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />
      <div>
        <label htmlFor="vf-name" className={labelCls}>
          {c.name.label}
        </label>
        <input
          id="vf-name"
          name="name"
          type="text"
          required
          placeholder={c.name.placeholder}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="vf-email" className={labelCls}>
          {c.email.label}
        </label>
        <input
          id="vf-email"
          name="email"
          type="email"
          required
          placeholder={c.email.placeholder}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="vf-project" className={labelCls}>
          {c.project.label}
        </label>
        <textarea
          id="vf-project"
          name="project"
          required
          rows={4}
          placeholder={c.project.placeholder}
          className={`${field} resize-none`}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="min-h-[44px] rounded bg-[var(--color-orange)] px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-[#160d06] uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-bone)] disabled:opacity-60"
      >
        {status === 'sending' ? c.sending : c.submit}
      </button>
      {status === 'error' && (
        <p
          data-form-error
          aria-live="polite"
          className="text-[13px] text-[var(--color-orange)]"
        >
          {c.error}
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/contact/VisitForm.test.tsx`
Expected: PASS (3 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/contact/VisitForm.tsx src/components/contact/VisitForm.test.tsx
git commit -m "feat(contact): форма-заявка VisitForm (3 поля, honeypot, состояния, vb:released)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Декоративные прутья + свет — `Bars.tsx`

**Files:**
- Create: `src/components/contact/Bars.tsx`

> Чисто презентационный декоративный слой (`aria-hidden`), без юнит-теста — анимируется в `ReleaseMotion`, проверяется в браузере (Task 10). Геометрия/интенсивность света — открытые вопросы спеки §11, финал в браузере.

- [ ] **Step 1: Реализация**

Create `src/components/contact/Bars.tsx`:

```tsx
const barGrad =
  'repeating-linear-gradient(90deg, transparent 0 30px, rgba(0,0,0,0.55) 30px 36px, rgba(120,116,108,0.25) 36px 38px)';

export function Bars() {
  return (
    <div
      data-bars
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* дневной свет за прутьями — контролируемый центральный шафт (flat warm), скрыт до релиза */}
      <div
        data-daylight
        className="absolute inset-y-0 left-1/2 w-[46%] -translate-x-1/2 opacity-0"
        style={{ background: '#d8a24a' }}
      />
      {/* левая половина решётки */}
      <div
        data-bars-left
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ backgroundImage: barGrad }}
      />
      {/* правая половина решётки */}
      <div
        data-bars-right
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ backgroundImage: barGrad }}
      />
      {/* плашка-замок */}
      <div
        data-lockplate
        className="absolute top-5 left-1/2 -translate-x-1/2 rounded-[3px] border border-[var(--color-line)] bg-[rgba(16,15,13,0.9)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-orange)] uppercase"
      >
        ● Visiting Hours
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add src/components/contact/Bars.tsx
git commit -m "feat(contact): декоративные прутья + дневной свет (Bars)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Моушн — `ReleaseMotion.tsx`

**Files:**
- Create: `src/components/contact/ReleaseMotion.tsx`

> Моушн в юнит-тестах не гоняем. Контент видим по дефолту (фолбэк): прутья/свет — декоративный слой, форма работает без анимации.

- [ ] **Step 1: Реализация**

Create `src/components/contact/ReleaseMotion.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function ReleaseMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      // СТАДИЯ 2 — освобождение (по событию vb:released из VisitForm)
      const release = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
        tl.to('[data-bars-left]', { xPercent: -110, duration: 0.9 }, 0);
        tl.to('[data-bars-right]', { xPercent: 110, duration: 0.9 }, 0);
        tl.to('[data-lockplate]', { autoAlpha: 0, duration: 0.3 }, 0);
        tl.to('[data-daylight]', { opacity: 0.55, duration: 1.1 }, 0.1);
      };
      window.addEventListener('vb:released', release);

      // СТАДИЯ 1 — on-enter (прутья садятся, контент проявляется)
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.from(
            ['[data-bars-left]', '[data-bars-right]'],
            { y: -28, autoAlpha: 0, duration: 0.8 },
            0,
          );
          tl.from('[data-lockplate]', { autoAlpha: 0, y: -10, duration: 0.5 }, 0.2);
          tl.from(
            '[data-contact-reveal]',
            { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.7 },
            0.25,
          );
        },
      });

      return () => {
        window.removeEventListener('vb:released', release);
        st.kill();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add src/components/contact/ReleaseMotion.tsx
git commit -m "feat(contact): ReleaseMotion — стадия 1 (on-enter) + стадия 2 (vb:released → прутья/свет)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Каркас секции — `Contact.tsx`

**Files:**
- Create: `src/components/contact/Contact.tsx`
- Test: `src/components/contact/Contact.test.tsx`

- [ ] **Step 1: Написать падающий тест (фолбэк-видимость + семантика)**

Create `src/components/contact/Contact.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Contact } from './Contact';

// NB: ReleaseMotion в jsdom срабатывает на маунте (как About/Services/Evidence)
// и прячет [data-contact-reveal] (autoAlpha:0). Поэтому контент ищем по DOM
// (querySelector/getByLabelText игнорируют visibility), не getByRole (он отсекает скрытое).
describe('Contact', () => {
  it('секция id=contact + семантический h2', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('section#contact')).toBeInTheDocument();
    expect(container.querySelector('h2')?.textContent).toMatch(
      /visiting hours are open/i,
    );
  });
  it('форма, кнопка submit и подпись в DOM (фолбэк)', () => {
    const { container } = render(<Contact />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    const submit = container.querySelector('button[type="submit"]');
    expect(submit?.textContent).toMatch(/send message/i);
    expect(screen.getByText(/ready when it matters/i)).toBeInTheDocument();
  });
  it('directory-ссылка на Telegram в DOM', () => {
    const { container } = render(<Contact />);
    const tg = Array.from(container.querySelectorAll('a')).find((a) =>
      /t\.me\/BabiiVladyslav/.test(a.getAttribute('href') || ''),
    );
    expect(tg).toBeTruthy();
    expect(tg).toHaveAttribute('href', 'https://t.me/BabiiVladyslav');
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/contact/Contact.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/contact/Contact.tsx`:

```tsx
import { contact } from '@/content/contact';
import { Bars } from './Bars';
import { VisitForm } from './VisitForm';
import { ContactChannels } from './ContactChannels';
import { ReleaseMotion } from './ReleaseMotion';

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-14 py-28 max-md:px-6 max-md:py-20"
    >
      <ReleaseMotion>
        <Bars />
        <div className="relative z-10 mx-auto w-full max-w-[1100px]">
          <header data-contact-reveal className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {contact.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(32px,6vw,72px)] leading-[1.02] tracking-[0.01em] text-[var(--color-bone)] uppercase">
              {contact.heading}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--color-steel)]">
              {contact.sub}
            </p>
          </header>

          <div className="flex gap-14 max-lg:flex-col max-lg:gap-10">
            <div data-contact-reveal className="flex-[1.1] max-lg:w-full">
              <VisitForm />
            </div>
            <div data-contact-reveal className="flex-[0.9] max-lg:w-full">
              <ContactChannels />
            </div>
          </div>

          <p
            data-contact-reveal
            className="mt-16 text-[13px] tracking-[0.2em] text-[var(--color-dim)] uppercase max-md:mt-12"
          >
            {contact.signature}
          </p>
        </div>
      </ReleaseMotion>
    </section>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/contact/Contact.test.tsx`
Expected: PASS (3 теста).

- [ ] **Step 5: Весь набор тестов**

Run: `npm test`
Expected: все зелёные (новые contact-тесты + существующие).

- [ ] **Step 6: Коммит**

```bash
git add src/components/contact/Contact.tsx src/components/contact/Contact.test.tsx
git commit -m "feat(contact): каркас секции Contact (хедер + форма + directory + подпись)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Монтаж + сборка + проверка P1

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Подключить секцию после Evidence**

В `src/app/page.tsx` добавить импорт рядом с остальными:

```tsx
import { Contact } from '@/components/contact/Contact';
```

И в `<main>` после `<Evidence />`:

```tsx
        <main>
          <Hero />
          <About />
          <Services />
          <Evidence />
          <Contact />
        </main>
```

- [ ] **Step 2: Проверить, что P1-CTA уже корректны (код не меняем)**

Прочитать `src/content/hero.ts` — убедиться, что `cta[0].href === '#work'` и `cta[1].href === '#contact'` (уже так). Кода менять НЕ нужно: `#work` живой, `#contact` оживёт с этой секцией. Реальную прокрутку проверяем в Task 10.

- [ ] **Step 3: Типы + сборка**

Run: `npm run typecheck`
Expected: без ошибок.

Run: `npm run build`
Expected: чистый build; в Route-листинге появляется `ƒ /api/contact` (route handler).

- [ ] **Step 4: Коммит**

```bash
git add src/app/page.tsx
git commit -m "feat(contact): монтаж секции Contact в page.tsx (финал страницы)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Браузер + impeccable

**Files:** — (правки по итогам — точечно в созданных файлах)

- [ ] **Step 1: Локальный Telegram-тест (опционально, по наличию env)**

Если в `.env.local` есть `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` — отправка дойдёт в реальный чат. Если нет — `/api/contact` вернёт 500 `not_configured`, и форма покажет error-копи (это корректный фолбэк для проверки UI ветки ошибки). Реальную доставку владелец проверяет с настроенным `.env.local`.

- [ ] **Step 2: Превью-проверка секции**

`preview_start` (`npm run dev`), доскроллить до `#contact`. Проверить:
- стадия 1 (on-enter): прутья «садятся», плашка + контент проявляются плавно;
- сабмит (заполнить поля): стадия 2 — прутья разъезжаются, проявляется дневной свет, форма → success «Released», каналы видны;
- ветка ошибки (без env): error-копи под формой;
- `console`/`network` без ошибок (кроме ожидаемого 500 при отсутствии env).

- [ ] **Step 3: P1-CTA вживую**

На hero кликнуть «Open the case file ↗» → плавно скроллит к `#work`; «Make contact» → к `#contact`. FileNav `#contact` → к секции. Всё живое.

- [ ] **Step 4: Брейкпоинты 1280/768/375**

`preview_resize`. Проверить: нет горизонтального скролла; на `max-lg` форма и directory в одну колонку; прутья не давят контент (тоньше/реже на мобиле — подстроить, если нужно); тач-цели ≥44px; контраст текста (вкл. success-копи поверх света — не сломан).

- [ ] **Step 5: Скриншоты 1280 и 375** (`preview_screenshot`) — приложить владельцу (стадия 1 и стадия 2).

- [ ] **Step 6: impeccable audit → polish** по секции: иерархия (огромный h2-финал), ритм, выравнивания, тайминги/интенсивность света и разъезда прутьев, контраст. Точечные правки. После — повторить `npm test` + `npm run build`.

- [ ] **Step 7: Финальный коммит правок (если были)**

```bash
git add -A
git commit -m "polish(contact): impeccable — вычитка финала Visiting Hours
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Завершение ветки

После Task 10 — секция готова на `feat/contact-visiting-hours`. Дальше по решению владельца (skill `finishing-a-development-branch`):
- push → preview-деплой (проверить форму на проде-preview; владелец настраивает `.env.local`/Vercel env `TELEGRAM_BOT_TOKEN`+`TELEGRAM_CHAT_ID`);
- merge в `main` = ПРОД (сверить scope, [[deploy-scope-check-before-prod]], откат наготове) — только по явному «ок»;
- обновить `CLAUDE.md` (статус: сайт-нарратив завершён) и память.
- **Env на Vercel:** перед прод-мержем добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в Project → Settings → Environment Variables (Production), иначе форма вернёт 500. Секреты — НЕ в git.

## Покрытие спеки → задачами (self-review)

- §1 концепт RELEASE / Cell Door + свет — Task 6 (Bars/свет) + Task 7 (ReleaseMotion) + Task 8 (каркас).
- §2 раскладка (хедер h2, форма, directory, подпись) — Task 8.
- §3 хореография: стадия 1 on-enter + стадия 2 on-submit (vb:released) — Task 7 (+ диспатч в Task 5).
- §4 мобайл (одна колонка, ≥44px, без h-scroll) — Task 8 (классы) + Task 10 (проверка).
- §5 копи — Task 3.
- §6 форма → Telegram (порт lib + route, honeypot, валидация, env) — Tasks 1, 2.
- §7 GSAP-стек — Task 7 (плагины уже в `src/lib/gsap.ts`).
- §8 файлы/компоненты — Tasks 1–9.
- §8 P1-CTA — Task 9 step 2 (уже корректны) + Task 10 step 3 (проверка).
- §9 a11y (h2, label/for, aria-live, focus, ссылки, тач ≥44px) — Tasks 4, 5, 8.
- §10 тесты (lib чистые + route мок + content + channels + form states + каркас) — Tasks 1,2,3,4,5,8.
- §11 открытые вопросы (геометрия прутьев, свет, копи, порт) — Task 6 + Task 10.
