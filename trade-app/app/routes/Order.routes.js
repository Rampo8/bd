module.exports = app => {
  const controller = require("../controllers/Order.controller.js");
  const router = require("express").Router();
  
  // Создание нового заказа
  router.post("/", controller.create);
  // Получение всех заказов
  router.get("/", controller.findAll);
  // Получение заказа по ID
  router.get("/:id", controller.findOne);
  // Обновление заказа по ID
  router.put("/:id", controller.update);
  // Удаление заказа по ID
  router.delete("/:id", controller.delete);
  // Удаление всех заказов
  router.delete("/", controller.deleteAll);
  app.use("/api/orders", router);
};