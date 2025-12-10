module.exports = app => {
    const controller = require("../controllers/Order.controller.js");
    const router = require("express").Router();

    // Создание нового отеля
    router.post("/", controller.create);
    // Получение всех отелей
    router.get("/", controller.findAll);
    // Получение отеля по ID
    router.get("/:id", controller.findOne);
    // Обновление отеля по ID
    router.put("/:id", controller.update);
    // Удаление отеля по ID
    router.delete("/:id", controller.delete);
    // Удаление всех отелей
    router.delete("/", controller.deleteAll);

    app.use("/api/Oreders", router);
};