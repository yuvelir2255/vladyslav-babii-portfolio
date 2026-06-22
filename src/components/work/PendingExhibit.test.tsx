import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PendingExhibit } from './PendingExhibit';

describe('PendingExhibit', () => {
  it('показывает EVID-02 как coming soon с названием', () => {
    render(<PendingExhibit />);
    expect(screen.getByText(/EVID-02/)).toBeInTheDocument();
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Dream Gold/i })).toBeTruthy();
  });
});
