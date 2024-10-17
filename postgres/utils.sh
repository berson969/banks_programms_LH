#!/bin/bash

# Настройки базы данных
DB_NAME="table-db"
DB_USER="some_user"
DB_HOST="postgres"

LOG_DIR="/var/log"
BACKUP_LOG="$LOG_DIR/backup.log"

# Функция для записи в лог с меткой времени
log_message() {
    local log_file=$1
    local message=$2
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $message" >> "$log_file"
}

# Проверка подключения к базе данных
check_db_connection() {
    if psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c '\q'; then
        log_message "$BACKUP_LOG" "База данных '$DB_NAME' доступна."
    else
        log_message "$BACKUP_LOG" "Ошибка: База данных '$DB_NAME' недоступна."
        exit 1
    fi
}

# Проверка и создание директории для логов
check_log_directory() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        echo "Директория '$LOG_DIR' создана."
    else
        echo "Директория '$LOG_DIR' уже существует."
    fi
}
