module.exports = app => {
    const orders = require("../controllers/order.controller.js");
    var router = require("express").Router();
    
    // Create a new Order
    router.post("/", orders.create);
    
    // Retrieve all Orders
    router.get("/", orders.findAll);
    
    // Retrieve a single Order with id
    router.get("/:id", orders.findOne);
    
    // Update an Order with id
    router.put("/:id", orders.update);
    
    // Delete an Order with id
    router.delete("/:id", orders.delete);
    
    // Retrieve all Orders by Client ID
    router.get("/client/:clientId", orders.findByClientId);
    
    // Retrieve Orders by Status
    router.get("/status/:status", orders.findByStatus);
    
    // Update Order Status
    router.patch("/:id/status", orders.updateStatus);
    
    // Get Orders by Date Range
    router.get("/date-range", orders.findByDateRange);
    
    // Calculate total revenue
    router.get("/revenue", orders.calculateRevenue);
    
    // Create Order with Items
    router.post("/with-items", orders.createWithItems);
    
    app.use('/api/orders', router);
};