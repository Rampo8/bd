const db = require("../models");
// Инициализируем модель Hotel из объекта базы данных
const Hotel = db.Hotel;
const Op = db.Sequelize.Op;

// 1. Создание и сохранение нового отеля (Create)
exports.create = (req, res) => {
    // 1.1. Валидация входных данных. Используем поля Name, Address, Stars.
    // Проверяем, что Name и Address - не пустые строки, а Stars - определено.
    if (!req.body.Name || !req.body.Address || typeof req.body.Stars === 'undefined' || req.body.Stars === null) {
        res.status(400).send({
            message: "Content cannot be empty! Name, Address, and Stars are required."
        });
        return;
    }
    
    // 1.2. Создание объекта отеля
    const hotel = {
        // Имена полей в JSON должны совпадать с именами в модели (с большой буквы)
        Name: req.body.Name,
        Address: req.body.Address,
        Stars: req.body.Stars
        // ID_Hotel будет сгенерирован автоматически (autoIncrement)
    };
    
    // 1.3. Сохранение отеля в БД
    Hotel.create(hotel)
        .then(data => {
            // Возвращаем клиенту созданный объект
            res.status(201).send(data);
        })
        .catch(err => {
            // Обработка ошибок БД или сервера
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Hotel."
            });
        });
};

// 2. Получение всех отелей из базы данных (ReadAll)
exports.findAll = (req, res) => {
    // Получение всех записей (без фильтрации)
    Hotel.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hotels."
            });
        });
};

// 3. Получение одного отеля по ID (ReadOne)
exports.findOne = (req, res) => {
    const id = req.params.id; // ID берется из URL-параметра

    Hotel.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Hotel with ID=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Hotel with ID=" + id
            });
        });
};

// 4. Обновление отеля по ID (Update)
exports.update = (req, res) => {
    const id = req.params.id; // ID берется из URL-параметра

    Hotel.update(req.body, {
        where: { ID_Hotel: id } // Ищем по первичному ключу
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Hotel was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Hotel with ID=${id}. Maybe Hotel was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Hotel with ID=" + id
        });
    });
};

// 5. Удаление отеля по ID (DeleteOne)
exports.delete = (req, res) => {
    const id = req.params.id;

    Hotel.destroy({
        where: { ID_Hotel: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Hotel was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Hotel with ID=${id}. Maybe Hotel was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Hotel with ID=" + id
        });
    });
};

// 6. Удаление всех отелей (DeleteAll)
exports.deleteAll = (req, res) => {
    Hotel.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Hotels were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all hotels."
        });
    });
};