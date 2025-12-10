const db = require("../models");
const { QueryTypes } = require('sequelize');
const Address = db.address;

exports.create = async (req, res) => {
    try {
        const data = await Address.create(req.body);
        res.status(201).send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Address.findAll();
        res.send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Address.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.update = async (req, res) => {
    try {
        const result = await Address.update(req.body, { where: { id: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.delete = async (req, res) => {
    try {
        const result = await Address.destroy({ where: { id: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Address.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

// НЕСТАНДАРТНЫЕ ЗАПРОСЫ (для задания 7.1 - 7 методов с raw query, параметрами и маппингом)
exports.getAddressesByCity = async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).send({ message: "City is required" });
    const addresses = await db.sequelize.query(
      'SELECT * FROM addresses WHERE city ILIKE :cityPattern',
      {
        replacements: { cityPattern: `%${city}%` },
        type: QueryTypes.SELECT,
        model: Address,
        mapToModel: true
      }
    );
    res.send(addresses);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getCountByCountry = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      'SELECT country, COUNT(*) as count FROM addresses GROUP BY country ORDER BY count DESC',
      { type: QueryTypes.SELECT }
    );
    res.send(stats);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findDuplicatesByPostalCode = async (_req, res) => {
  try {
    const duplicates = await db.sequelize.query(
      'SELECT postal_code, COUNT(*) as count FROM addresses GROUP BY postal_code HAVING COUNT(*) > 1 ORDER BY count DESC',
      { type: QueryTypes.SELECT }
    );
    res.send(duplicates);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getRecentAddresses = async (_req, res) => {
  try {
    const addresses = await db.sequelize.query(
      'SELECT * FROM addresses WHERE created_at > CURRENT_DATE - INTERVAL \'1 month\'',
      {
        type: QueryTypes.SELECT,
        model: Address,
        mapToModel: true
      }
    );
    res.send(addresses);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getTopCountries = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const top = await db.sequelize.query(
      'SELECT country, COUNT(*) as count FROM addresses GROUP BY country ORDER BY count DESC LIMIT :limit',
      {
        replacements: { limit: parseInt(limit) },
        type: QueryTypes.SELECT
      }
    );
    res.send(top);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.searchByStreetPart = async (req, res) => {
  try {
    const streetPart = req.query.street;
    if (!streetPart) return res.status(400).send({ message: "Street part is required" });
    const addresses = await db.sequelize.query(
      'SELECT * FROM addresses WHERE street ILIKE :streetPattern',
      {
        replacements: { streetPattern: `%${streetPart}%` },
        type: QueryTypes.SELECT,
        model: Address,
        mapToModel: true
      }
    );
    res.send(addresses);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getAddressesWithoutClient = async (_req, res) => {
  try {
    const addresses = await db.sequelize.query(
      'SELECT * FROM addresses WHERE client_id IS NULL',
      {
        type: QueryTypes.SELECT,
        model: Address,
        mapToModel: true
      }
    );
    res.send(addresses);
  } catch (e) { res.status(500).send({ message: e.message }); }
};