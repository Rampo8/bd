const db = require("../models");
const Order = db.order;
const OrderItem = db.orderItem;
const Op = db.Sequelize.Op;

// Create and Save a new Order
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.client_id || !req.body.total_amount || !req.body.status) {
            return res.status(400).send({
                message: "Client ID, total amount and status are required!"
            });
        }

        // Create an Order
        const order = {
            client_id: req.body.client_id,
            total_amount: req.body.total_amount,
            status: req.body.status
        };

        // Save Order in the database
        const data = await Order.create(order);
        
        // Include associated data in response
        const createdOrder = await Order.findByPk(data.id, {
            include: ['client', 'orderItems']
        });
        
        res.send(createdOrder);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    }
};

// Find all Orders
exports.findAll = async (req, res) => {
    try {
        const data = await Order.findAll({
            include: [
                'client', 
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['product']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    }
};

// Find one Order by id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Order.findByPk(id, {
            include: [
                'client',
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['product']
                }
            ]
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Order with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Order with id=" + req.params.id
        });
    }
};

// Update an Order by id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await Order.update(req.body, {
            where: { id: id }
        });
        
        if (num == 1) {
            // Return updated order with associations
            const updatedOrder = await Order.findByPk(id, {
                include: ['client', 'orderItems']
            });
            res.send(updatedOrder);
        } else {
            res.status(404).send({
                message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Order with id=" + req.params.id
        });
    }
};

// Delete an Order by id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        
        // First delete associated order items
        await OrderItem.destroy({
            where: { order_id: id }
        });
        
        // Then delete the order
        const num = await Order.destroy({
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "Order was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Order with id=" + req.params.id
        });
    }
};

// Find all Orders by Client ID
exports.findByClientId = async (req, res) => {
    try {
        const client_id = req.params.clientId;
        const data = await Order.findAll({
            where: { client_id: client_id },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['product']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders for client."
        });
    }
};

// Find Orders by Status
exports.findByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const data = await Order.findAll({
            where: { status: status },
            include: ['client', 'orderItems'],
            order: [['createdAt', 'DESC']]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders by status."
        });
    }
};

// Update Order Status
exports.updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        
        if (!status) {
            return res.status(400).send({
                message: "Status is required!"
            });
        }
        
        const num = await Order.update(
            { status: status },
            { where: { id: id } }
        );
        
        if (num == 1) {
            const updatedOrder = await Order.findByPk(id, {
                include: ['client', 'orderItems']
            });
            res.send(updatedOrder);
        } else {
            res.status(404).send({
                message: `Cannot update Order with id=${id}. Maybe Order was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Order status with id=" + req.params.id
        });
    }
};

// Get Orders by Date Range
exports.findByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).send({
                message: "Start date and end date are required!"
            });
        }
        
        const data = await Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: ['client', 'orderItems'],
            order: [['createdAt', 'DESC']]
        });
        
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders by date range."
        });
    }
};

// Calculate total revenue
exports.calculateRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let whereCondition = {};
        if (startDate && endDate) {
            whereCondition.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        
        const result = await Order.findAll({
            where: whereCondition,
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('total_amount')), 'total_revenue'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'total_orders']
            ],
            raw: true
        });
        
        if (result && result[0]) {
            res.send({
                total_revenue: parseFloat(result[0].total_revenue) || 0,
                total_orders: parseInt(result[0].total_orders) || 0,
                period: startDate && endDate ? `${startDate} to ${endDate}` : 'all time'
            });
        } else {
            res.send({
                total_revenue: 0,
                total_orders: 0,
                period: startDate && endDate ? `${startDate} to ${endDate}` : 'all time'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while calculating revenue."
        });
    }
};

// Create Order with Items (complete order creation)
exports.createWithItems = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        // Validate request
        if (!req.body.client_id || !req.body.status || !req.body.items || !Array.isArray(req.body.items)) {
            await transaction.rollback();
            return res.status(400).send({
                message: "Client ID, status, and items array are required!"
            });
        }

        // Calculate total amount from items
        const total_amount = req.body.items.reduce((sum, item) => {
            return sum + (item.quantity * item.price);
        }, 0);

        // Create Order
        const order = await Order.create({
            client_id: req.body.client_id,
            total_amount: total_amount,
            status: req.body.status
        }, { transaction });

        // Create Order Items
        const orderItems = req.body.items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems, { transaction });

        // Commit transaction
        await transaction.commit();

        // Return complete order with items
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                'client',
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['product']
                }
            ]
        });

        res.send(completeOrder);
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({
            message: err.message || "Some error occurred while creating the order with items."
        });
    }
};