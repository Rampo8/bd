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
    }, {
        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ:
        timestamps: true, // Включаем автоматические поля
        createdAt: 'createdAt', // Явно указываем имена
        updatedAt: 'updatedAt',
        underscored: false // Используем camelCase
    });

    // Ассоциации переносим в models/index.js
    return Client;
};