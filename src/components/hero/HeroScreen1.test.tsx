import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroScreen1 } from './HeroScreen1';

describe('HeroScreen1', () => {
  it('рендерит имя, роль, мету и две CTA', () => {
    render(<HeroScreen1 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vladyslav',
    );
    expect(screen.getByText(/Telegram Mini Apps/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /open the case file/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /make contact/i }),
    ).toBeInTheDocument();
  });
  it('рендерит значения рап-шита', () => {
    render(<HeroScreen1 />);
    expect(screen.getByText(/unrepentant/i)).toBeInTheDocument();
    expect(screen.getByText(/builds, ships, escapes/i)).toBeInTheDocument();
    expect(screen.getByText(/threat level/i)).toBeInTheDocument();
  });
});
