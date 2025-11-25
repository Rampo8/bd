module.exports = app => {
    const orderItems = require("../controllers/orderitem.controller.js");
    var router = require("express").Router();
    
    // Create a new OrderItem
    router.post("/", orderItems.create);
    
    // Retrieve all OrderItems
    router.get("/", orderItems.findAll);
    
    // Retrieve a single OrderItem with id
    router.get("/:id", orderItems.findOne);
    
    // Update an OrderItem with id
    router.put("/:id", orderItems.update);
    
    // Delete an OrderItem with id
    router.delete("/:id", orderItems.delete);
    
    // Retrieve all OrderItems by Order ID
    router.get("/order/:orderId", orderItems.findByOrderId);
    
    // Retrieve all OrderItems by Product ID
    router.get("/product/:productId", orderItems.findByProductId);
    
    // Calculate total for an order
    router.get("/order/:orderId/total", orderItems.calculateOrderTotal);
    
    // Bulk create order items
    router.post("/bulk", orderItems.bulkCreate);
    
    app.use('/api/order-items', router);
};