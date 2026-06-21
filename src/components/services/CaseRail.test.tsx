import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CaseRail } from './CaseRail';

describe('CaseRail', () => {
  it('рендерит 5 пунктов индекса, счётчик и прогресс', () => {
    const { container } = render(<CaseRail />);
    expect(container.querySelectorAll('[data-rail-item]')).toHaveLength(5);
    expect(container.querySelector('[data-rail-tally]')?.textContent).toMatch(
      /guilty/i,
    );
    expect(container.querySelector('[data-rail-progress]')).not.toBeNull();
    expect(container.querySelector('[data-rail-count]')?.textContent).toMatch(
      /01 \/ 05/,
    );
  });
  it('рейл скрыт от скринридера (декоративный индекс)', () => {
    const { container } = render(<CaseRail />);
    expect(
      container.querySelector('[data-rail]')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
