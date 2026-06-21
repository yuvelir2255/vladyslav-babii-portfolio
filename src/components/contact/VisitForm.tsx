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
