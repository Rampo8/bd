const db = require("../models");
const Room = db.Room; // Используем Room, как в вашем index.js

exports.create = async (req, res) => {
    try {
        const data = await Room.create(req.body);
        res.status(201).send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Room.findAll();
        res.send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Room.findByPk(req.params.id); // findByPk работает с определенным PK
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.update = async (req, res) => {
    try {
        // ИСПРАВЛЕНО: используем ID_Room
        const result = await Room.update(req.body, { where: { ID_Room: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.delete = async (req, res) => {
    try {
        // ИСПРАВЛЕНО: используем ID_Room
        const result = await Room.destroy({ where: { ID_Room: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Room.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { res.status(500).send({ message: e.message }); }
};