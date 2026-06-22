import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthorSignature } from './AuthorSignature';

// NB: подпись появляется через scroll-scrub (mask/blur), но текст всегда в DOM.
// getByText находит элемент независимо от visibility (см. Contact.test).
describe('AuthorSignature', () => {
  it('рендерит полное имя автора', () => {
    render(<AuthorSignature />);
    expect(screen.getByText('Vladyslav Babii')).toBeInTheDocument();
  });

  it('рендерит подкаптион подписи', () => {
    render(<AuthorSignature />);
    expect(screen.getByText(/release authorized/i)).toBeInTheDocument();
  });

  it('декоративное подчёркивание скрыто от скринридера', () => {
    const { container } = render(<AuthorSignature />);
    const underline = container.querySelector('[data-sign-underline]');
    expect(underline).toBeTruthy();
    expect(underline).toHaveAttribute('aria-hidden', 'true');
  });
});
