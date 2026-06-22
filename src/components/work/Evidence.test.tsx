import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Evidence } from './Evidence';

// NB: reveal-моушн (EvidenceMotion) в jsdom успевает сработать на маунте —
// SplitText дробит заголовок (ставит aria-label на h3), а .from(autoAlpha:0)
// прячет custody-строки. Поэтому: текст ищем по data-атрибуту/textContent
// (не getByText на разбитом заголовке), а скрытую ссылку — с hidden:true.
describe('Evidence', () => {
  it('секция имеет id=work и семантический h2-интро', () => {
    const { container } = render(<Evidence />);
    expect(container.querySelector('section#work')).toBeInTheDocument();
    const h2 = container.querySelector('h2');
    expect(h2?.textContent).toMatch(/submit the following evidence/i);
  });
  it('показывает заголовок экспоната и summary (фолбэк-контент в DOM)', () => {
    const { container } = render(<Evidence />);
    const title = container.querySelector('[data-exhibit-title]');
    expect(title).toBeTruthy();
    const titleText =
      title?.getAttribute('aria-label') ?? title?.textContent ?? '';
    expect(titleText).toMatch(/Dream Gold/);
    expect(
      screen.getByText(/taking real orders for a jewelry atelier/i),
    ).toBeInTheDocument();
  });
  it('содержит живую ссылку на экспонат (anchor в DOM)', () => {
    const { container } = render(<Evidence />);
    const open = Array.from(container.querySelectorAll('a')).find((a) =>
      /open exhibit/i.test(a.textContent || ''),
    );
    expect(open).toBeTruthy();
    expect(open).toHaveAttribute(
      'href',
      'https://t.me/dreamgold_jewelry_bot/shop',
    );
    expect(open).toHaveAttribute('target', '_blank');
  });
});
