module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("clients", {
    full_name: { type: Sequelize.STRING, allowNull: false },
    phone_number: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    referred_by_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'clients', key: 'id' } }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: false
  });
  Client.associate = function(models) {
    Client.hasMany(models.address, { foreignKey: 'client_id', as: 'addresses' });
    Client.hasMany(models.order, { foreignKey: 'client_id', as: 'orders' });
    Client.hasMany(models.paymentMethod, { foreignKey: 'client_id', as: 'paymentMethods' });
    Client.hasMany(models.review, { foreignKey: 'client_id', as: 'reviews' });
  };
  return Client;
};