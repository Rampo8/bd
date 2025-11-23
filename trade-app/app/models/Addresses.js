module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define("addresses", {
        client_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'clients',
                key: 'id'
            }
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        postal_code: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    Address.associate = function(models) {
        Address.belongsTo(models.Client, {
            foreignKey: 'client_id',
            as: 'client'
        });
    };

    return Address;
};
