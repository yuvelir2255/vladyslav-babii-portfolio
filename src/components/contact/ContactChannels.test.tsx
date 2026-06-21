import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactChannels } from './ContactChannels';

describe('ContactChannels', () => {
  it('рендерит внешние каналы как ссылки с target/rel', () => {
    render(<ContactChannels />);
    const tg = screen.getByRole('link', { name: /telegram/i });
    expect(tg).toHaveAttribute('href', 'https://t.me/BabiiVladyslav');
    expect(tg).toHaveAttribute('target', '_blank');
    expect(tg).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
  it('email — mailto без target', () => {
    render(<ContactChannels />);
    const mail = screen.getByRole('link', { name: /email/i });
    expect(mail).toHaveAttribute('href', 'mailto:vladbabii31@gmail.com');
    expect(mail).not.toHaveAttribute('target');
  });
  it('показывает локацию', () => {
    render(<ContactChannels />);
    expect(screen.getByText(/Warsaw, PL/)).toBeInTheDocument();
  });
});
