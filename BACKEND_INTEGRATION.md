# 🚀 Гайд по интеграции GigaQifa с вашим Python Бэкендом

Этот документ поможет вам (или вашему бэкенд-разработчику) связать этот фронтенд с логикой на Python. Мы используем **FastAPI**, так как это стандарт для современных ИИ-приложений, но логика применима к любому фреймворку.

---

## 🛠 Шаг 1: Настройка окружения (Frontend)

Фронтенд должен знать, куда отправлять запросы. 
Создайте файл `.env.local` в корне проекта (если его еще нет):

```bash
NEXT_PUBLIC_API_URL=http://<IP_ВАШЕГО_VPS>:8000/api/v1
```

---

## 🐍 Шаг 2: Базовый Python сервер (FastAPI)

Чтобы фронтенд не блокировал запросы, на бэкенде **обязательно** должен быть настроен CORS.

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# КРИТИЧЕСКОЕ: Разрешаем фронтенду общаться с бэкендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене замените на домен фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/orchestrator/status")
async def get_status():
    # Фронтенд ожидает список статусов агентов
    return [
        {"id": "consultant", "name": "Консультант", "status": "online", "lastActive": "Сейчас"},
        {"id": "parser", "name": "Парсер", "status": "searching", "lastActive": "Сейчас"},
        {"id": "validator", "name": "Валидатор", "status": "idle", "lastActive": "5 мин назад"},
    ]
```

---

## 💬 Шаг 3: Обработка сообщений чата

Когда пользователь пишет сообщение, фронтенд вызывает `POST /orchestrator/process`.

**Ожидаемый формат запроса (JSON):**
```json
{
  "query": "Проанализируй этот отчет",
  "contextFiles": ["uuid-файла-123"]
}
```

**Пример реализации на Python:**
```python
class MessageRequest(BaseModel):
    query: str
    contextFiles: Optional[List[str]] = []

@app.post("/api/v1/orchestrator/process")
async def process_query(request: MessageRequest):
    # Здесь ваша магия нейросетей
    return {
        "answer": f"Вы спросили: {request.query}. Я проанализировал {len(request.contextFiles)} файлов.",
        "confidence": 0.98,
        "sources": ["Отчет_Q4.pdf"]
    }
```

---

## 📂 Шаг 4: Загрузка файлов (Скрепка)

Когда пользователь нажимает на скрепку и выбирает файл, он отправляется как `multipart/form-data`.

```python
@app.post("/api/v1/files/upload")
async def upload_file(file: UploadFile = File(...)):
    # Сохраняем файл и возвращаем его ID
    file_id = "some-unique-id" 
    return {"fileId": file_id}
```

---

## 📊 Шаг 5: Поиск Лидов (Метрики)

Для экрана «Поиск Лидов» вам нужно отдавать статистику. Фронтенд сейчас берет тестовые данные из компонента, но вы можете изменить `LeadSearchView.tsx`, чтобы он делал запрос к вашему API.

---

## 🚀 Деплой на VPS

1. **Сборка фронтенда**:
   ```bash
   npm run build
   ```
   *Это создаст папку `.next/standalone`, которую удобно запускать через PM2.*

2. **Запуск бэкенда**:
   Используйте `uvicorn`:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## ❓ Если "Repository not found" при пуше на GitHub:
1. Зайдите в браузер на свой GitHub.
2. Нажмите **New Repository**.
3. Назовите его `gigaqifa`.
4. В консоли выполните:
   ```bash
   git remote add origin https://github.com/ВАШ_ЛОГИН/gigaqifa.git
   git push -u origin main
   ```
