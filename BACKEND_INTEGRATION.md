# Интеграция с Python-бэкендом (Multi-Agent Architecture)

Этот фронтенд спроектирован для работы с **мультиагентной системой**. Мы рекомендуем использовать **FastAPI** в качестве "Оркестратора", который связывает независимые модули агентов.

## 1. Структура агентов (Модули)
В приложении выделены 3 независимых роли:
- **`consultant`**: Основной интерфейс взаимодействия, формирование ответов.
- **`parser`**: Извлечение данных из загруженных файлов (PDF, Excel, CSV).
- **`validator`**: Проверка ответов на логические ошибки и соответствие фактам.

## 2. Архитектура Оркестратора на FastAPI
Мы рекомендуем создать единую точку входа (Gateway), которая будет проксировать запросы к конкретным Python-скриптам или микросервисам агентов.

```python
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Модель статуса агента
class AgentStatus(BaseModel):
    id: str # 'consultant', 'parser', 'validator'
    name: str
    status: str # 'online', 'thinking', 'searching', 'offline'
    lastActive: str

@app.get("/api/v1/orchestrator/status", response_model=List[AgentStatus])
async def get_total_status():
    # Здесь вы можете опрашивать свои независимые модули
    return [
        {"id": "consultant", "name": "Консультант", "status": "online", "lastActive": "now"},
        {"id": "parser", "name": "Парсер", "status": "idle", "lastActive": "10m ago"},
        {"id": "validator", "name": "Эксперт по валидации", "status": "offline", "lastActive": ""},
    ]

@app.post("/api/v1/orchestrator/process")
async def process_task(query: str, context_files: List[str] = []):
    # Логика: 
    # 1. Вызвать Parser для файлов
    # 2. Вызвать Consultant для генерации
    # 3. Вызвать Validator для проверки
    return {"answer": "Результат работы сети агентов...", "confidence": 0.98, "sources": []}
```

## 3. Swagger & Генерация Кода
FastAPI автоматически генерирует OpenAPI схему. Чтобы ваш фронтенд всегда соответствовал бэкенду:
1. Запустите Python сервер (`uvicorn main:app`).
2. В терминале фронтенда выполните:
   `npx openapi-typescript http://localhost:8000/openapi.json -o src/services/schema.d.ts`

## 4. Переменные окружения
Не забудьте обновить `.env`:
`NEXT_PUBLIC_API_URL=http://your-python-backend:8000/api/v1`

## 5. Статус "Не в сети"
Если ваше API недоступно или возвращает ошибку, фронтенд автоматически покажет статус **"Не в сети"** (Offline). Это состояние по умолчанию для всех новых модулей до момента их успешного подключения.
