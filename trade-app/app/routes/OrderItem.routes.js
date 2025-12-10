module.exports = app => {
  const controller = require("../controllers/OrderItem.controller.js");
  const router = require("express").Router();
  // Создание нового элемента заказа
  router.post("/", controller.create);
  // Получение всех элементов заказов
  router.get("/", controller.findAll);
  // Получение элемента заказа по ID
  router.get("/:id", controller.findOne);
  // Обновление элемента заказа по ID
  router.put("/:id", controller.update);
  // Удаление элемента заказа по ID
  router.delete("/:id", controller.delete);
  // Удаление всех элементов заказов
  router.delete("/", controller.deleteAll);
  app.use("/api/orderItems", router); // Fixed typo, standardized
};