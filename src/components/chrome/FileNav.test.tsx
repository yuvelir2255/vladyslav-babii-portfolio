import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { FileNav } from './FileNav';

describe('FileNav', () => {
  it('раскрывает директорию секций по клику', async () => {
    render(<FileNav />);
    expect(screen.queryByText('Evidence')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /open directory/i }),
    );
    expect(screen.getByRole('link', { name: /evidence/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /visiting hours/i }),
    ).toBeInTheDocument();
  });
});
