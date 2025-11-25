module.exports = app => {
    const reviews = require("../controllers/review.controller.js");
    var router = require("express").Router();
    
    // Create a new Review
    router.post("/", reviews.create);
    
    // Retrieve all Reviews
    router.get("/", reviews.findAll);
    
    // Retrieve a single Review with id
    router.get("/:id", reviews.findOne);
    
    // Update a Review with id
    router.put("/:id", reviews.update);
    
    // Delete a Review with id
    router.delete("/:id", reviews.delete);
    
    // Retrieve all Reviews by Product ID
    router.get("/product/:productId", reviews.findByProductId);
    
    // Retrieve all Reviews by Client ID
    router.get("/client/:clientId", reviews.findByClientId);
    
    // Calculate average rating for a product
    router.get("/product/:productId/average-rating", reviews.calculateAverageRating);
    
    app.use('/api/reviews', router);
};