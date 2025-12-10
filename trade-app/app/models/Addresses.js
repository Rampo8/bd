'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // Пример правильной ассоциации:
      // Address.belongsTo(models.User, {
      //   foreignKey: 'user_id',
      //   as: 'user'
      // });
      
      // ИЛИ для связи с моделью Client:
      Address.belongsTo(models.Client, {
        foreignKey: 'client_id',
        as: 'client'
      });
      
      // Если вы используете другую модель, убедитесь, что имя точно совпадает
      // с именем в объекте db:
      // console.log(Object.keys(models)); // для отладки
    }
  }
  
  Address.init({
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    country: DataTypes.STRING,
    // Добавьте остальные поля вашей модели
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true
  });
  
  return Address;
};