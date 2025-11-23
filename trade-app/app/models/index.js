const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD
, {
 host: dbConfig.HOST,
 dialect: dbConfig.dialect,
 port: dbConfig.port,
 operatorsAliases: false,

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
db.clients = require("./clients.js") (sequelize, Sequelize)
db.Categories = require("./Categories.js") (sequelize, Sequelize)
db.Addresses = require("./Addresses.js") (sequelize, Sequelize)
db.OrderItem = require("./OrderItems.js") (sequelize, Sequelize)
db.Orders = require("./Orders.js") (sequelize, Sequelize)
db.PaymentMethods = require("./PaymentMethods.js") (sequelize, Sequelize)
db.Products = require("./Products.js") (sequelize, Sequelize)
db.cReviews = require("./Reviews.js") (sequelize, Sequelize)
module.exports = db;