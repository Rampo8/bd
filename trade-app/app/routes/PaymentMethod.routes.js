module.exports = app => {
    const paymentMethods = require("../controllers/PaymentMethod.controller.js");
    var router = require("express").Router();
    
    // Create a new PaymentMethod
    router.post("/", paymentMethods.create);
    
    // Retrieve all PaymentMethods
    router.get("/", paymentMethods.findAll);
    
    // Retrieve a single PaymentMethod with id
    router.get("/:id", paymentMethods.findOne);
    
    // Update a PaymentMethod with id
    router.put("/:id", paymentMethods.update);
    
    // Delete a PaymentMethod with id
    router.delete("/:id", paymentMethods.delete);
    
    // Retrieve all PaymentMethods by Client ID
    router.get("/client/:clientId", paymentMethods.findByClientId);
    
    // Retrieve PaymentMethods by Type
    router.get("/type/:type", paymentMethods.findByType);
    
    // Retrieve PaymentMethods by Provider
    router.get("/provider/:provider", paymentMethods.findByProvider);
    
    // Set default payment method for client
    router.post("/set-default", paymentMethods.setDefault);
    
    // Get default payment method for client
    router.get("/client/:clientId/default", paymentMethods.getDefaultByClientId);
    
    app.use('/api/payment-methods', router);
};