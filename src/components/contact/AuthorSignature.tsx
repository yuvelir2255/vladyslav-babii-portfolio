import { contact } from '@/content/contact';

// Финал нарратива: «дело закрыто» — авторская подпись живой рукой.
// Имя появляется супер-плавно (feathered-маска + blur→sharp + подъём — one-shot
// в ReleaseMotion). Базовое состояние — видимое (если JS не сработал, имя на месте).
export function AuthorSignature() {
  const { name, caption } = contact.author;
  return (
    <div data-sign className="mt-24 pb-6 max-md:mt-16 max-md:pb-4">
      <p
        data-sign-name
        className="sign-name inline-block origin-left -rotate-2 font-[family-name:var(--font-marker)] text-[clamp(30px,8.5vw,84px)] leading-[1.05] text-[var(--color-bone)]"
      >
        {name}
      </p>
      <svg
        data-sign-underline
        aria-hidden="true"
        viewBox="0 0 480 22"
        preserveAspectRatio="none"
        className="mt-1 block h-[14px] w-[min(420px,72%)] -rotate-1 overflow-visible text-[var(--color-orange)]"
      >
        <path
          d="M4 13 C 110 5, 250 19, 476 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p
        data-sign-cap
        className="mt-7 text-[12px] tracking-[0.2em] text-[var(--color-dim)] uppercase"
      >
        {caption}
      </p>
    </div>
  );
}
