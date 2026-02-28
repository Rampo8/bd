const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb');
const Item = sequelize.define('Item', {
 name: DataTypes.STRING,
});
async function phantomReadDemo() {
 await sequelize.sync({ force: true });
 // Создаем начальные данные
 await Item.bulkCreate([
 { name: 'Item1' },
 { name: 'Item2' },
 ]);
 // Транзакция Т1
 const t1 = await sequelize.transaction({
 isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
 });
 // Транзакция Т2
 const t2 = await sequelize.transaction({
 isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
 });
 try {
 // Транзакция Т1: первый подсчет
 const count1 = await Item.count({ transaction: t1 });
 console.log(`Транзакция Т1: первый подсчет = ${count1}`);
 // Транзакция Т2: добавляет новую запись
 await Item.create({ name: 'Item3' }, { transaction: t2 });
 await t2.commit();
 console.log('Транзакция Т2: добавила Item3 и зафиксировала');
 // Транзакция Т1: второй подсчет
 const count2 = await Item.count({ transaction: t1 });
 console.log(`Транзакция Т1: второй подсчет = ${count2}`);
 await t1.commit();
 } catch (err) {
 await t1.rollback();
 await t2.rollback();
 throw err;
 }
}
phantomReadDemo();