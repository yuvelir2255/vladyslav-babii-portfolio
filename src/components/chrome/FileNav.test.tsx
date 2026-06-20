import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { FileNav } from './FileNav';

describe('FileNav', () => {
  it('переключает директорию и содержит секции', async () => {
    render(<FileNav />);
    const btn = screen.getByRole('button', { name: /directory/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Evidence')).toBeInTheDocument();
    expect(screen.getByText('Visiting Hours')).toBeInTheDocument();
  });
});
