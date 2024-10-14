FROM postgres:latest

# Установка необходимых пакетов для cron и bash
RUN apt-get update && apt-get install -y cron bash

# Копирование скриптов в контейнер
COPY check_db.sh /usr/local/bin/check_db.sh
COPY backup.sh /usr/local/bin/backup.sh
COPY restore.sh /usr/local/bin/restore.sh
COPY .pgpass /root/.pgpass
COPY cronjob /etc/cron.d/cronjob

# Установка прав на выполнение скриптов
RUN chmod +x /usr/local/bin/check_db.sh && \
    chmod +x /usr/local/bin/backup.sh && \
    chmod +x /usr/local/bin/restore.sh && \
    chmod 0644 /etc/cron.d/cronjob && \
    chmod 600 /root/.pgpass && \
    crontab /etc/cron.d/cronjob

# Запуск cron в фоновом режиме и PostgreSQL
CMD ["bash", "-c", "cron && docker-entrypoint.sh postgres"]
