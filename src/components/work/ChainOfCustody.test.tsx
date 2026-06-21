import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChainOfCustody } from './ChainOfCustody';

describe('ChainOfCustody', () => {
  it('даёт живые внешние ссылки на экспонат и веб-демо', () => {
    render(<ChainOfCustody />);
    const open = screen.getByRole('link', { name: /open exhibit/i });
    expect(open).toHaveAttribute(
      'href',
      'https://t.me/dreamgold_jewelry_bot/shop',
    );
    expect(open).toHaveAttribute('target', '_blank');
    expect(open).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(screen.getByRole('link', { name: /web demo/i })).toHaveAttribute(
      'href',
      'https://dreamgold-jewelry.vercel.app',
    );
  });
  it('показывает EVID-02 как coming soon', () => {
    render(<ChainOfCustody />);
    expect(screen.getByText(/EVID-02/)).toBeInTheDocument();
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
  });
});
