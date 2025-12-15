module.exports = app => {
  const controller = require("../controllers/Product.controller.js");
  const router = require("express").Router();
  module.exports = app => {
  const controller = require("../controllers/Product.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               quantity:
   *                 type: integer
   *               category_id:
   *                 type: integer
   *             example:
   *               name: "Product1"
   *               description: "Description"
   *               price: 10.99
   *               quantity: 100
   *               category_id: 1
   *     responses:
   *       201:
   *         description: Product created
   *       500:
   *         description: Error creating product
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Retrieve a list of products with pagination
   *     parameters:
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *         description: Page size
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *     responses:
   *       200:
   *         description: A list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   price:
   *                     type: number
   *                   quantity:
   *                     type: integer
   *                   category_id:
   *                     type: integer
   *       500:
   *         description: Error retrieving products
   */
  router.get("/", controller.getAllWithPager);

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Retrieve a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 description:
   *                   type: string
   *                 price:
   *                   type: number
   *                 quantity:
   *                   type: integer
   *                 category_id:
   *                   type: integer
   *       404:
   *         description: Product not found
   *       500:
   *         description: Error
   */
  router.get("/:id", controller.findOne);

  // Update, delete, deleteAll с JSDoc аналогично

  /**
   * @swagger
   * /products/{id}/categoryname:
   *   get:
   *     summary: Get category name for product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category name
   *       500:
   *         description: Error
   */
  router.get("/:id/categoryname", controller.getCategoryName);

  /**
   * @swagger
   * /products/{id}/category:
   *   get:
   *     summary: Get full category for product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category object
   *       404:
   *         description: Category not found
   *       500:
   *         description: Error
   */
  router.get("/:id/category", controller.getCategory);
  }
};