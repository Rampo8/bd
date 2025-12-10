module.exports = app => {
  const controller = require("../controllers/Addresses.controller.js");
  const router = require("express").Router();
  router.post("/", controller.create);
  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.delete("/", controller.deleteAll);

  // Нестандартные маршруты для 7.1
  router.get("/search/city", controller.getAddressesByCity);
  router.get("/statistics/count-by-country", controller.getCountByCountry);
  router.get("/duplicates/postal-code", controller.findDuplicatesByPostalCode);
  router.get("/recent", controller.getRecentAddresses);
  router.get("/top-countries", controller.getTopCountries);
  router.get("/search/street", controller.searchByStreetPart);
  router.get("/without-client", controller.getAddressesWithoutClient);

  app.use("/api/addresses", router);
};