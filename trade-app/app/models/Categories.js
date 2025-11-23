module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    Category.associate = function(models) {
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products'
        });
    };

    return Category;
};
