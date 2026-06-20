import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroScreen2 } from './HeroScreen2';

describe('HeroScreen2', () => {
  it('рендерит манифест и лейбл', () => {
    render(<HeroScreen2 />);
    expect(screen.getByText(/on the record/i)).toBeInTheDocument();
    expect(screen.getByText(/I don't write demos/i)).toBeInTheDocument();
    expect(screen.getByText(/break out/i)).toBeInTheDocument();
  });
});
