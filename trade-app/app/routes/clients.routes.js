module.exports = app => {
  const clients = require("../controllers/clients.controller.js");
  const router = require("express").Router();

  // Стандартные маршруты
  router.post("/", clients.create);
  router.get("/", clients.findAll);
  router.get("/:id", clients.findOne);
  router.put("/:id", clients.update);
  router.delete("/:id", clients.delete);
  router.delete("/", clients.deleteAll);

  // Нестандартные запросы
  router.get("/:id/referredby", clients.getReferredBy);
  router.get("/:id/referredby-param", clients.getReferredByParam);
  router.get("/:id/referrals", clients.getReferrals);

  // Дополнительные методы
  router.get("/statistics/referrals", clients.getReferralStatistics);
  router.get("/search/email", clients.findByEmailPart);
  router.get("/top-referrers", clients.getTopReferrers);
  router.get("/search/city", clients.findByCity);
  router.get("/root-clients", clients.getRootClients);
  router.get("/duplicates/email", clients.findEmailDuplicates);
  router.get("/activity/monthly", clients.getMonthlyActivity);

  app.use("/api/clients", router);
};