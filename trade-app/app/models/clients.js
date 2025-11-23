module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("clients", {
        full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        referred_by_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'clients', 
                key: 'id'
            }
        }
    });

    Client.associate = function(models) {
        Client.belongsTo(Client, {
            foreignKey: 'referred_by_id',
            as: 'referredBy'
        });
        Client.hasMany(Client, {
            foreignKey: 'referred_by_id',
            as: 'referrals'
        });
    };

    return Client;
};