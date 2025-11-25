const db = require("../models");
const Category = db.category;
const Op = db.Sequelize.Op;

// Create and Save a new Category
exports.create = async (req, res) => {
    try {
        // Validate request
        if (!req.body.name) {
            return res.status(400).send({
                message: "Category name cannot be empty!"
            });
        }

        // Create a Category
        const category = {
            name: req.body.name
        };

        // Save Category in the database
        const data = await Category.create(category);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Category."
        });
    }
};

// Find all Categories
exports.findAll = async (req, res) => {
    try {
        const data = await Category.findAll({
            include: ['products'] // включаем связанные продукты
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving categories."
        });
    }
};

// Find one Category by id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Category.findByPk(id, {
            include: ['products'] // включаем связанные продукты
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Category with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Category with id=" + req.params.id
        });
    }
};

// Update a Category by id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await Category.update(req.body, {
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "Category was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Category with id=" + req.params.id
        });
    }
};

// Delete a Category by id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        
        const num = await Category.destroy({
            where: { id: id }
        });
        
        if (num == 1) {
            res.send({
                message: "Category was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Category with id=" + req.params.id
        });
    }
};

// Find all Products by Category ID
exports.findProductsByCategoryId = async (req, res) => {
    try {
        const category_id = req.params.categoryId;
        const category = await Category.findByPk(category_id, {
            include: ['products']
        });
        
        if (category) {
            res.send(category.products);
        } else {
            res.status(404).send({
                message: `Cannot find Category with id=${category_id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products for category."
        });
    }
};