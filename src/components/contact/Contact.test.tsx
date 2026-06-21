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
