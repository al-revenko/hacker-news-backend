# Hacker News Backend

## Описание проекта

NestJS-бэкенд для работы с Hacker News. Проект предоставляет REST API для получения историй и комментариев через Firebase Hacker News API.

## Возможности

- **Получение списков историй** — new, best (пагинация через offset/limit)
- **Получение деталей истории** — id, title, score, url, author, commentsCount
- **Комментарии с вложенностью** — рекурсивная загрузка комментариев до указанной глубины
- **Отдельные комментарии** — по ID, с опциональной подгрузкой дочерних комментариев
- **Валидация входных данных** — через class-validator декораторы
- **Источники данных** — Firebase Hacker News API

## Структура проекта

```
src/
├── main.ts                    # Точка входа, запуск на PORT (по умолч. 3000)
├── app.module.ts              # Корневой модуль, импортирует HnModule
└── hn/
    ├── hn.module.ts           # Модуль HN (controller + provider)
    ├── hn.controller.ts       # REST-контроллер (@Controller('hn'))
    ├── hn.service.ts          # Сервис: запросы к Firebase HN API
    ├── hn.const.ts            # Константы: HN_API_BASE, ItemType
    ├── dto/
    │   ├── pagination.dto.ts  # Параметры: offset, limit
    │   └── depth.dto.ts       # Параметр: depth (глубина комментариев)
    └── interfaces/
        ├── item.interface.ts  # StoryItem, CommentItem, RawItem и др.
        └── index.ts
```

## REST API — доступные эндпоинты

| Метод | Путь | Описание | Параметры |
|-------|------|----------|-----------|
| `GET` | `/hn/story/new` | Новые истории | `offset`, `limit` |
| `GET` | `/hn/story/best` | Лучшие истории | `offset`, `limit` |
| `GET` | `/hn/story/:id` | Одна история по ID | — |
| `GET` | `/hn/story/:id/comments` | Комментарии к истории | `depth` (глубина вложенности) |
| `GET` | `/hn/comment/:id` | Один комментарий по ID | `depth` |

## Как запустить

```bash
# Установка зависимостей
npm install

# Development (с автoreload)
npm run start:dev

# Production
npm run build
npm run start:prod

# Запуск на порту 3000 (по умолчанию)
# Переопределить: PORT=8080 npm run start:dev
```
