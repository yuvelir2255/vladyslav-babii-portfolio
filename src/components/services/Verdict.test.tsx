import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Verdict } from './Verdict';

describe('Verdict', () => {
  it('рендерит вердикт и строку приговора', () => {
    render(<Verdict />);
    expect(screen.getByText(/Guilty on all five counts/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentenced to keep shipping/i)).toBeInTheDocument();
  });
  it('хедлайн вердикта — это heading', () => {
    const { container } = render(<Verdict />);
    expect(container.querySelector('h2,h3')?.textContent).toMatch(
      /Guilty on all/i,
    );
  });
});
