# Дизайн-спека: секция Contact — «Visiting Hours / Release» (финал)

> Дата: 2026-06-21. Статус: согласовано владельцем в брейншторме.
> Спека ПЯТОГО (финального) среза сборки. Развивает концепт «Case File» из спек hero/about/
> services/evidence — читать вместе (та же система: бетон + сталь + prison-orange). Язык —
> **EN-only**. **Скоуп — секция `#contact` + бэкенд формы → Telegram + оживление P1-CTA.**

## 1. Что это и зачем

Секция `#contact` (в навигации FileNav — `VISITING HOURS`, код 04) — **финал сайта**. Весь сайт
был тёмной «клеткой»; здесь посетитель **выходит на контакт и выпускает билдера** — арка
«неудержимый билдер, сбегающий из клетки демок» закрывается. Это и контактная форма (мягкая
заявка для агентств/предпринимателей), и эмоциональная кульминация.

**Концепция (согласована):** **RELEASE** — освобождение. **Каркас: «Cell Door + свет»** — на входе
клетка заперта; на успешную отправку формы **прутья разъезжаются и сквозь проём бьёт дневной
свет**. **Две стадии:** on-enter (замок «садится») → on-submit success (освобождение). Штамп
`RELEASED` — мелкий акцент (НЕ 4-й штамп-каркас после AT LARGE/GUILTY/ADMITTED).

## 2. Раскладка (desktop)

Секция content-height, встык после Evidence (без пина — см. §3). Центрирована по `max-w ~1100px`.

- **Хедер:** эйдброу `● VISITING HOURS` + семантический `<h2>` в release-тоне
  (рабочее: `Visiting hours are open.` / подзаголовок зовёт «вытащить его»).
- **Сцена «в камере»:** вертикальные **стальные прутья ОБРАМЛЯЮТ** контент (по краям/над сценой),
  НЕ перекрывают форму — читаемость превыше. Внутри две зоны:
  - **Форма-заявка (мягкая, 3 поля):** `Name` · `Email` · `Your project` + сабмит-кнопка.
    Состояния: `idle → sending → released (success) → error`.
  - **Directory (каналы):** email, Telegram `@BabiiVladyslav`, GitHub, LinkedIn, Instagram,
    `Warsaw, PL` — «официальный справочник». Иконки: Simple Icons (бренды) + Lucide-стиль
    (mail/pin), **инлайн-SVG** (без новой зависимости, как уже инлайнятся иконки в проекте).
- **Подпись-закрытие:** `Ready when it matters.` — последняя строка сайта.

## 3. Хореография — сигнатура секции

**Решение: on-enter reveal БЕЗ пина** (сиблинг `DossierMotion`/`EvidenceMotion`; единственный пин
на сайте — Charges, второй не нужен). Кульминация — **событийная (on-submit)**, не скролловая.

**Стадия 1 — on-enter** (`ScrollTrigger` once, `start ~'top 75%'`):
- прутья «садятся» сверху (`y`, stagger, `power3.out`) + клик замка-плашки `VISITING HOURS`;
- хедер → форма → directory проявляются (stagger). Спокойно, плавно. Контент видим по дефолту
  (фолбэк: если ScrollTrigger не сработал — секция читается как обычная).

**Стадия 2 — on-submit success** (после успешного ответа `/api/contact`):
- **прутья разъезжаются** горизонтально (левые влево, правые вправо, `power3.inOut`);
- за ними плавно проявляется **тёплый дневной свет** — контролируемый шафт/glow (flat-тёплый
  филл, БЕЗ градиентных мерцаний; НЕ заливаем всю страницу — разовый финальный акцент,
  осознанный слом dark-only);
- мелкая строка/штамп `RELEASED` + success-копи; каналы «дышат» (лёгкий stagger);
- форма сменяется success-состоянием (поля скрываются, остаётся подтверждение + каналы).

**on-error:** прутья НЕ открываются; под формой — текст ошибки (`aria-live`) с прямым email.
Звука нет.

## 4. Поведение на мобиле/планшете

- Та же on-enter + on-submit механика (без пина — адаптив простой).
- **Раскладка:** desktop — форма и directory рядом/в потоке; `max-md` — одна колонка:
  хедер → форма → directory → подпись. Прутья **тоньше/реже** на узком экране (или только
  верхняя «решётка»), чтобы не давить контент.
- Без горизонтального скролла; тач-цели ≥44px (поля, кнопка, ссылки-каналы); размеры `clamp()`.
- Разъезд прутьев на мобиле — короче/мягче (та же логика через `matchMedia`, если нужно).

## 5. Контент / копи (EN)

Источник — `docs/content-backup.md` (тексты формы/контактов), адаптация под release-тон. Выносим
в `src/content/contact.ts`. Точные строки финализируем на вёрстке; рабочая версия:

- Эйдброу: `● VISITING HOURS`
- Заголовок (h2): рабочее `Visiting hours are open.` (+ подзаголовок:
  `Got an idea, a product, or a process that should run itself? Tell me about it — I reply fast and start faster.`)
- Поля: `Name` · `Email` · `Your project` (textarea)
- Кнопка: рабочее `Send message` (вариант release-тона `Request the visit` — выберем на вёрстке)
- Success: рабочее `Released — your message is on its way. I'll reply soon.`
- Error: `Something went wrong. Email me directly: vladbabii31@gmail.com`
- Directory:
  - email `vladbabii31@gmail.com` (`mailto:`)
  - Telegram `@BabiiVladyslav` (`https://t.me/BabiiVladyslav`)
  - GitHub `https://github.com/yuvelir2255`
  - LinkedIn `https://www.linkedin.com/in/vladyslav-babii-886052385/`
  - Instagram `https://www.instagram.com/babii.vladyslavv/`
  - Локация `Warsaw, PL`
- Подпись: `Ready when it matters.`

## 6. Форма → Telegram (бэкенд — ПОРТ из archive, не писать заново)

- Портировать из ветки `archive/luca-portfolio-2026-06-20`: `src/lib/telegram.ts` +
  `src/app/api/contact/route.ts` (POST → Telegram-бот). Сверить с текущим стеком (Next 16 route
  handlers) и адаптировать при необходимости.
- **Env:** `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` в `.env.local` (gitignored) + добавить в
  `.env.example` (без значений). Токен — **только серверный**, в клиент не попадает.
- **Безопасность:** серверная валидация полей (длина/формат email/непустота — клиенту не верим);
  **honeypot**-поле (скрытое; заполнено → тихо игнорим) от ботов. Капча/сложный rate-limit —
  вне scope (honeypot достаточно для старта).
- **Контракт:** `POST /api/contact` JSON `{ name, email, project, hp }` → `200 {ok:true}` /
  `400` (валидация) / `500` (ошибка отправки). Клиент по ответу переключает состояние формы.

## 7. Технологии и анимации

- **GSAP ScrollTrigger** — on-enter триггер (once), без пина.
- **GSAP Timeline** — стадия 1 (прутья садятся + reveal) и стадия 2 (разъезд прутьев + свет +
  success), запускается из success-колбэка формы (через ref/событие, не на скролл).
- **SplitText** (опц.) — заголовок/подпись по словам.
- Прутья — DOM/SVG-элементы (`transform: translateX`), свет — flat-тёплый слой (`opacity` reveal).
- **gsap.matchMedia** — при необходимости развести длину/мягкость разъезда desktop/mobile.
- **Lenis** (глобально) — плавный скролл. Фон — единый `ConcreteBg` (глобальный), новый шейдер НЕ нужен.
- Без новых зависимостей: иконки — инлайн-SVG; форма — нативная (React state), без form-либ.

Плагины GSAP уже в `src/lib/gsap.ts` (ScrollTrigger/SplitText/ScrambleText/DrawSVG).

## 8. Компоненты / файлы

```
src/content/contact.ts             — копи (эйдброу/заголовок/подзаголовок/кнопка/успех/ошибка) + directory (каналы) + подпись
src/components/contact/
  Contact.tsx                      — <section id="contact"> + хедер + сцена (форма + directory) + подпись (server)
  VisitForm.tsx                    — 'use client': форма (3 поля + honeypot), состояния, fetch /api/contact, success/error (aria-live)
  ContactChannels.tsx              — directory: ссылки-каналы + локация (инлайн-SVG иконки)
  Bars.tsx                         — стальные прутья (декоративный слой, data-хуки для разъезда)
  ReleaseMotion.tsx                — 'use client', useGSAP: стадия 1 (on-enter) + экспонирует триггер стадии 2 (release) для VisitForm
src/lib/telegram.ts                — ПОРТ из archive: отправка в Telegram
src/app/api/contact/route.ts       — ПОРТ из archive: POST-обработчик (валидация + honeypot + отправка)
.env.example                       — + TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID (без значений)
```

Монтаж: `<Contact />` в `src/app/page.tsx` **после `<Evidence/>`** (финал страницы). Якорь
`#contact` в FileNav оживёт. Ветка: **`feat/contact-visiting-hours` от свежего `main`**.

**P1-связки (в этой же ветке, по решению владельца):** hero-CTA «Make contact · visiting hours
open» → `#contact`; «Open the case file ↗» → `#work` (секция Evidence теперь в проде). После
этого все CTA и пункты FileNav живые.

## 9. a11y

- `prefers-reduced-motion` намеренно НЕ уважаем (решение проекта), но контент всегда в DOM
  (фолбэк-видимость; прутья/свет — декоративный слой, не гейтят контент).
- Семантика: один `<h2>`; форма — нативные `<form>`/`<label for>`/`<input>`/`<textarea>`;
  кнопка `<button type="submit">`.
- Валидация: ошибки текстом + `aria-live="polite"` для success/error; обязательные поля помечены;
  success анонсируется скринридеру.
- `:focus-visible` на полях/кнопке/ссылках; ссылки-каналы — настоящие `<a>` (внешние —
  `target="_blank" rel="noopener noreferrer"`; email — `mailto:`).
- Контраст AA (токены bone/steel/orange/dim); тач ≥44px; брейкпоинты 375/768/1280, без h-scroll.

## 10. Тесты (Vitest)

- `contact.ts` — структура копи + directory (каналы, ссылки, локация на месте).
- `VisitForm` — рендер 3 полей с label, кнопка submit; honeypot-поле скрыто; (моушн — в браузере).
- `ContactChannels` — ссылки с корректными href/target/rel.
- `api/contact` route — юнит логики: валидация (пустое/битый email → 400), honeypot заполнен →
  тихий 200 без отправки, валидный вход → вызывает отправку (Telegram замокан). Без реального сетевого вызова.
- Моушн (прутья/свет/release) и 60fps — проверяем в браузере (preview 375/768/1280).

## 11. Открытые вопросы (решим на сборке)

- **Геометрия прутьев:** число/толщина, обрамляют по краям vs «решётка» сверху; разъезд — полный
  сплит vs «дверь» в центре. Финализировать в браузере по ощущению.
- **Свет:** тёплый тон/интенсивность шафта (flat, без градиента-мерцания), длительность reveal —
  чтобы читалось как «свобода», но не слепило и не ломало контраст текста success-копи.
- **Точная копи** заголовка/кнопки (release-тон vs нейтральная) — выбрать на вёрстке.
- **Порт бэкенда:** сверить `route.ts` из archive с Next 16 (App Router route handlers), env-имена.

## 12. Вне этого среза (потом)

- Капча/rate-limit (honeypot достаточно для старта), вложения, многошаговый визард.
- SEO `sitemap`/`robots` (OG/og-image уже в проде) — отдельный мелкий срез после контакта.
- Soul ID для лица (3–5 фото).
- P3-хвосты: у About нет `<h2>`; дата на booking-табличке hero.
