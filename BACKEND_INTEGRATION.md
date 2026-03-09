# Интеграция с бэкендом (AgentConnect Console)

Данный проект использует модульную архитектуру для связи с внешними API. Все коннекторы расположены в папке `src/services`.

## 1. Структура слоев
- `api-client.ts`: Базовая обертка над `fetch`. Обрабатывает базовый URL, заголовки и типизацию ответов.
- `agent-service.ts`: Доменная логика. Содержит методы для работы с конкретными эндпоинтами.
- `types.ts`: TypeScript интерфейсы, описывающие структуру данных бэкенда.

## 2. Использование Swagger (OpenAPI)
Для автоматизации процесса рекомендуется генерировать типы и методы API прямо из Swagger-спецификации вашего бэкенда.

### Рекомендуемый инструмент: `openapi-typescript`
1. Установите библиотеку: `npm install -D openapi-typescript`
2. Добавьте скрипт в `package.json`:
   ```json
   "generate-api": "npx openapi-typescript https://api.example.com/swagger.json -o src/services/schema.d.ts"
   ```
3. После запуска команды вы получите файл `schema.d.ts` со всеми типами вашего API.

### Рекомендуемый инструмент: `swagger-typescript-api`
Если вы хотите генерировать не только типы, но и готовые классы запросов:
`npx swagger-typescript-api -p https://api.example.com/swagger.json -o src/services -n my-api.ts`

## 3. Методология разработки
- **Environment Variables**: Всегда используйте `process.env.NEXT_PUBLIC_API_URL` для смены адреса сервера (dev/prod).
- **Error Handling**: `api-client.ts` возвращает объект `{ data, error, status }`. Всегда проверяйте наличие `error` перед использованием данных.
- **DTO (Data Transfer Objects)**: Если формат данных бэкенда сильно отличается от того, что нужно UI, создавайте функции-мапперы в папке `src/services/mappers`.

## 4. Пример подключения в компоненте
```tsx
import { AgentService } from '@/services/agent-service';

// Внутри useEffect или функции:
const { data, error } = await AgentService.getAgentsStatus();
if (data) {
  setStatuses(data);
}
```
