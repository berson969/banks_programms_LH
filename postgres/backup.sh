#!/bin/bash

source /usr/local/bin/utils.sh
check_log_directory

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="/backups/postgres_backup_$DATE.sql.gz"

# Выполнение резервного копирования
if pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    log_message "$BACKUP_LOG" "Резервное копирование выполнено успешно: $BACKUP_FILE"
else
    log_message "$BACKUP_LOG" "Ошибка при выполнении резервного копирования."
    exit 1
fi
