#!/bin/bash
DB_NAME="table-db"
DB_USER="some_user"
DB_HOST="localhost"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="/backups/postgres_backup_$DATE.sql.gz"

# Выполнение резервного копирования
if pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    echo "Резервное копирование выполнено успешно: $BACKUP_FILE"
else
    echo "Ошибка при выполнении резервного копирования."
    exit 1
fi
