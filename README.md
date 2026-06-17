# Hacker News Backend

## Описание проекта

NestJS-бэкенд для работы с Hacker News. Проект предоставляет REST API для получения историй и комментариев через Firebase Hacker News API.

## Возможности

- **Получение списков историй** — new, best (пагинация через offset/limit)
- **Получение деталей истории** — id, title, score, url, author, commentsCount, commentsId
- **Массовое получение комментариев** — по массиву ID (POST)
- **Валидация входных данных** — через class-validator декораторы
- **Кэширование** — двухуровневое кэширование (memory + Redis) 
- **Источники данных** — Firebase Hacker News API

## Структура проекта

```
src/
├── main.ts                          # Точка входа, запуск на PORT (по умолч. 4000)
├── app.module.ts                    # Корневой модуль, импортирует HnModule + CacheModule
├── common/
│   └── interceptors/
│       └── logging.interceptor.ts   # HTTP logging interceptor
└── modules/
    ├── cache/
    │   ├── cache.module.ts          # Глобальный CacheModule с Keyv (memory + Redis)
    │   ├── cache.service.ts         # Сервис кэширования
    │   ├── cache.decorator.ts       # Кастомный @Cache декоратор
    │   └── index.ts
    └── hn/
        ├── hn.module.ts             # Модуль HN (controller + providers)
        ├── hn.controller.ts         # REST-контроллер (@Controller('hn'))
        ├── story.service.ts         # Сервис для историй
        ├── comment.service.ts       # Сервис для комментариев
        ├── hn.utils.ts              # Утилиты: fetchFromHn, fetchItemFromHn, type guards
        ├── hn.const.ts              # Константы: HN_API_BASE, ItemType
        ├── dto/
        │   ├── pagination.dto.ts    # Параметры: offset, limit
        │   ├── comments.dto.ts      # Тело запроса для /hn/comments
        │   └── index.ts
        └── types/
            ├── item.type.ts         # StoryItem, CommentItem, RawItem и др.
            └── index.ts
```

## REST API — доступные эндпоинты

| Метод | Путь | Описание | Параметры |
|-------|------|----------|-----------|
| `GET` | `/hn/story/new` | Новые истории | Query: `offset`, `limit` |
| `GET` | `/hn/story/best` | Лучшие истории | Query: `offset`, `limit` |
| `GET` | `/hn/story/:id` | Одна история по ID | — |
| `POST` | `/hn/comments` | Получить комментарии по id | Body: `{ "ids": [1, 2, 3] }` |

## Переменные окружения

| Переменная | Описание | По умолчанию |
|-----------|----------|-------------|
| `PORT` | Порт сервера | `4000` |
| `REDIS_URL` | URL Redis-сервера | — (опционально) |

## Как запустить

```bash
# Установка зависимостей
npm install

# Development 
npm run dev

# Production
npm run build
npm run prod

# localhost:4000 (по умолчанию)
```

## Запуск в Docker

```bash
docker build -t hacker-news-backend .

docker run -d --name hacker-news-backend -e REDIS_URL=redis://host.docker.internal:6379  -p 4000:4000 hacker-news-backend
```

## Кэширование

Проект использует двухуровневое кэширование:

1. **Memory cache** (KeyvCacheableMemory) — всегда активен
2. **Redis cache** — активен при наличии `REDIS_URL` в `.env`
