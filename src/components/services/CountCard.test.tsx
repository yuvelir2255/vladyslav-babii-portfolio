import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CountCard } from './CountCard';

const count = {
  n: '02',
  charge: 'Operating products inside Telegram',
  gloss: 'Full products that live inside the chat.',
  plea: 'Guilty',
} as const;

describe('CountCard', () => {
  it('рендерит номер, обвинение и пояснение', () => {
    render(
      <ul>
        <CountCard count={count} total={5} />
      </ul>,
    );
    expect(
      screen.getByText('Operating products inside Telegram'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Full products that live/)).toBeInTheDocument();
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
  });
  it('заголовок обвинения — это heading', () => {
    const { container } = render(
      <ul>
        <CountCard count={count} total={5} />
      </ul>,
    );
    expect(container.querySelector('h3')?.textContent).toMatch(
      /Operating products/,
    );
  });
});
