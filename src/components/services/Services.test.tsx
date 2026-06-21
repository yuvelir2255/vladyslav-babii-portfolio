import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Services } from './Services';

describe('Services', () => {
  it('секция #services с заголовком-интро', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#services')).not.toBeNull();
    expect(
      screen.getByText(/The people charge the defendant with/i),
    ).toBeInTheDocument();
  });
  it('рендерит все 5 обвинений и финал-вердикт (фолбэк)', () => {
    const { container } = render(<Services />);
    expect(container.querySelectorAll('[data-count]')).toHaveLength(5);
    expect(screen.getByText('Unlawful web construction')).toBeInTheDocument();
    expect(screen.getByText('Designing what he builds')).toBeInTheDocument();
    expect(screen.getByText(/Guilty on all five counts/i)).toBeInTheDocument();
  });
});
