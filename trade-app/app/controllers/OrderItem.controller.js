const db = require("../models");
const OrderItem = db.orderItem;
const Op = db.Sequelize.Op;

// Create and Save a new OrderItem
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.order_id || !req.body.product_id || !req.body.quantity || !req.body.price) {
            return res.status(400).send({
                message: "All fields (order_id, product_id, quantity, price) are required!"
            });
        }

        // Create an OrderItem
        const orderItem = {
            order_id: req.body.order_id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            price: req.body.price
        };

        // Save OrderItem in the database
        const data = await OrderItem.create(orderItem);
        
        // Include associated data in response
        const createdOrderItem = await OrderItem.findByPk(data.id, {
            include: ['order', 'product']
        });
        
        res.send(createdOrderItem);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the OrderItem."
        });
    }
};

// Find all OrderItems
exports.findAll = async (req, res) => {
    try {
        const data = await OrderItem.findAll({
            include: ['order', 'product']
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving order items."
        });
    }
};

// Find one OrderItem by id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await OrderItem.findByPk(id, {
            include: ['order', 'product']
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find OrderItem with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving OrderItem with id=" + req.params.id
        });
    }
};

// Update an OrderItem by id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await OrderItem.update(req.body, {
            where: { id: id }
        });
        
        if (num == 1) {
            // Return updated order item with associations
            const updatedOrderItem = await OrderItem.findByPk(id, {
                include: ['order', 'product']
            });
            res.send(updatedOrderItem);
        } else {
            res.status(404).send({
                message: `Cannot update OrderItem with id=${id}. Maybe OrderItem was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating OrderItem with id=" + req.params.id
        });
    }
};

// Delete an OrderItem by id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await OrderItem.destroy({
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "OrderItem was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete OrderItem with id=${id}. Maybe OrderItem was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete OrderItem with id=" + req.params.id
        });
    }
};

// Find all OrderItems by Order ID
exports.findByOrderId = async (req, res) => {
    try {
        const order_id = req.params.orderId;
        const data = await OrderItem.findAll({
            where: { order_id: order_id },
            include: ['product'] // Include product details for order items
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving order items for order."
        });
    }
};

// Find all OrderItems by Product ID
exports.findByProductId = async (req, res) => {
    try {
        const product_id = req.params.productId;
        const data = await OrderItem.findAll({
            where: { product_id: product_id },
            include: ['order'] // Include order details for order items
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving order items for product."
        });
    }
};

// Calculate total for an order
exports.calculateOrderTotal = async (req, res) => {
    try {
        const order_id = req.params.orderId;
        
        const result = await OrderItem.findAll({
            where: { order_id: order_id },
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.literal('quantity * price')), 'total_amount'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'total_quantity']
            ],
            raw: true
        });
        
        if (result && result[0]) {
            res.send({
                order_id: order_id,
                total_amount: parseFloat(result[0].total_amount) || 0,
                total_quantity: parseInt(result[0].total_quantity) || 0
            });
        } else {
            res.send({
                order_id: order_id,
                total_amount: 0,
                total_quantity: 0
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while calculating order total."
        });
    }
};

// Bulk create order items
exports.bulkCreate = async (req, res) => {
    try {
        // Validate request
        if (!req.body.items || !Array.isArray(req.body.items)) {
            return res.status(400).send({
                message: "Items array is required!"
            });
        }

        // Validate each item
        for (const item of req.body.items) {
            if (!item.order_id || !item.product_id || !item.quantity || !item.price) {
                return res.status(400).send({
                    message: "Each item must have order_id, product_id, quantity, and price!"
                });
            }
        }

        // Create order items
        const data = await OrderItem.bulkCreate(req.body.items);
        
        // Get created items with associations
        const createdItems = await OrderItem.findAll({
            where: {
                id: data.map(item => item.id)
            },
            include: ['order', 'product']
        });
        
        res.send(createdItems);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating order items in bulk."
        });
    }
};