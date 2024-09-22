# Используем Node.js как базовый образ
FROM node:14

RUN apt-get update && apt-get install -y build-essential
# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Устанавливаем nodemon для разработки
RUN npm install -g nodemon

# Открываем порт 3000 для сервера
EXPOSE 3000

# Запускаем сервер с помощью nodemon
CMD ["nodemon", "-L", "postgres_server.js"]
