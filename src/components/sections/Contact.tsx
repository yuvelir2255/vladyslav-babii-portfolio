'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SocialLinks from '@/components/ui/SocialLinks';
import Magnetic from '@/components/ui/Magnetic';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function Field({
  id,
  label,
  placeholder,
  type = 'text',
  textarea = false,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  error?: string;
}) {
  const base =
    'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-fg placeholder:text-faint outline-none transition-colors focus-visible:border-white/40';
  const cls = `${base} ${error ? 'border-red-500/60' : 'border-white/10'}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="text-dim mb-2 block font-mono text-[11px] tracking-[0.2em] uppercase"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cls}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * "Let's talk" — dark contact form that posts to /api/contact (→ Telegram).
 * Honeypot + loading/success/error states + accessible labels and errors.
 */
export default function Contact() {
  const t = useTranslations('Contact');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      project: String(fd.get('project') ?? ''),
      company: String(fd.get('company') ?? ''),
    };
    setStatus('submitting');
    setErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else if (res.status === 422) {
        const j = await res.json();
        setErrors(j.errors ?? {});
        setStatus('error');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const errText = (key?: string) =>
    key === 'invalid' ? t('invalidEmail') : key ? t('required') : undefined;

  return (
    <section id="contact" className="legible relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-sans text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          {t('title')}
        </h2>
        <p className="text-dim mt-5 max-w-xl text-lg leading-relaxed">
          {t('subtitle')}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
          {/* honeypot — hidden from real users */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <Field
            id="name"
            label={t('name')}
            placeholder={t('namePh')}
            error={errText(errors.name)}
          />
          <Field
            id="email"
            type="email"
            label={t('email')}
            placeholder={t('emailPh')}
            error={errText(errors.email)}
          />
          <Field
            id="project"
            textarea
            label={t('project')}
            placeholder={t('projectPh')}
            error={errText(errors.project)}
          />

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-fg text-bg rounded-full px-6 py-3 text-sm font-medium transition-transform active:scale-95 disabled:opacity-60"
              >
                {status === 'submitting' ? t('sending') : t('submit')}
              </button>
            </Magnetic>
            {status === 'success' && (
              <p role="status" className="text-fg text-sm">
                {t('success')}
              </p>
            )}
            {status === 'error' && Object.keys(errors).length === 0 && (
              <p role="alert" className="text-sm text-red-400">
                {t('error')}
              </p>
            )}
          </div>
        </form>

        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8">
          <SocialLinks />
          <p className="text-faint font-mono text-[11px] tracking-[0.2em]">
            {t('contactLine')}
          </p>
        </div>
      </div>
    </section>
  );
}
