/**
 * Pure, dependency-free contact-form validation. Lives apart from telegram.ts so
 * the client form can import it WITHOUT pulling the server-only Telegram send
 * into the client bundle. Shared by the client form and the API route.
 */

export interface ContactInput {
  name: string;
  email: string;
  project: string;
  /** Honeypot — real users leave this empty. */
  company?: string;
}

export type ContactField = 'name' | 'email' | 'project';
export type ContactErrors = Partial<
  Record<ContactField, 'required' | 'invalid'>
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
