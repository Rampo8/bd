module.exports = app => {
    const clients = require("../controllers/client.controller.js");
    var router = require("express").Router();
    
    // Create a new Client
    router.post("/", clients.create);
    
    // Retrieve all Clients
    router.get("/", clients.findAll);
    
    // Retrieve a single Client with id
    router.get("/:id", clients.findOne);
    
    // Update a Client with id
    router.put("/:id", clients.update);
    
    // Delete a Client with id
    router.delete("/:id", clients.delete);
    
    // Retrieve all Referrals by Client ID
    router.get("/:clientId/referrals", clients.findReferralsByClientId);
    
    // Retrieve Clients by Referrer ID
    router.get("/referrer/:referrerId", clients.findByReferrerId);
    
    // Retrieve Client by Email
    router.get("/email/:email", clients.findByEmail);
    
    app.use('/api/clients', router);
};