import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EvidenceMarkers } from './EvidenceMarkers';

describe('EvidenceMarkers', () => {
  it('рендерит список из 3 маркеров с заголовком и заметкой', () => {
    const { container } = render(<EvidenceMarkers />);
    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('AI product cards')).toBeInTheDocument();
    expect(screen.getByText(/GPT-4o-mini vision/)).toBeInTheDocument();
    expect(screen.getByText('On-screen ring sizer')).toBeInTheDocument();
    expect(screen.getByText('HMAC-signed orders')).toBeInTheDocument();
  });
});
