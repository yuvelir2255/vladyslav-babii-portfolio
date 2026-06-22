'use client';

import { useState } from 'react';
import { contact } from '@/content/contact';
import { validateContact, type ContactErrors } from '@/lib/contact-validation';

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldName = 'name' | 'email' | 'project';

const field =
  'mt-1 w-full rounded border border-[var(--color-line)] bg-[rgba(16,15,13,0.6)] px-3 py-2.5 text-[14px] text-[var(--color-bone)] placeholder:text-[var(--color-dim)] focus-visible:border-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)] aria-[invalid=true]:border-[var(--color-orange)]';
const labelCls =
  'block text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase';
const errCls = 'mt-1 text-[12px] text-[var(--color-orange)]';

export function VisitForm() {
  const c = contact.form;
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactErrors>({});

  const msgFor = (name: FieldName): string | null => {
    const code = errors[name];
    if (!code) return null;
    if (name === 'email')
      return code === 'invalid'
        ? c.errors.emailInvalid
        : c.errors.emailRequired;
    return name === 'name' ? c.errors.name : c.errors.project;
  };

  const clearError = (name: FieldName) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      project: String(fd.get('project') ?? ''),
      company: String(fd.get('company') ?? ''),
    };

    // клиентская валидация (та же, что на сервере) — не шлём пустое/битое,
    // показываем пер-полевые ошибки и фокусируем первое невалидное поле
    const { ok, errors: fieldErrors } = validateContact(values);
    if (!ok) {
      setErrors(fieldErrors);
      setStatus('idle');
      const first = (['name', 'email', 'project'] as const).find(
        (k) => fieldErrors[k],
      );
      if (first) document.getElementById(`vf-${first}`)?.focus();
      return;
    }

    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
        role="status"
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
        <div className="flex items-baseline gap-1">
          <label htmlFor="vf-name" className={labelCls}>
            {c.name.label}
          </label>
          <span aria-hidden="true" className="text-[var(--color-orange)]">
            *
          </span>
        </div>
        <input
          id="vf-name"
          name="name"
          type="text"
          required
          placeholder={c.name.placeholder}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'vf-name-error' : undefined}
          onChange={() => clearError('name')}
          className={field}
        />
        {msgFor('name') && (
          <p
            id="vf-name-error"
            role="alert"
            data-field-error="name"
            className={errCls}
          >
            {msgFor('name')}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <label htmlFor="vf-email" className={labelCls}>
            {c.email.label}
          </label>
          <span aria-hidden="true" className="text-[var(--color-orange)]">
            *
          </span>
        </div>
        <input
          id="vf-email"
          name="email"
          type="email"
          required
          placeholder={c.email.placeholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'vf-email-error' : undefined}
          onChange={() => clearError('email')}
          className={field}
        />
        {msgFor('email') && (
          <p
            id="vf-email-error"
            role="alert"
            data-field-error="email"
            className={errCls}
          >
            {msgFor('email')}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <label htmlFor="vf-project" className={labelCls}>
            {c.project.label}
          </label>
          <span aria-hidden="true" className="text-[var(--color-orange)]">
            *
          </span>
        </div>
        <textarea
          id="vf-project"
          name="project"
          required
          rows={4}
          placeholder={c.project.placeholder}
          aria-invalid={errors.project ? true : undefined}
          aria-describedby={errors.project ? 'vf-project-error' : undefined}
          onChange={() => clearError('project')}
          className={`${field} resize-none`}
        />
        {msgFor('project') && (
          <p
            id="vf-project-error"
            role="alert"
            data-field-error="project"
            className={errCls}
          >
            {msgFor('project')}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
        className="min-h-[44px] rounded bg-[var(--color-orange)] px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-[#160d06] uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-bone)] disabled:opacity-60"
      >
        {status === 'sending' ? c.sending : c.submit}
      </button>
      {status === 'error' && (
        <p
          data-form-error
          role="alert"
          className="text-[13px] text-[var(--color-orange)]"
        >
          {c.error}
        </p>
      )}
    </form>
  );
}
