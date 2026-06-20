import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroScreen2 } from './HeroScreen2';

describe('HeroScreen2', () => {
  // текст манифеста проверяем через textContent параграфа: SplitText(words)
  // дробит фразы на слова-спаны, поэтому getByText по фразе не подходит.
  it('рендерит манифест и лейбл', () => {
    const { container } = render(<HeroScreen2 />);
    expect(screen.getByText(/on the record/i)).toBeInTheDocument();
    const manifest = container.querySelector('[data-manifest]');
    expect(manifest?.textContent).toMatch(/I don't write demos/i);
    expect(manifest?.textContent).toMatch(/break out/i);
  });
});
