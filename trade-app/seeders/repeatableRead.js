const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb');
const Account = sequelize.define('Account', {
 balance: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
});
async function nonRepeatableReadDemo() {
 await sequelize.sync({ force: true });
 await Account.create({ id: 1, balance: 1000 });
 // Транзакция А
 const tA = await sequelize.transaction({ isolationLevel:
Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED });
 // Транзакция B
 const tB = await sequelize.transaction({ isolationLevel:
Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED });
 // Транзакция А: Первый читает баланс
 const accA1 = await Account.findByPk(1, { transaction: tA });
 console.log(`Транзакция А: первый раз прочитано баланс = ${accA1.balance}`);
 // Транзакция B: изменяет баланс
 const accB = await Account.findByPk(1, { transaction: tB });
 await accB.update({ balance: 500 }, { transaction: tB });
 await tB.commit();
 console.log('Транзакция B: изменил баланс на 500 и зафиксировал');
 // Транзакция А: читает баланс снова
 const accA2 = await Account.findByPk(1, { transaction: tA });
 console.log(`Транзакция А: второй раз прочитано баланс = ${accA2.balance}`);
 await tA.commit();
 // Итог
 const finalAcc = await Account.findByPk(1);
 console.log(`Финальный баланс: ${finalAcc.balance}`);
}
nonRepeatableReadDemo();