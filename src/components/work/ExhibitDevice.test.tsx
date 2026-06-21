import { render, screen } from '@testing-library/react';
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
});
