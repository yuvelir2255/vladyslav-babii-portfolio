'use client';

import { useRef, useState } from 'react';

// тюремный эмбиент кладётся отдельно по пути /audio/ambient.mp3 (CC0).
// до появления файла кнопка работает «вхолостую»: play() отклонится — остаёмся off.
const SRC = '/audio/ambient.mp3';

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (on) {
      el.pause();
      setOn(false);
      return;
    }
    try {
      el.volume = 0.4;
      await el.play();
      setOn(true);
    } catch {
      // файла ещё нет (404) или автоплей заблокирован — тихо остаёмся off
      setOn(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={on ? 'Mute ambience' : 'Play ambience'}
        aria-pressed={on}
        className="fixed right-5 bottom-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-[rgba(16,15,13,0.72)] text-[var(--color-steel)] backdrop-blur transition-colors hover:border-[var(--color-orange)] hover:text-[var(--color-bone)] focus-visible:text-[var(--color-bone)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {on ? (
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          ) : (
            <>
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
