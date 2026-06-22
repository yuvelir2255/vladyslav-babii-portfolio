import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExhibitLinks } from './ExhibitLinks';

describe('ExhibitLinks', () => {
  it('даёт живые внешние ссылки на экспонат и веб-демо', () => {
    render(<ExhibitLinks />);
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
});
