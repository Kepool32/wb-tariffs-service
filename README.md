# NestJS Tariffs Service

## Описание

Это проект на базе **NestJS**, который взаимодействует с различными API, включая **Google API** и **Wildberries API**. Мы используем **Docker** для контейнеризации приложения и удобства развертывания. Также реализована интеграция с **cron** для регулярного обновления тарифов.

## Стек технологий

- **NestJS** — фреймворк для создания серверных приложений.
- **Docker** — контейнеризация для удобного развертывания и работы с приложением.
- **PostgreSQL** — база данных для хранения данных.
- **Google API** — интеграция с Google для работы с таблицами Google Sheets и другими сервисами.
- **Wildberries API** — работа с тарифами и другими данными через API Wildberries.
- **Cron** — для регулярного обновления тарифов.

## Описание функционала

- **Обновление тарифов** через интеграцию с Wildberries API.
- Регулярное обновление тарифов с использованием cron.
- Возможность вручную инициировать обновление тарифов через API(http://localhost:3000/tariffs/update).

## Установка и запуск проекта

### 1. Клонируйте репозиторий

Сначала клонируйте репозиторий на ваш локальный компьютер:

bash
git clone <URL>
cd <папка с проектом>

### 2. Установите зависимости

npm install

### 3. Настройка Docker

sudo docker-compose up --build

### 4. Настройка переменных окружения

DB_HOST — Адрес хоста для базы данных PostgreSQL.
DB_USER — Имя пользователя для подключения к базе данных PostgreSQL.
DB_PASSWORD — Пароль для подключения к базе данных PostgreSQL.
DB_NAME — Имя базы данных для использования с PostgreSQL.
Google API:
GOOGLE_CLIENT_EMAIL — Адрес электронной почты клиента для Google API (обычно это сервисный аккаунт).
GOOGLE_PRIVATE_KEY — Приватный ключ для аутентификации сервисного аккаунта с Google API.
GOOGLE_SHEETS_SCOPE — Область доступа для работы с Google Sheets API.
GOOGLE_SHEET_IDS — ID Google Sheets, к которым осуществляется доступ через Google API.
Wildberries API:
WB_API_URL — URL для доступа к API Wildberries для получения тарифов.
WB_API_KEY — Ключ API для аутентификации при запросах к Wildberries API.

### 5. Таблица доступна по ссылке 

https://docs.google.com/spreadsheets/d/1NLc7zd1dpj1bIa8soySCnIXJDJZNIDi1qDkk-EjU_pw/edit?gid=1205565465#gid=1205565465
