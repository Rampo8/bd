module.exports = app => {
  const controller = require("../controllers/Categories.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /categories:
   *   post:
   *     summary: Create a new category
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
   *             example:
   *               name: "Electronics"
   *               description: "Category for electronic devices"
   *     responses:
   *       201:
   *         description: Category created
   *       500:
   *         description: Error creating category
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /categories:
   *   get:
   *     summary: Retrieve a list of all categories
   *     responses:
   *       200:
   *         description: A list of categories
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
   *       500:
   *         description: Error retrieving categories
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     summary: Retrieve a category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category found
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
   *         description: Category not found
   *       500:
   *         description: Error retrieving category
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /categories/{id}:
   *   put:
   *     summary: Update a category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
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
   *             example:
   *               name: "Updated Electronics"
   *               description: "Updated category for electronic devices"
   *     responses:
   *       200:
   *         description: Category updated
   *       404:
   *         description: Category not found
   *       500:
   *         description: Error updating category
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     summary: Delete a category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category deleted
   *       404:
   *         description: Category not found
   *       500:
   *         description: Error deleting category
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /categories:
   *   delete:
   *     summary: Delete all categories
   *     responses:
   *       200:
   *         description: All categories deleted
   *       500:
   *         description: Error deleting categories
   */
  router.delete("/", controller.deleteAll);

  app.use("/api/categories", router);
};