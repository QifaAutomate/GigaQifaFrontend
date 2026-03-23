# 🚀 Гайд по интеграции GigaQifa с вашим Python Бэкендом

Этот документ поможет вам связать этот фронтенд с вашей логикой на Python (FastAPI).

---

## 🛠 Шаг 1: Настройка CORS

Чтобы фронтенд мог делать запросы к вашему серверу, добавьте эти настройки в `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене замените на домен фронтенда
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Шаг 2: Обновление счетчиков (Экран Поиск Лидов)

Фронтенд ожидает данные для дашборда по адресу `GET /api/v1/leads/stats`.

**Формат ответа (JSON):**
```json
{
  "totalProcessed": 500,
  "totalInWork": 5000,
  "totalWarmLeads": 42,
  "groups": [
    { "id": "telegram", "processed": 150, "inWork": 1200, "warmLeads": 15 },
    { "id": "vk", "processed": 200, "inWork": 2500, "warmLeads": 20 },
    { "id": "max", "processed": 150, "inWork": 1300, "warmLeads": 7 }
  ]
}
```

**Пример на Python:**
```python
@app.get("/api/v1/leads/stats")
async def get_lead_stats():
    # Здесь вы делаете запрос к вашей БД (PostgreSQL/Redis)
    return {
        "totalProcessed": 500,
        "totalInWork": 5000,
        "totalWarmLeads": 42,
        "groups": [
            {"id": "telegram", "processed": 0, "inWork": 0, "warmLeads": 0},
            {"id": "vk", "processed": 0, "inWork": 0, "warmLeads": 0},
            {"id": "max", "processed": 0, "inWork": 0, "warmLeads": 0}
        ]
    }
```

---

## 💬 Шаг 3: Чат и Файлы

Когда пользователь отправляет сообщение, вызывается `POST /orchestrator/process`.

**Запрос:**
```json
{
  "query": "Текст сообщения",
  "contextFiles": ["uuid-файла-123"]
}
```

**Ответ:**
```json
{
  "answer": "Ваш ответ пользователю",
  "confidence": 0.95,
  "sources": ["название_документа.pdf"]
}
```

---

## 📂 Шаг 4: Загрузка файлов (Скрепка)

Когда нажимают на скрепку, файл летит в `POST /api/v1/files/upload`.

```python
@app.post("/api/v1/files/upload")
async def upload_file(file: UploadFile = File(...)):
    # Сохраните файл и верните его ID
    return {"fileId": "some-uuid"}
```

---

## ⚡️ Советы по интеграции:

1. **База данных**: Используйте Redis для мгновенного обновления счетчиков или PostgreSQL для аналитики.
2. **Асинхронность**: Используйте `async def`, чтобы не блокировать сервер при тяжелых расчетах ИИ.
3. **Логирование**: Настройте логирование запросов, чтобы видеть, какие файлы приходят для контекста.
