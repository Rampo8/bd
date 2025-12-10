module.exports = (sequelize, Sequelize) => {
  const PaymentMethod = sequelize.define("payment_methods", {
    client_id: { type: Sequelize.INTEGER, references: { model: 'clients', key: 'id' } },
    type: { type: Sequelize.STRING, allowNull: false },
    provider: { type: Sequelize.STRING, allowNull: false },
    account_number: { type: Sequelize.STRING, allowNull: false }
  });
  PaymentMethod.associate = function(models) {
    PaymentMethod.belongsTo(models.client, { foreignKey: 'client_id', as: 'client' });
  };
  return PaymentMethod;
};