import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConcreteBg } from './ConcreteBg';

describe('ConcreteBg', () => {
  it('рендерит фон #concrete-bg (aria-hidden) с мод-слоями и vignette', () => {
    const { container } = render(<ConcreteBg />);
    const bg = container.querySelector('#concrete-bg');
    expect(bg).toBeTruthy();
    expect(bg?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.mood-steel')).toBeTruthy();
    expect(container.querySelector('.mood-warm')).toBeTruthy();
    expect(container.querySelector('.mood-day')).toBeTruthy();
    expect(container.querySelector('.bg-vignette')).toBeTruthy();
  });
});
