module.exports = app => {
  const controller = require("../controllers/Review.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /reviews:
   *   post:
   *     summary: Create a new review
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               product_id:
   *                 type: integer
   *               client_id:
   *                 type: integer
   *               rating:
   *                 type: integer
   *               comment:
   *                 type: string
   *             example:
   *               product_id: 1
   *               client_id: 1
   *               rating: 5
   *               comment: "Great product!"
   *     responses:
   *       201:
   *         description: Review created
   *       500:
   *         description: Error creating review
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /reviews:
   *   get:
   *     summary: Retrieve a list of all reviews
   *     responses:
   *       200:
   *         description: A list of reviews
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   product_id:
   *                     type: integer
   *                   client_id:
   *                     type: integer
   *                   rating:
   *                     type: integer
   *                   comment:
   *                     type: string
   *       500:
   *         description: Error retrieving reviews
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /reviews/{id}:
   *   get:
   *     summary: Retrieve a review by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Review ID
   *     responses:
   *       200:
   *         description: Review found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 product_id:
   *                   type: integer
   *                 client_id:
   *                   type: integer
   *                 rating:
   *                   type: integer
   *                 comment:
   *                   type: string
   *       404:
   *         description: Review not found
   *       500:
   *         description: Error retrieving review
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /reviews/{id}:
   *   put:
   *     summary: Update a review by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Review ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               product_id:
   *                 type: integer
   *               client_id:
   *                 type: integer
   *               rating:
   *                 type: integer
   *               comment:
   *                 type: string
   *             example:
   *               product_id: 1
   *               client_id: 2
   *               rating: 4
   *               comment: "Updated review"
   *     responses:
   *       200:
   *         description: Review updated
   *       404:
   *         description: Review not found
   *       500:
   *         description: Error updating review
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /reviews/{id}:
   *   delete:
   *     summary: Delete a review by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Review ID
   *     responses:
   *       200:
   *         description: Review deleted
   *       404:
   *         description: Review not found
   *       500:
   *         description: Error deleting review
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /reviews:
   *   delete:
   *     summary: Delete all reviews
   *     responses:
   *       200:
   *         description: All reviews deleted
   *       500:
   *         description: Error deleting reviews
   */
  router.delete("/", controller.deleteAll);

  app.use("/api/reviews", router);
};