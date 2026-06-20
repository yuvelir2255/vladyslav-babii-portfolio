import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookingPhoto } from './BookingPhoto';

describe('BookingPhoto', () => {
  it('рендерит мугшот с alt, теги и табличку', () => {
    render(<BookingPhoto />);
    expect(screen.getByAltText(/booking photo/i)).toBeInTheDocument();
    expect(screen.getByText('EXHIBIT A')).toBeInTheDocument();
    expect(screen.getByText(/at large/i)).toBeInTheDocument();
    expect(screen.getByText(/dept\. of shipping/i)).toBeInTheDocument();
  });
});
