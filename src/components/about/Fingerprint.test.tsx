import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fingerprint } from './Fingerprint';

describe('Fingerprint', () => {
  it('рендерит svg с линиями для DrawSVG', () => {
    const { container } = render(<Fingerprint />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(
      container.querySelectorAll('[data-fp]').length,
    ).toBeGreaterThanOrEqual(5);
  });
});
