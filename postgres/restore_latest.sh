#!/bin/bash

# Запуск восстановления базы данных из контейнера
docker exec -it postgres /usr/local/bin/restore.sh
