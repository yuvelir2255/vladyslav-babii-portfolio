/**
 * Telegram Bot API send + message builder. Secrets are read from env on the
 * server only (never shipped to the client). Validation lives in
 * contact-validation.ts (pure, client-safe) and is re-exported here for the API
 * route and existing tests.
 */

import type { ContactInput } from './contact-validation';

export type {
  ContactInput,
  ContactErrors,
  ContactField,
} from './contact-validation';
export { validateContact, isSpam } from './contact-validation';

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
