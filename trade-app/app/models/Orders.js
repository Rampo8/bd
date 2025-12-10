module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    client_id: { type: Sequelize.INTEGER, references: { model: 'clients', key: 'id' } },
    total_amount: { type: Sequelize.FLOAT, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false }
  });
  Order.associate = function(models) {
    Order.belongsTo(models.client, { foreignKey: 'client_id', as: 'client' });
    Order.hasMany(models.orderItem, { foreignKey: 'order_id', as: 'orderItems' });
  };
  return Order;
};