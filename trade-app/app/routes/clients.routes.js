module.exports = app => {
  const controller = require("../controllers/clients.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /clients:
   *   post:
   *     summary: Create a new client
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *             example:
   *               name: "John Doe"
   *               email: "john@example.com"
   *               phone: "+1234567890"
   *     responses:
   *       201:
   *         description: Client created
   *       500:
   *         description: Error creating client
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /clients:
   *   get:
   *     summary: Retrieve a list of all clients
   *     responses:
   *       200:
   *         description: A list of clients
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
   *                   email:
   *                     type: string
   *                   phone:
   *                     type: string
   *       500:
   *         description: Error retrieving clients
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /clients/{id}:
   *   get:
   *     summary: Retrieve a client by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     responses:
   *       200:
   *         description: Client found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *       404:
   *         description: Client not found
   *       500:
   *         description: Error retrieving client
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /clients/{id}:
   *   put:
   *     summary: Update a client by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *             example:
   *               name: "Jane Doe"
   *               email: "jane@example.com"
   *               phone: "+0987654321"
   *     responses:
   *       200:
   *         description: Client updated
   *       404:
   *         description: Client not found
   *       500:
   *         description: Error updating client
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /clients/{id}:
   *   delete:
   *     summary: Delete a client by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     responses:
   *       200:
   *         description: Client deleted
   *       404:
   *         description: Client not found
   *       500:
   *         description: Error deleting client
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /clients:
   *   delete:
   *     summary: Delete all clients
   *     responses:
   *       200:
   *         description: All clients deleted
   *       500:
   *         description: Error deleting clients
   */
  router.delete("/", controller.deleteAll);

  app.use("/api/clients", router);
};