# Используем Nginx как базовый образ для сервинга приложения
FROM nginx:alpine
# RUN ls -la

COPY .. .

# Копируем скомпилированные файлы из предыдущего этапа в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY ../frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
