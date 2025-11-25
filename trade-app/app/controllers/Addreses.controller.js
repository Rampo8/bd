const db = require("../models");
const Address = db.address;
const Op = db.Sequelize.Op;

// Create and Save a new Address
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.street || !req.body.city || !req.body.state || !req.body.postal_code || !req.body.client_id) {
            return res.status(400).send({
                message: "All fields are required!"
            });
        }

        // Create an Address
        const address = {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            client_id: req.body.client_id
        };

        // Save Address in the database
        const data = await Address.create(address);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Address."
        });
    }
};

// Find all Addresses
exports.findAll = async (req, res) => {
    try {
        const data = await Address.findAll({
            include: ['client'] // включаем связанную модель Client
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving addresses."
        });
    }
};

// Find one Address by id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Address.findByPk(id, {
            include: ['client'] // включаем связанную модель Client
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Address with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Address with id=" + req.params.id
        });
    }
};

// Update an Address by id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await Address.update(req.body, {
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "Address was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Address with id=${id}. Maybe Address was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Address with id=" + req.params.id
        });
    }
};

// Delete an Address by id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await Address.destroy({
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "Address was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Address with id=${id}. Maybe Address was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Address with id=" + req.params.id
        });
    }
};

// Find all Addresses by Client ID
exports.findByClientId = async (req, res) => {
    try {
        const client_id = req.params.clientId;
        const data = await Address.findAll({
            where: { client_id: client_id },
            include: ['client']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving addresses for client."
        });
    }
};