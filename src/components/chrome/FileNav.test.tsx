import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FileNav } from './FileNav';

const SECTION_IDS = ['yard', 'about', 'services', 'work', 'contact'];

afterEach(() => {
  vi.unstubAllGlobals();
  SECTION_IDS.forEach((id) => document.getElementById(id)?.remove());
});

describe('FileNav', () => {
  it('переключает директорию и содержит секции', async () => {
    const { container } = render(<FileNav />);
    const btn = screen.getByRole('button', { name: /directory/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    // label обёрнут в RollText (видимый текст + aria-hidden клон) → ищем ссылки по
    // href, а не наивным getByText (нашёл бы дубль из-за клона). Видимый текст —
    // в .roll__line (не в клоне), его и проверяем.
    const evid = container.querySelector('a[href="#work"]');
    const visit = container.querySelector('a[href="#contact"]');
    expect(
      evid?.querySelector('.roll__line:not(.roll__line--clone)'),
    ).toHaveTextContent('Evidence');
    expect(
      visit?.querySelector('.roll__line:not(.roll__line--clone)'),
    ).toHaveTextContent('Visiting Hours');
  });

  it('scroll-spy: помечает активную секцию aria-current при пересечении', () => {
    // стаб-секции, чтобы observer нашёл цели
    SECTION_IDS.forEach((id) => {
      const s = document.createElement('section');
      s.id = id;
      document.body.appendChild(s);
    });
    let cb: IntersectionObserverCallback | null = null;
    class IOStub {
      constructor(c: IntersectionObserverCallback) {
        cb = c;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal('IntersectionObserver', IOStub);

    const { container } = render(<FileNav />);
    const link = (href: string) => container.querySelector(`a[href="${href}"]`);

    // по умолчанию активна первая секция (The Yard)
    expect(link('#yard')).toHaveAttribute('aria-current', 'true');

    // имитируем, что в центр вьюпорта попала секция work (Evidence)
    act(() => {
      cb?.(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: document.getElementById('work'),
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(link('#work')).toHaveAttribute('aria-current', 'true');
    expect(link('#yard')).not.toHaveAttribute('aria-current');
  });
});
