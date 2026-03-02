// В файле app/controllers/Order.controller.js
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { client_id, status = "pending", items } = req.body;

    console.log("📥 Получено тело запроса:", JSON.stringify(req.body, null, 2));

    if (!client_id || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).send({ message: "client_id и items[] обязательны" });
    }

    // Создаём заказ
    const order = await Order.create({ client_id, status }, { transaction });
    console.log("✅ Заказ создан, id =", order.id);

    // Подготовка позиций
    const orderItemsData = items.map((item, index) => {
      console.log(`📦 Позиция ${index + 1}:`, item);
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,      // ← точно эти поля
        price: item.price || 0
      };
    });

    // Создаём позиции
    await db.orderItem.bulkCreate(orderItemsData, { 
      transaction,
      fields: ['order_id', 'product_id', 'quantity', 'price']   // ← защита от лишних полей
    });

    await transaction.commit();

    // Возвращаем полный заказ
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: db.orderItem, as: 'orderItems' }]
    });

    console.log("🎉 Заказ успешно создан!");
    res.status(201).send(fullOrder);

  } catch (error) {
    await transaction.rollback();
    console.error("❌ ОШИБКА создания заказа:", error.message);
    console.error("Полный стек:", error.stack);
    res.status(500).send({ 
      message: "Не удалось создать заказ", 
      error: error.message 
    });
  }
};