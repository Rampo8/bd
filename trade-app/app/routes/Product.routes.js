module.exports = app => {
    const products = require("../controllers/product.controller.js");
    var router = require("express").Router();
    
    // Create a new Product
    router.post("/", products.create);
    
    // Retrieve all Products
    router.get("/", products.findAll);
    
    // Retrieve a single Product with id
    router.get("/:id", products.findOne);
    
    // Update a Product with id
    router.put("/:id", products.update);
    
    // Delete a Product with id
    router.delete("/:id", products.delete);
    
    // Retrieve all Products by Category ID
    router.get("/category/:categoryId", products.findByCategoryId);
    
    // Update Product quantity
    router.patch("/:id/quantity", products.updateQuantity);
    
    // Get products with low stock
    router.get("/inventory/low-stock", products.findLowStock);
    
    // Get products that are out of stock
    router.get("/inventory/out-of-stock", products.findOutOfStock);
    
    // Get product statistics
    router.get("/statistics/overview", products.getStatistics);
    
    // Search products
    router.get("/search/query", products.search);
    
    app.use('/api/products', router);
};