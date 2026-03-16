
# Интеграция GigaQifa с Python VPS Бэкендом

Данное приложение развернуто на VPS и взаимодействует с мультиагентной системой через API.

## 1. Конфигурация окружения
Для работы фронтенда на VPS создайте файл `.env.local` в корне проекта:
`NEXT_PUBLIC_API_URL=http://<IP_ВАШЕГО_VPS>:8000/api/v1`

## 2. Запуск на VPS (Production)
1. Установите зависимости: `npm install`
2. Соберите проект: `npm run build`
3. Запустите через PM2 или напрямую: `npm start`

## 3. Структура агентов (Python)
Фронтенд ожидает три ключевых модуля, доступных через единый Оркестратор:
- **`consultant`**: Формирование ответов.
- **`parser`**: Извлечение данных из PDF/Excel.
- **`validator`**: Валидация результатов.

Пример эндпоинта статуса в FastAPI:
```python
@app.get("/api/v1/orchestrator/status")
async def get_status():
    return [
        {"id": "consultant", "name": "Консультант", "status": "online", "lastActive": "now"},
        {"id": "parser", "name": "Парсер", "status": "idle", "lastActive": "10m ago"},
        {"id": "validator", "name": "Эксперт по валидации", "status": "online", "lastActive": "now"},
    ]
```
