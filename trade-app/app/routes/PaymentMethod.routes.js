module.exports = app => {
    const controller = require("../controllers/PaymentMethod.controller.js");
    const router = require("express").Router();

    // Создание нового платежа
    router.post("/", controller.create);
    // Получение всех платежей
    router.get("/", controller.findAll);
    // Получение платежа по ID
    router.get("/:id", controller.findOne);
    // Обновление платежа по ID
    router.put("/:id", controller.update);
    // Удаление платежа по ID
    router.delete("/:id", controller.delete);
    // Удаление всех платежей
    router.delete("/", controller.deleteAll);

    app.use("/api/PaymentMethod", router);
};