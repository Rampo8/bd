module.exports = app => {
  const controller = require("../controllers/Addresses.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /addresses:
   *   post:
   *     summary: Create a new address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client_id:
   *                 type: integer
   *               country:
   *                 type: string
   *               city:
   *                 type: string
   *               street:
   *                 type: string
   *               postal_code:
   *                 type: string
   *             example:
   *               client_id: 1
   *               country: "USA"
   *               city: "New York"
   *               street: "123 Main St"
   *               postal_code: "10001"
   *     responses:
   *       201:
   *         description: Address created
   *       500:
   *         description: Error creating address
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /addresses:
   *   get:
   *     summary: Retrieve a list of all addresses
   *     responses:
   *       200:
   *         description: A list of addresses
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
   *                   country:
   *                     type: string
   *                   city:
   *                     type: string
   *                   street:
   *                     type: string
   *                   postal_code:
   *                     type: string
   *       500:
   *         description: Error retrieving addresses
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /addresses/{id}:
   *   get:
   *     summary: Retrieve an address by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Address ID
   *     responses:
   *       200:
   *         description: Address found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 client_id:
   *                   type: integer
   *                 country:
   *                   type: string
   *                 city:
   *                   type: string
   *                 street:
   *                   type: string
   *                 postal_code:
   *                   type: string
   *       404:
   *         description: Address not found
   *       500:
   *         description: Error retrieving address
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /addresses/{id}:
   *   put:
   *     summary: Update an address by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Address ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client_id:
   *                 type: integer
   *               country:
   *                 type: string
   *               city:
   *                 type: string
   *               street:
   *                 type: string
   *               postal_code:
   *                 type: string
   *             example:
   *               client_id: 1
   *               country: "USA"
   *               city: "Los Angeles"
   *               street: "456 Elm St"
   *               postal_code: "90001"
   *     responses:
   *       200:
   *         description: Address updated
   *       404:
   *         description: Address not found
   *       500:
   *         description: Error updating address
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /addresses/{id}:
   *   delete:
   *     summary: Delete an address by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Address ID
   *     responses:
   *       200:
   *         description: Address deleted
   *       404:
   *         description: Address not found
   *       500:
   *         description: Error deleting address
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /addresses:
   *   delete:
   *     summary: Delete all addresses
   *     responses:
   *       200:
   *         description: All addresses deleted
   *       500:
   *         description: Error deleting addresses
   */
  router.delete("/", controller.deleteAll);

  // Нестандартные маршруты для 7.1

  /**
   * @swagger
   * /addresses/search/city:
   *   get:
   *     summary: Get addresses by city
   *     parameters:
   *       - in: query
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         description: City name
   *     responses:
   *       200:
   *         description: List of addresses in the city
   *       400:
   *         description: City parameter required
   *       500:
   *         description: Error retrieving addresses
   */
  router.get("/search/city", controller.getAddressesByCity);

  /**
   * @swagger
   * /addresses/statistics/count-by-country:
   *   get:
   *     summary: Get count of addresses by country
   *     responses:
   *       200:
   *         description: Count by country
   *       500:
   *         description: Error retrieving statistics
   */
  router.get("/statistics/count-by-country", controller.getCountByCountry);

  /**
   * @swagger
   * /addresses/duplicates/postal-code:
   *   get:
   *     summary: Find duplicates by postal code
   *     responses:
   *       200:
   *         description: List of duplicates
   *       500:
   *         description: Error retrieving duplicates
   */
  router.get("/duplicates/postal-code", controller.findDuplicatesByPostalCode);

  /**
   * @swagger
   * /addresses/recent:
   *   get:
   *     summary: Get recent addresses
   *     responses:
   *       200:
   *         description: List of recent addresses
   *       500:
   *         description: Error retrieving recent addresses
   */
  router.get("/recent", controller.getRecentAddresses);

  /**
   * @swagger
   * /addresses/top-countries:
   *   get:
   *     summary: Get top countries by address count
   *     responses:
   *       200:
   *         description: List of top countries
   *       500:
   *         description: Error retrieving top countries
   */
  router.get("/top-countries", controller.getTopCountries);

  /**
   * @swagger
   * /addresses/search/street:
   *   get:
   *     summary: Search addresses by street part
   *     parameters:
   *       - in: query
   *         name: street
   *         required: true
   *         schema:
   *           type: string
   *         description: Part of street name
   *     responses:
   *       200:
   *         description: List of matching addresses
   *       400:
   *         description: Street parameter required
   *       500:
   *         description: Error searching addresses
   */
  router.get("/search/street", controller.searchByStreetPart);

  /**
   * @swagger
   * /addresses/without-client:
   *   get:
   *     summary: Get addresses without associated client
   *     responses:
   *       200:
   *         description: List of addresses without client
   *       500:
   *         description: Error retrieving addresses
   */
  router.get("/without-client", controller.getAddressesWithoutClient);

  app.use("/api/addresses", router);
};