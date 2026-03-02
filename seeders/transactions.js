const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with your database connection details
const sequelize = new Sequelize({
  dialect: 'postgres', // Specify your database dialect
  username: 'postgres', // Replace with your database username
  password: '12345', // Replace with your database password
  database: 'transaction-db', // Replace with your database name
  host: 'localhost', // Replace with your database host
  port: 5432, // Replace with your database port
});
// Define the Product model
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
}, {
  // Other model options
});
// Create a transaction
sequelize.transaction(async (t) => {
  try {
    // Create two products within the transaction
    const product1 = await Product.create({ name: 'Product 1', price: 19.99 }, { transaction: t });
  } catch (error) {
    // Handle error
  }
});
sequelize.transaction(async (t) => {
  try {
    const product2 = await Product.create({ name: 'Product 2', price: 29.99 }, { transaction: t });
    // Commit the transaction if everything is successful
    await t.commit();
    console.log('Transaction committed successfully.');
  } catch (error) {
    // Rollback the transaction if an error occurs
    await t.rollback();
    console.error('Transaction rolled back due to an error:', error);
  }
}).catch(error => {
  console.error('Transaction failed to initialize:', error);
}).finally(() => {
  // Close the database connection
  sequelize.close();
});