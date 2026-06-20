import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RedactedField } from './RedactedField';

describe('RedactedField', () => {
  it('значение в DOM, по умолчанию засекречено', () => {
    render(<RedactedField label="Prior record" value="secret intel" />);
    const btn = screen.getByRole('button', {
      name: /declassify prior record/i,
    });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('secret intel')).toBeInTheDocument();
  });
  it('клик рассекречивает и засекречивает обратно', () => {
    render(<RedactedField label="Prior record" value="secret intel" />);
    const btn = screen.getByRole('button', {
      name: /declassify prior record/i,
    });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(btn).toHaveAttribute('data-open', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
