module.exports = app => {
    const controller = require("../controllers/Addreses.controller.js");
    const router = require("express").Router();

    // Создание нового бронирования
    router.post("/", controller.create);
    // Получение всех бронирований
    router.get("/", controller.findAll);
    // Получение бронирования по ID
    router.get("/:id", controller.findOne);
    // Обновление бронирования по ID
    router.put("/:id", controller.update);
    // Удаление бронирования по ID
    router.delete("/:id", controller.delete);
    // Удаление всех бронирований
    router.delete("/", controller.deleteAll);

    app.use("/api/Addresses", router);
};