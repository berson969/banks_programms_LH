#!/bin/bash

# Запуск восстановления базы данных из контейнера
docker exec -it backup /usr/local/bin/restore.sh
