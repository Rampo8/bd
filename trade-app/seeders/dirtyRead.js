const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb');
const Account = sequelize.define('Account', {
 balance: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
});
async function dirtyReadDemo(isolationLevel) {
 await sequelize.sync({ force: true });
 await Account.create({ id: 1, balance: 1000 });
 // Начинаем транзакцию t1, которая изменит баланс, но не коммитит
 const t1 = await sequelize.transaction({ isolationLevel });
 // Меняем в t1, но не коммитим сразу
 const accInT1 = await Account.findByPk(1, { transaction: t1 });
 await accInT1.update({ balance: 500 }, { transaction: t1 });
 console.log(`t1: изменил баланс на 500, ещё не коммитил`);
 // Параллельно транзакция t2 пытается прочесть баланс
 const t2 = await sequelize.transaction({ isolationLevel });
 const accInT2 = await Account.findByPk(1, { transaction: t2 });
 console.log(`t2: прочитал баланс = ${accInT2.balance} (ожидается 1000, тк t1 не
коммитил)`);
 await t2.commit();
 // Завершаем t1 с коммитом
 await t1.commit();
 console.log(`t1: зафиксировал изменения`);
 // Проверим итоговое значение вне транзакций
 const accFinal = await Account.findByPk(1);
 console.log(`финальный баланс: ${accFinal.balance}`);
}
(async () => {
 console.log('---- Демонстрация с READ COMMITTED ----');
 await dirtyReadDemo(Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED);
 console.log('\n---- Демонстрация с REPEATABLE READ ----');
 await dirtyReadDemo(Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ);
})();