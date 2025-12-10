const express = require('express');
const app = express();
const db = require('./app/models');

// Синхронизация БД (если нужно)
db.sequelize.sync()
  .then(() => console.log('БД синхронизирована'))
  .catch(err => console.error('Ошибка синхронизации БД:', err));

// Middleware (должны быть здесь, а не в маршрутах!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем маршруты
app.use('/api/clients', require('./app/routes/clients.routes')); // ← ключевое исправление

// Обработка 404
app.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err.stack);
  res.status(500).send({ message: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});