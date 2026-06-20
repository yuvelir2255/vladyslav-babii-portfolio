import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Placard } from './Placard';

describe('Placard', () => {
  it('рендерит линованную табличку с данными владельца', () => {
    render(<Placard />);
    expect(screen.getByText(/dept\. of shipping/i)).toBeInTheDocument();
    expect(screen.getByText('VB-19')).toBeInTheDocument();
    expect(screen.getByText('V. Babii')).toBeInTheDocument();
    expect(screen.getByText(/shipping products/i)).toBeInTheDocument();
  });
});
