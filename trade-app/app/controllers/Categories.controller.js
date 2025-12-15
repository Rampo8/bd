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
   *               name: "Category1"
   *               description: "Description"
   *     responses:
   *       201:
   *         description: Category created
   *       500:
   *         description: Error
   */
  router.post("/", controller.create);

  // Аналогично для других методов (findAll, findOne, update, delete, deleteAll)
  // ...

  // Нестандартные
  /**
   * @swagger
   * /categories/statistics/product-count:
   *   get:
   *     summary: Get categories with product count
   *     responses:
   *       200:
   *         description: Statistics
   *       500:
   *         description: Error
   */
  router.get("/statistics/product-count", controller.getCategoriesWithProductCount);

  // Другие нестандартные...

  app.use("/api/categories", router);
};