module.exports = app => {
    const controller = require("../controllers/Review.controller.js");
    const router = require("express").Router();

    // Создание нового пользователя
    router.post("/", controller.create);
    // Получение всех пользователей
    router.get("/", controller.findAll);
    // Получение пользователя по ID
    router.get("/:id", controller.findOne);
    // Обновление пользователя по ID
    router.put("/:id", controller.update);
    // Удаление пользователя по ID
    router.delete("/:id", controller.delete);
    // Удаление всех пользователей
    router.delete("/", controller.deleteAll);

    app.use("/api/Review", router);
};