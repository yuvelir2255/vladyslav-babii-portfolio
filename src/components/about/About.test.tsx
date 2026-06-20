import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('рендерит факты дела и мугшот', () => {
    render(<About />);
    expect(screen.getByText('Vladyslav Babii')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText(/Kharkiv/)).toBeInTheDocument();
    expect(
      screen.getByAltText(/Booking photo of Vladyslav Babii/i),
    ).toBeInTheDocument();
  });
  it('две рассекречиваемые кнопки и стек', () => {
    render(<About />);
    expect(
      screen.getByRole('button', { name: /declassify prior record/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /declassify charges/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/GSAP/)).toBeInTheDocument();
  });
});
