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

  it('пустой сабмит → пер-полевые ошибки + fetch НЕ вызван', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    render(<VisitForm />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText(/please enter your name/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/what you want built/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    // поле помечено невалидным для SR
    expect(screen.getByLabelText('Name')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('битый email → ошибка email, валидные name/project не ошибаются, fetch НЕ вызван', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    render(<VisitForm />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad' },
    });
    fireEvent.change(screen.getByLabelText('Your project'), {
      target: { value: 'Build X' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/please enter your name/i),
    ).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('исправление поля убирает его ошибку', async () => {
    render(<VisitForm />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(
      await screen.findByText(/please enter your name/i),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ann' },
    });
    expect(
      screen.queryByText(/please enter your name/i),
    ).not.toBeInTheDocument();
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
