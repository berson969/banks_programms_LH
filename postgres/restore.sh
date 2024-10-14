#!/bin/bash

# Настройки базы данных
DB_NAME="table-db"              # Имя базы данных
DB_USER="some_user"             # Имя пользователя
DB_HOST="postgres"               # Хост базы данных
BACKUP_DIR="/backups"           # Директория с резервными копиями

# Поиск самого нового файла резервной копии
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -n 1)

# Проверка наличия файла резервной копии
if [ -z "$LATEST_BACKUP" ]; then
    echo "Файл резервной копии не найден в директории: $BACKUP_DIR"
    exit 1
fi

echo "Удаление существующей базы данных '$DB_NAME'..."
# Удаление базы данных
psql -U  "$DB_USER" -h "$DB_HOST" -d postgres -W -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"

echo "Создание новой базы данных '$DB_NAME'..."
# Создание новой базы данных
psql -U "$DB_USER" -h "$DB_HOST" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

echo "Восстановление базы данных '$DB_NAME' из '$LATEST_BACKUP'..."

# Восстановление базы данных
gunzip -c "$LATEST_BACKUP" | psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME"

if [ $? -eq 0 ]; then
    echo "Восстановление завершено успешно."
else
    echo "Ошибка при восстановлении базы данных."
    exit 1
fi
