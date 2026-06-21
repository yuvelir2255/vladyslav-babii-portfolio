import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExhibitDevice } from './ExhibitDevice';

describe('ExhibitDevice', () => {
  it('рендерит все 4 скрина с alt и метку EVID-01', () => {
    render(<ExhibitDevice />);
    expect(
      screen.getByAltText('Dream Gold storefront inside Telegram'),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Dream Gold product card')).toBeInTheDocument();
    expect(
      screen.getByAltText('On-screen ring sizer measuring in millimetres'),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Dream Gold cart and order'),
    ).toBeInTheDocument();
    expect(screen.getByText('EVID-01')).toBeInTheDocument();
  });
  it('даёт фокусируемые кнопки-точки для каждого скрина', () => {
    render(<ExhibitDevice />);
    expect(
      screen.getByRole('button', { name: /show shop/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show cart/i }),
    ).toBeInTheDocument();
  });
  it('стрелки prev/next листают вручную, в обе стороны с зацикливанием', () => {
    render(<ExhibitDevice />);
    const next = screen.getByRole('button', { name: /next screenshot/i });
    const prev = screen.getByRole('button', { name: /previous screenshot/i });
    const current = () =>
      screen
        .getAllByRole('button')
        .find((b) => b.getAttribute('aria-current') === 'true')
        ?.getAttribute('aria-label');

    expect(current()).toMatch(/show shop/i);
    fireEvent.click(next);
    expect(current()).toMatch(/show product/i);
    fireEvent.click(prev);
    expect(current()).toMatch(/show shop/i);
    // prev с первого кадра → последний (Cart), зацикливание
    fireEvent.click(prev);
    expect(current()).toMatch(/show cart/i);
  });
});
