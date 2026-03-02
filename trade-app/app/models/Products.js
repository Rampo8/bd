module.exports = (sequelize, Sequelize) => {
  const product = sequelize.define("products", {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    price: { type: Sequelize.FLOAT, allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    category_id: { type: Sequelize.INTEGER, references: { model: 'categories', key: 'id' } }
  });
  product.associate = function(models) {
    product.belongsTo(models.category, { foreignKey: 'category_id', as: 'category' });
    product.hasMany(models.review, { foreignKey: 'product_id', as: 'reviews' });
    product.hasMany(models.orderItem, { foreignKey: 'product_id', as: 'orderItems' });
  };
  return product;
};