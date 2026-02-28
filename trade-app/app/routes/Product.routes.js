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
   *         description: "Page size (default: 10)"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: "Page number (default: 1)"
   *     responses:
   *       200:
   *         description: A paged list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       description:
   *                         type: string
   *                       price:
   *                         type: number
   *                       quantity:
   *                         type: integer
   *                       category_id:
   *                         type: integer
   *                 totalItems:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
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
   *         description: Product ID
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
   *         description: Error retrieving product
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
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
   *               name: "Updated Product"
   *               description: "Updated Description"
   *               price: 15.99
   *               quantity: 50
   *               category_id: 2
   *     responses:
   *       200:
   *         description: Product updated
   *       404:
   *         description: Product not found
   *       500:
   *         description: Error updating product
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   *       500:
   *         description: Error deleting product
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /products:
   *   delete:
   *     summary: Delete all products
   *     responses:
   *       200:
   *         description: All products deleted
   *       500:
   *         description: Error deleting products
   */
  router.delete("/", controller.deleteAll);

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
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Category name
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *       404:
   *         description: Product or category not found
   *       500:
   *         description: Error retrieving category name
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
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Category object
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
   *       404:
   *         description: Product or category not found
   *       500:
   *         description: Error retrieving category
   */
  router.get("/:id/category", controller.getCategory);

  app.use('/api/products', router);
};