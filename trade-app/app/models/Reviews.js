module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("reviews", {
        client_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'clients',
                key: 'id'
            }
        },
        product_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        comment: {
            type: Sequelize.TEXT
        }
    });

    Review.associate = function(models) {
        Review.belongsTo(models.Client, {
            foreignKey: 'client_id',
            as: 'client'
        });
        Review.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return Review;
};
    