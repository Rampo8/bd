const express = require('express');
const app = express();
const db = require('./app/models');

// Синхронизация БД (для пересоздания таблиц с snake_case, временно используйте { force: true }, затем удалите)
db.sequelize.sync({ force: true }) // Временно для принудительного пересоздания (удалите после)
  .then(() => console.log('БД синхронизирована'))
  .catch(err => console.error('Ошибка синхронизации БД:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем маршруты
require('./app/routes/clients.routes')(app);
require('./app/routes/Addresses.routes')(app);
require('./app/routes/Categories.routes')(app);
require('./app/routes/Product.routes')(app);
require('./app/routes/Order.routes')(app);
require('./app/routes/OrderItem.routes')(app);
require('./app/routes/Reviews.routes')(app);

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