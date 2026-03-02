const db = require("../models");
const Order = db.order;
const OrderItem = db.orderItem;   // ← убедись, что модель называется именно так

// =============================================
// СОЗДАНИЕ ЗАКАЗА С ТРАНЗАКЦИЕЙ
// =============================================
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { client_id, status = "pending", items } = req.body;

    // Валидация
    if (!client_id) {
      await transaction.rollback();
      return res.status(400).send({ message: "client_id обязателен" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).send({ message: "items обязателен и должен быть массивом с хотя бы одним товаром" });
    }

    // 1. Создаём сам заказ
    const order = await Order.create({
      client_id,
      status
    }, { transaction });

    // 2. Подготавливаем позиции
    const orderItemsData = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price || 0
    }));

    // 3. Создаём все позиции заказа за один раз
    await OrderItem.bulkCreate(orderItemsData, { transaction });

    // ← Здесь можно добавить уменьшение stock у товаров (раскомментируй если нужно)
    /*
    for (const item of items) {
      await db.product.decrement('stock', {
        by: item.quantity,
        where: { id: item.product_id },
        transaction
      });
    }
    */

    await transaction.commit();

    // Возвращаем полный заказ со всеми товарами
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ 
        model: OrderItem, 
        as: "orderItems"   // ← поменяй на свой alias, если другой
      }]
    });

    res.status(201).send(fullOrder);

  } catch (error) {
    await transaction.rollback();
    console.error("❌ Ошибка создания заказа:", error);
    res.status(500).send({ 
      message: "Не удалось создать заказ",
      error: error.message 
    });
  }
};

// =============================================
// ОСТАЛЬНЫЕ МЕТОДЫ (улучшил с include для удобства)
// =============================================
exports.findAll = async (_req, res) => {
  try {
    const data = await Order.findAll({
      include: [{ model: OrderItem, as: "orderItems" }]
    });
    res.send(data);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.findOne = async (req, res) => {
  try {
    const item = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "orderItems" }]
    });
    item ? res.send(item) : res.status(404).send({ message: "Заказ не найден" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const result = await Order.update(req.body, { where: { id: req.params.id } });
    result[0] 
      ? res.send({ message: "Заказ обновлён" }) 
      : res.status(404).send({ message: "Заказ не найден" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Order.destroy({ where: { id: req.params.id } });
    result 
      ? res.send({ message: "Заказ удалён" }) 
      : res.status(404).send({ message: "Заказ не найден" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.deleteAll = async (_req, res) => {
  try {
    const count = await Order.destroy({ where: {}, truncate: false });
    res.send({ message: `${count} заказов удалено` });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};