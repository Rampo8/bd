const db = require("../models");
const Product = db.product;

exports.create = async (req, res) => {
    try {
        const data = await Product.create(req.body);
        res.status(201).send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Product.findAll();
        res.send(data);
    } catch (e) { res.status(500).send({ message: e.message }); }
};
exports.getAllWithPager = async (req, res) => {
  const size = parseInt(req.query.size) || 10;
  const page = parseInt(req.query.page) || 0;
  try {
    const data = await Product.findAll({ limit: size, offset: page * size });
    res.send(data);
  } catch (e) { res.status(500).send({ message: e.message }); }
};
exports.findOne = async (req, res) => {
    try {
        const item = await Product.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.update = async (req, res) => {
    try {
        const result = await Product.update(req.body, { where: { id: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.delete = async (req, res) => {
    try {
        const result = await Product.destroy({ where: { id: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { res.status(500).send({ message: e.message }); }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Product.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { res.status(500).send({ message: e.message }); }
};
exports.getCategoryName = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.sequelize.query(
      'SELECT c.name FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE p.id = :id',
      {
        replacements: { id: id },
        type: QueryTypes.SELECT
      }
    );
    res.send({ name: result[0] ? result[0].name : 'NO_NAME_ERROR' });
  } catch (e) {
    res.status(500).send({ message: e.message || "Some error occurred while getting category name." });
  }
};

// Получить всю запись о категории для товара
exports.getCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.sequelize.query(
      'SELECT c.* FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE p.id = :id',
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
        model: db.category,
        mapToModel: true
      }
    );
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send({ message: "Category not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message || "Some error occurred while getting category." });
  }
};