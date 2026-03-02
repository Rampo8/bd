const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb');
const Account = sequelize.define('Account', {
 balance: {
 type: DataTypes.INTEGER,
 allowNull: false,
 defaultValue: 0,
 },
});
async function transactionConflict(level) {
 // Уровень изоляции передается как параметр
 const t1 = await sequelize.transaction({
 isolationLevel: level
 });
 const t2 = await sequelize.transaction({
 isolationLevel: level
 });
 try {
 // Трансакция 1: читаем баланс, увеличиваем
 const account1 = await Account.findByPk(1, { transaction: t1, lock: t1.LOCK.UPDATE });
 console.log(`Транзакция 1: баланс до изменения = ${account1.balance}`);
 await new Promise(res => setTimeout(res, 200)); // задержка для демонстрации конфликта
 account1.balance += 100;
 await account1.save({ transaction: t1 });
 await t1.commit();
 console.log('Транзакция 1 завершена');
 } catch (err) {
 await t1.rollback();
 console.log('Транзакция 1 откатила:', err.message);
 }
 try {
 // Трансакция 2: тоже читаем баланс, увеличиваем
 const account2 = await Account.findByPk(1, { transaction: t2, lock: t2.LOCK.UPDATE });
 console.log(`Транзакция 2: баланс до изменения = ${account2.balance}`);
 account2.balance += 50;
 await account2.save({ transaction: t2 });
 await t2.commit();
 console.log('Транзакция 2 завершена');
 } catch (err) {
 await t2.rollback();
 console.log('Транзакция 2 откатила:', err.message);
 }
}
async function main() {
 await sequelize.sync({ force: true });
 await Account.create({ id: 1, balance: 1000 });

 // Варианты уровней изоляции
 // READ COMMITTED, REPEATABLE READ, SERIALIZABLE
 await transactionConflict(sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED);
 }