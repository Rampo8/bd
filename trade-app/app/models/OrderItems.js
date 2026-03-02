module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("order_items", {
    order_id: { type: Sequelize.INTEGER, references: { model: 'orders', key: 'id' } },
    product_id: { type: Sequelize.INTEGER, references: { model: 'products', key: 'id' } },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false }
  });
 OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.order, {
      foreignKey: 'order_id',
      as: 'order'           // ← оставляем этот alias
    });

    // Если есть связь с Product — она должна иметь ДРУГОЙ alias
    OrderItem.belongsTo(models.product, {
      foreignKey: 'product_id',
      as: 'product'         // ← другой alias!
    });
  };

  return OrderItem;
};