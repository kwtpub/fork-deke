# Анализ целостности форка docke.ru

Дата: 2026-04-12

## ✅ Что уже реализовано

### Фронтенд (`frontend/src`)
- **Страницы:** home, catalog (список + по категории), product (карточка), news (список + детально), calculator (кровля), search, cart, contacts, docs, about, admin (полная админка).
- **Features:** contact-form, product-filter, search, calculator-form, cart (Redux), order-modal, color-selector, request-callback.
- **Entities:** product, category, news, document, banner.
- **Widgets:** header, footer, hero-banner, catalog-menu, product-grid, product-detail, news-section, search-bar, promo-section.

### Бэкенд (`backend/src`, NestJS)
- Модули: auth, products, categories, orders, news, documents, banners, calculator, search, upload (S3).
- `users/` — структура есть, но пустая.
- Инфраструктура: TypeORM, Redis (кеш), S3 (файлы), JWT.

---

## ❌ Чего не хватает для целостности

### Критично (есть на docke.ru)
- **Где купить / Дилеры** — карта дилеров, поиск по регионам. Модуля нет вообще.
- **Галерея проектов / Портфолио** — примеры реализованных объектов.
- **FAQ** — раздел частых вопросов.
- **Email-уведомления** — Mailer-сервис для подтверждения заявок/обратной связи.
- **Личный кабинет клиента** — регистрация клиентов, история заказов (`users/` пуст).

### Важно для полноценного e-commerce
- **Checkout + оплата** (YooKassa / СберPay) — сейчас только лид-форма через `features/order-modal`.
- **Отзывы и рейтинги** товаров.
- **Сравнение товаров** (specs-таблица).
- **Экспорт спецификации** в PDF/Excel для смет.
- **SMS-уведомления** по заявкам.

### SEO / маркетинг
- **Yandex.Metrica / GA4** — не подключены.
- **Sitemap.xml, robots.txt, SSR / мета-теги** — критично для SPA на Vite без SSR.
- **Видео-инструкции монтажа** — отдельный раздел на docke.ru.

---

## Приоритет внедрения

1. **Mailer + SEO** (sitemap, метрика) — быстро и критично.
2. **Дилеры с картой** — ключевая фича производителя стройматериалов.
3. **Портфолио проектов + FAQ** — контентные разделы.
4. **Checkout с оплатой + ЛК клиента** — если цель e-commerce, а не лид-ген.
