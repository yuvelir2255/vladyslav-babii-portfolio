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
