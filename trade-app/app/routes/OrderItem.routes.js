module.exports = app => {
  const controller = require("../controllers/OrderItem.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /orderItems:
   *   post:
   *     summary: Create a new order item
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               order_id:
   *                 type: integer
   *               product_id:
   *                 type: integer
   *               quantity:
   *                 type: integer
   *               price:
   *                 type: number
   *             example:
   *               order_id: 1
   *               product_id: 1
   *               quantity: 2
   *               price: 19.99
   *     responses:
   *       201:
   *         description: Order item created
   *       500:
   *         description: Error creating order item
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /orderItems:
   *   get:
   *     summary: Retrieve a list of all order items
   *     responses:
   *       200:
   *         description: A list of order items
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   order_id:
   *                     type: integer
   *                   product_id:
   *                     type: integer
   *                   quantity:
   *                     type: integer
   *                   price:
   *                     type: number
   *       500:
   *         description: Error retrieving order items
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /orderItems/{id}:
   *   get:
   *     summary: Retrieve an order item by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order item ID
   *     responses:
   *       200:
   *         description: Order item found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 order_id:
   *                   type: integer
   *                 product_id:
   *                   type: integer
   *                 quantity:
   *                   type: integer
   *                 price:
   *                   type: number
   *       404:
   *         description: Order item not found
   *       500:
   *         description: Error retrieving order item
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /orderItems/{id}:
   *   put:
   *     summary: Update an order item by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order item ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               order_id:
   *                 type: integer
   *               product_id:
   *                 type: integer
   *               quantity:
   *                 type: integer
   *               price:
   *                 type: number
   *             example:
   *               order_id: 1
   *               product_id: 2
   *               quantity: 3
   *               price: 29.99
   *     responses:
   *       200:
   *         description: Order item updated
   *       404:
   *         description: Order item not found
   *       500:
   *         description: Error updating order item
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /orderItems/{id}:
   *   delete:
   *     summary: Delete an order item by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order item ID
   *     responses:
   *       200:
   *         description: Order item deleted
   *       404:
   *         description: Order item not found
   *       500:
   *         description: Error deleting order item
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /orderItems:
   *   delete:
   *     summary: Delete all order items
   *     responses:
   *       200:
   *         description: All order items deleted
   *       500:
   *         description: Error deleting order items
   */
  router.delete("/", controller.deleteAll);

  app.use("/api/orderItems", router);
};