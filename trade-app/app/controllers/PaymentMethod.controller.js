const db = require("../models");
const PaymentMethod = db.paymentMethod;
const Op = db.Sequelize.Op;

// Create and Save a new PaymentMethod
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.client_id || !req.body.type || !req.body.provider || !req.body.account_number) {
            return res.status(400).send({
                message: "All fields (client_id, type, provider, account_number) are required!"
            });
        }

        // Create a PaymentMethod
        const paymentMethod = {
            client_id: req.body.client_id,
            type: req.body.type,
            provider: req.body.provider,
            account_number: req.body.account_number
        };

        // Save PaymentMethod in the database
        const data = await PaymentMethod.create(paymentMethod);
        
        // Include associated data in response
        const createdPaymentMethod = await PaymentMethod.findByPk(data.id, {
            include: ['client']
        });
        
        res.send(createdPaymentMethod);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the PaymentMethod."
        });
    }
};

// Find all PaymentMethods
exports.findAll = async (req, res) => {
    try {
        const data = await PaymentMethod.findAll({
            include: ['client']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving payment methods."
        });
    }
};

// Find one PaymentMethod by id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await PaymentMethod.findByPk(id, {
            include: ['client']
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find PaymentMethod with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving PaymentMethod with id=" + req.params.id
        });
    }
};

// Update a PaymentMethod by id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await PaymentMethod.update(req.body, {
            where: { id: id }
        });
        
        if (num == 1) {
            // Return updated payment method with associations
            const updatedPaymentMethod = await PaymentMethod.findByPk(id, {
                include: ['client']
            });
            res.send(updatedPaymentMethod);
        } else {
            res.status(404).send({
                message: `Cannot update PaymentMethod with id=${id}. Maybe PaymentMethod was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating PaymentMethod with id=" + req.params.id
        });
    }
};

// Delete a PaymentMethod by id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await PaymentMethod.destroy({
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "PaymentMethod was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete PaymentMethod with id=${id}. Maybe PaymentMethod was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete PaymentMethod with id=" + req.params.id
        });
    }
};

// Find all PaymentMethods by Client ID
exports.findByClientId = async (req, res) => {
    try {
        const client_id = req.params.clientId;
        const data = await PaymentMethod.findAll({
            where: { client_id: client_id },
            include: ['client']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving payment methods for client."
        });
    }
};

// Find PaymentMethods by Type
exports.findByType = async (req, res) => {
    try {
        const type = req.params.type;
        const data = await PaymentMethod.findAll({
            where: { type: type },
            include: ['client']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving payment methods by type."
        });
    }
};

// Find PaymentMethods by Provider
exports.findByProvider = async (req, res) => {
    try {
        const provider = req.params.provider;
        const data = await PaymentMethod.findAll({
            where: { provider: provider },
            include: ['client']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving payment methods by provider."
        });
    }
};

// Set default payment method for client
exports.setDefault = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const client_id = req.body.client_id;
        const payment_method_id = req.body.payment_method_id;
        
        if (!client_id || !payment_method_id) {
            await transaction.rollback();
            return res.status(400).send({
                message: "Client ID and Payment Method ID are required!"
            });
        }
        
        // First, unset any existing default payment methods for this client
        await PaymentMethod.update(
            { is_default: false },
            { 
                where: { client_id: client_id },
                transaction
            }
        );
        
        // Then set the new default
        const num = await PaymentMethod.update(
            { is_default: true },
            { 
                where: { 
                    id: payment_method_id,
                    client_id: client_id
                },
                transaction
            }
        );
        
        if (num == 1) {
            await transaction.commit();
            
            const updatedPaymentMethod = await PaymentMethod.findByPk(payment_method_id, {
                include: ['client']
            });
            
            res.send({
                message: "Default payment method set successfully!",
                payment_method: updatedPaymentMethod
            });
        } else {
            await transaction.rollback();
            res.status(404).send({
                message: `Cannot set default payment method. Payment method not found or doesn't belong to client.`
            });
        }
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({
            message: err.message || "Some error occurred while setting default payment method."
        });
    }
};

// Get default payment method for client
exports.getDefaultByClientId = async (req, res) => {
    try {
        const client_id = req.params.clientId;
        const data = await PaymentMethod.findOne({
            where: { 
                client_id: client_id,
                is_default: true
            },
            include: ['client']
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `No default payment method found for client with id=${client_id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving default payment method for client."
        });
    }
};