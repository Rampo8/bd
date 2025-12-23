const db = require("../models");
const { QueryTypes } = require('sequelize');
const Category = db.category;

exports.create = async (req, res) => {
    try {
        const data = await Category.create(req.body);
        res.status(201).send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Category.findAll();
        res.send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Category.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.update = async (req, res) => {
    try {
        const result = await Category.update(req.body, { where: { id: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.delete = async (req, res) => {
    try {
        const result = await Category.destroy({ where: { id: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Category.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

// НЕСТАНДАРТНЫЕ ЗАПРОСЫ (для задания 7.1 - 6 методов с raw query, параметрами и маппингом)
exports.getCategoriesWithProductCount = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY product_count DESC',
      {
        type: QueryTypes.SELECT,
        model: Category,
        mapToModel: true
      }
    );
    res.send(stats);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findByNamePart = async (req, res) => {
  try {
    const namePart = req.query.name;
    if (!namePart) return res.status(400).send({ message: "Name part is required" });
    const categories = await db.sequelize.query(
      'SELECT * FROM categories WHERE name ILIKE :namePattern',
      {
        replacements: { namePattern: `%${namePart}%` },
        type: QueryTypes.SELECT,
        model: Category,
        mapToModel: true
      }
    );
    res.send(categories);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getTopCategoriesByProductQuantity = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const top = await db.sequelize.query(
      'SELECT c.*, SUM(p.quantity) as total_quantity FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY total_quantity DESC LIMIT :limit',
      {
        replacements: { limit: parseInt(limit) },
        type: QueryTypes.SELECT,
        model: Category,
        mapToModel: true
      }
    );
    res.send(top);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getCategoriesWithoutProducts = async (_req, res) => {
  try {
    const categories = await db.sequelize.query(
      'SELECT c.* FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE p.id IS NULL',
      {
        type: QueryTypes.SELECT,
        model: Category,
        mapToModel: true
      }
    );
    res.send(categories);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.getCategoryStatisticsAvgPrice = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      'SELECT c.id, c.name, AVG(p.price) as avg_price FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id, c.name ORDER BY avg_price DESC',
      { type: QueryTypes.SELECT }
    );
    res.send(stats);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findDuplicatesByName = async (_req, res) => {
  try {
    const duplicates = await db.sequelize.query(
      'SELECT name, COUNT(*) as count FROM categories GROUP BY name HAVING COUNT(*) > 1 ORDER BY count DESC',
      { type: QueryTypes.SELECT }
    );
    res.send(duplicates);
  } catch (e) { res.status(500).send({ message: e.message }); }
};