require('dotenv').config(); // ←←← ЭТО ОБЯЗАТЕЛЬНО В САМОМ НАЧАЛЕ!

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./app/models');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Синхронизация БД
db.sequelize.sync()
  .then(() => console.log('БД синхронизирована'))
  .catch(err => console.error('Ошибка синхронизации БД:', err));

// Middleware
app.use(cors({ origin: '*' }));
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

// Конфигурация Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trade API',
      version: '1.0.0',
      description: 'API documentation for Trade App',
    },
    servers: [
      {
        url: `http://localhost:${process.env.NODE_DOCKER_PORT || 8080}`,
      },
    ],
  },
  apis: ['./app/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});