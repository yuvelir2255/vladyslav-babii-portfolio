import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Placard } from './Placard';

describe('Placard', () => {
  it('рендерит данные booking-таблички', () => {
    render(<Placard />);
    expect(screen.getByText('Department of Shipping')).toBeInTheDocument();
    expect(screen.getByText('Ukraine')).toBeInTheDocument();
    expect(screen.getByText('VB-19')).toBeInTheDocument();
  });
});
