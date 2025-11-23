module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            }
        }
    });

    Product.associate = function(models) {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
        Product.hasMany(models.Review, {
            foreignKey: 'product_id',
            as: 'reviews'
        });
        Product.hasMany(models.OrderItem, {
            foreignKey: 'product_id',
            as: 'orderItems'
        });
    };

    return Product;
};
