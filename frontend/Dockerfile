# Используем Node.js как базовый образ
FROM node:latest AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем остальные файлы приложения
COPY .. .

# Собираем приложение Vite
RUN npm run build

# Используем Nginx как базовый образ для сервинга приложения
FROM nginx:alpine
#RUN ls -la /usr/share/nginx/html
# Копируем скомпилированные файлы из предыдущего этапа в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
