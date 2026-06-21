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
