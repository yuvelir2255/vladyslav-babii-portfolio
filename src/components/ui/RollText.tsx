import type { ReactNode } from 'react';

// Hover-roll: при наведении на родителя (класс `group`) видимый текст уезжает
// вверх, а снизу выкатывается его дубль. Чистый CSS — стили в globals.css.
// Клон — aria-hidden, чтобы скринридер/accessible-name не дублировались.
export function RollText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll__line">{children}</span>
      <span className="roll__line roll__line--clone" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
