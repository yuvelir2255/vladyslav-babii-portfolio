import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { VisitForm } from './VisitForm';

afterEach(() => vi.restoreAllMocks());

describe('VisitForm', () => {
  it('рендерит 3 поля с label + скрытый honeypot', () => {
    const { container } = render(<VisitForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Your project')).toBeInTheDocument();
    const hp = container.querySelector('input[name="company"]');
    expect(hp).toBeTruthy();
    expect(hp).toHaveAttribute('aria-hidden', 'true');
  });

  it('успешная отправка → success-копи + диспатч vb:released', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const onReleased = vi.fn();
    window.addEventListener('vb:released', onReleased);

    render(<VisitForm />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.co' },
    });
    fireEvent.change(screen.getByLabelText('Your project'), {
      target: { value: 'Build X' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/your message is on its way/i),
      ).toBeInTheDocument(),
    );
    expect(onReleased).toHaveBeenCalled();
    window.removeEventListener('vb:released', onReleased);
  });

  it('ошибка сети → error-копи', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('nope', { status: 500 }),
    );
    render(<VisitForm />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.co' },
    });
    fireEvent.change(screen.getByLabelText('Your project'), {
      target: { value: 'x' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
  });
});
