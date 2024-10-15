#!/bin/bash
DB_NAME="table-db"
DB_USER="some_user"
DB_HOST="localhost" //!!! for docker postgres
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="/backups/postgres_backup_$DATE.sql.gz"
LOG_DIR="/var/log"

if [ ! -d "$LOG_DIR" ]; then
    mkdir -p "$LOG_DIR"
    echo "Директория '$LOG_DIR' создана."
else
    echo "Директория '$LOG_DIR' уже существует."
fi

# Функция для записи в лог с меткой времени
log_message() {
    local log_file=$1
    local message=$2
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $message" >> "$log_file"
}

# Проверка и создание файлов логов
CHECK_DB_LOG="$LOG_DIR/check_db.log"
BACKUP_LOG="$LOG_DIR/backup.log"

if [ ! -f "$CHECK_DB_LOG" ]; then
    touch "$CHECK_DB_LOG"
    log_message "$CHECK_DB_LOG"  "Файл лога '$CHECK_DB_LOG' создан."
else
    log_message "$CHECK_DB_LOG" "Файл лога '$CHECK_DB_LOG' уже существует."
fi

if [ ! -f "$BACKUP_LOG" ]; then
    touch "$BACKUP_LOG"
    log_message "$BACKUP_LOG"  "Файл лога '$BACKUP_LOG' создан."
else
    log_message "$BACKUP_LOG" "Файл лога '$BACKUP_LOG' уже существует."
fi

# Выполнение резервного копирования
if pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    log_message "$BACKUP_LOG" "Резервное копирование выполнено успешно: $BACKUP_FILE"
else
    log_message "$BACKUP_LOG" "Ошибка при выполнении резервного копирования."
    exit 1
fi
