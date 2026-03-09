# Интеграция с Python-бэкендом (FastAPI)

Этот фронтенд разработан с учетом легкой интеграции с бэкендом на Python. Мы рекомендуем использовать **FastAPI**, так как он автоматически генерирует Swagger (OpenAPI) и идеально подходит для работы с LLM и асинхронными задачами.

## 1. Рекомендуемый стек на Python
- **Framework**: `FastAPI`
- **Data Models**: `Pydantic` (типы в `src/services/types.ts` уже соответствуют структуре Pydantic)
- **CORS**: Обязательно разрешите запросы с фронтенда:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
  ```

## 2. Интеграция через Swagger (OpenAPI)
FastAPI по умолчанию создает документацию по адресу `/docs`. 

Для автоматической генерации TypeScript клиентов из вашего Python-кода используйте:
`npx openapi-typescript http://127.0.0.1:8000/openapi.json -o src/services/schema.d.ts`

## 3. Динамические статусы агентов
Фронтенд ожидает, что каждый агент может находиться в одном из следующих состояний:
- `online`: В сети, готов к работе.
- `idle`: Ожидание (режим сна).
- `thinking`: Агент обрабатывает запрос (LLM генерирует текст).
- `searching`: Агент ищет информацию в базе данных или интернете.
- `validating`: Агент проверяет корректность полученных данных.

## 4. Пример эндпоинта на FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class AgentStatus(BaseModel):
    id: str
    name: str
    status: str # 'thinking', 'searching', 'online', etc.
    lastActive: str

@app.get("/api/v1/agents/status", response_model=List[AgentStatus])
async def get_status():
    return [
        {"id": "1", "name": "Консультант", "status": "thinking", "lastActive": "2023-10-27T10:00:00"},
        {"id": "2", "name": "Сборщик данных", "status": "searching", "lastActive": "2023-10-27T10:01:00"}
    ]
```

## 5. Настройка переменных окружения
Создайте файл `.env` в корне проекта и укажите адрес вашего Python-сервера:
`NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
