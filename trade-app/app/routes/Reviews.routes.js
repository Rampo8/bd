module.exports = app => {
  const controller = require("../controllers/Review.controller.js");
  const router = require("express").Router();
  // Создание нового отзыва
  router.post("/", controller.create);
  // Получение всех отзывов
  router.get("/", controller.findAll);
  // Получение отзыва по ID
  router.get("/:id", controller.findOne);
  // Обновление отзыва по ID
  router.put("/:id", controller.update);
  // Удаление отзыва по ID
  router.delete("/:id", controller.delete);
  // Удаление всех отзывов
  router.delete("/", controller.deleteAll);
  app.use("/api/reviews", router); // Standardized to plural
};