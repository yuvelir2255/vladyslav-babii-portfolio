import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Ticker } from './Ticker';

describe('Ticker', () => {
  it('рендерит пункты (дублируются для бесшовности)', () => {
    render(<Ticker />);
    expect(
      screen.getAllByText(/STATUS: AT LARGE/i).length,
    ).toBeGreaterThanOrEqual(2);
  });
});
