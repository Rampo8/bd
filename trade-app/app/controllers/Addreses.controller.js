const db = require("../models");
const Booking = db.booking;

exports.create = async (req, res) => {
    try {
        const data = await Booking.create(req.body);
        res.status(201).send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Booking.findAll();
        res.send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Booking.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.update = async (req, res) => {
    try {
        const result = await Booking.update(req.body, { where: { ID_Booking: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.delete = async (req, res) => {
    try {
        const result = await Booking.destroy({ where: { ID_Booking: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Booking.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { res.status(500).send({ message: e.message }); }
};