import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './About';

describe('About', () => {
  // NB: значение возраста проверяется в about.test.ts; здесь — метка поля «Age»,
  // т.к. на маунте reveal в jsdom успевает запустить count-up (значение → «0»).
  // Кнопки-грифы ищем с hidden:true — reveal прячет их в jsdom (getByRole иначе отсекает).
  it('рендерит факты дела и мугшот', () => {
    render(<About />);
    expect(screen.getByText('Vladyslav Babii')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText(/Kharkiv/)).toBeInTheDocument();
    expect(
      screen.getByAltText(/Booking photo of Vladyslav Babii/i),
    ).toBeInTheDocument();
  });
  it('две рассекречиваемые кнопки и стек', () => {
    const { container } = render(<About />);
    const redacted = container.querySelectorAll('[data-redacted]');
    expect(redacted).toHaveLength(2);
    expect(redacted[0].getAttribute('aria-label')).toMatch(
      /declassify prior record/i,
    );
    expect(redacted[1].getAttribute('aria-label')).toMatch(
      /declassify charges/i,
    );
    expect(container.textContent).toMatch(/GSAP/);
  });
});
