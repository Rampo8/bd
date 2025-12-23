module.exports = app => {
  const controller = require("../controllers/Order.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /orders:
   *   post:
   *     summary: Create a new order
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client_id:
   *                 type: integer
   *               status:
   *                 type: string
   *               total_amount:
   *                 type: number
   *               date:
   *                 type: string
   *                 format: date-time
   *             example:
   *               client_id: 1
   *               status: "pending"
   *               total_amount: 99.99
   *               date: "2025-12-16T12:00:00Z"
   *     responses:
   *       201:
   *         description: Order created
   *       500:
   *         description: Error creating order
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Retrieve a list of all orders
   *     responses:
   *       200:
   *         description: A list of orders
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   client_id:
   *                     type: integer
   *                   status:
   *                     type: string
   *                   total_amount:
   *                     type: number
   *                   date:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Error retrieving orders
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     summary: Retrieve an order by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 client_id:
   *                   type: integer
   *                 status:
   *                   type: string
   *                 total_amount:
   *                   type: number
   *                 date:
   *                   type: string
   *                   format: date-time
   *       404:
   *         description: Order not found
   *       500:
   *         description: Error retrieving order
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /orders/{id}:
   *   put:
   *     summary: Update an order by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client_id:
   *                 type: integer
   *               status:
   *                 type: string
   *               total_amount:
   *                 type: number
   *               date:
   *                 type: string
   *                 format: date-time
   *             example:
   *               client_id: 2
   *               status: "completed"
   *               total_amount: 149.99
   *               date: "2025-12-16T15:00:00Z"
   *     responses:
   *       200:
   *         description: Order updated
   *       404:
   *         description: Order not found
   *       500:
   *         description: Error updating order
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /orders/{id}:
   *   delete:
   *     summary: Delete an order by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order deleted
   *       404:
   *         description: Order not found
   *       500:
   *         description: Error deleting order
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /orders:
   *   delete:
   *     summary: Delete all orders
   *     responses:
   *       200:
   *         description: All orders deleted
   *       500:
   *         description: Error deleting orders
   */
  router.delete("/", controller.deleteAll);

  app.use("/api/orders", router);
};