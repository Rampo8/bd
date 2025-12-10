const db = require("../models");
const Payment = db.payment;
const Op = db.Sequelize.Op;

// Создание и сохранение нового Платежа
exports.create = (req, res) => {
    // ВАЖНО: Проверьте тело запроса (req.body)
    if (!req.body.ID_Booking || !req.body.Amount) {
        res.status(400).send({
            message: "Content cannot be empty! ID_Booking and Amount are required."
        });
        return;
    }

    const payment = {
        ID_Booking: req.body.ID_Booking,
        PaymentDate: req.body.PaymentDate || new Date(), // Используем текущую дату, если не указана
        Amount: req.body.Amount,
        Method: req.body.Method || "Card",
        Status: req.body.Status || "Pending"
    };

    Payment.create(payment)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Payment."
            });
        });
};

// Получение всех Платежей
exports.findAll = (req, res) => {
    Payment.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving payments."
            });
        });
};

// Получение Платежа по ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Payment.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Payment with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Payment with id=" + id
            });
        });
};

// Обновление Платежа по ID
exports.update = (req, res) => {
    const id = req.params.id;

    Payment.update(req.body, {
        where: { ID_Payment: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Payment was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Payment with id=${id}. Maybe Payment was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Payment with id=" + id
        });
    });
};

// Удаление Платежа по ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Payment.destroy({
        where: { ID_Payment: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Payment was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Payment with id=${id}. Maybe Payment was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Payment with id=" + id
        });
    });
};

// Удаление всех Платежей
exports.deleteAll = (req, res) => {
    Payment.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Payments were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all payments."
        });
    });
};