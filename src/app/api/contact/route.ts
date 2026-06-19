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
