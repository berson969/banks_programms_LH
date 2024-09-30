FROM alpine:latest

RUN apk add --no-cache bash curl postgresql-client

# Создание директории для резервных копий
RUN mkdir -p /backups

COPY backup.sh /usr/local/bin/backup.sh
COPY restore.sh /usr/local/bin/restore.sh
COPY .pgpass /root/
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh
RUN chmod 600  /root/.pgpass


# Установка cron и добавление задания для резервного копирования каждые 6 часов
RUN apk add --no-cache openrc && \
    echo "0 */6 * * * /usr/local/bin/backup.sh" >> /etc/crontabs/root

CMD ["/bin/sh", "-c", "/usr/local/bin/backup.sh && crond -f"]
