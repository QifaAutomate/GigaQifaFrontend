
# Интеграция GigaQifa с Python VPS Бэкендом

Данное приложение развернуто на VPS и взаимодействует с мультиагентной системой через API.

## 1. Конфигурация окружения
Для работы фронтенда на VPS создайте файл `.env.local` в корне проекта:
`NEXT_PUBLIC_API_URL=http://<IP_ВАШЕГО_VPS>:8000/api/v1`

## 2. Запуск на VPS (Production)
1. Установите зависимости: `npm install`
2. Соберите проект: `npm run build`
3. Запустите через PM2 или напрямую: `node .next/standalone/server.js`

## 3. Исправление ошибки "Repository not found"
Если при `git push` вы видите ошибку:
1. Зайдите на github.com и создайте НОВЫЙ репозиторий с именем `gigaqifa`.
2. В терминале выполните:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/ВАШ_ЛОГИН/gigaqifa.git
   git branch -M main
   git push -u origin main
   ```

## 4. Структура агентов (Python)
Фронтенд ожидает три ключевых модуля, доступных через единый Оркестратор:
- **`consultant`**: Формирование ответов.
- **`parser`**: Извлечение данных из PDF/Excel.
- **`validator`**: Валидация результатов.
