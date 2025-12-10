const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    underscored: true, // Для snake_case в именах полей (как в PDF п.1.1)
    freezeTableName: true
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Модели
db.client = require("./clients.js")(sequelize, Sequelize);
db.category = require("./Categories.js")(sequelize, Sequelize);
db.address = require("./Addresses.js")(sequelize, Sequelize);
db.orderItem = require("./OrderItems.js")(sequelize, Sequelize);
db.order = require("./Orders.js")(sequelize, Sequelize);
db.paymentMethod = require("./PaymentMethods.js")(sequelize, Sequelize);
db.product = require("./Products.js")(sequelize, Sequelize);
db.review = require("./Reviews.js")(sequelize, Sequelize);

// Ассоциации
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;