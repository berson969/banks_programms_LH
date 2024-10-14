#!/bin/bash

# Настройки базы данных
DB_NAME="table-db"
DB_USER="some_user"
DB_HOST="localhost"

# Проверка подключения к базе данных
if psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c '\q'; then
    echo "База данных '$DB_NAME' доступна."
     # Выполнение резервного копирования
    echo "Запуск резервного копирования базы данных..."
    /usr/local/bin/backup.sh
else
    echo "Ошибка: База данных '$DB_NAME' недоступна."
    exit 1
fi
