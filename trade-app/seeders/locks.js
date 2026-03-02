async function demoAccountLock() {
 await sequelize.sync();
 // Создаем или обновляем аккаунт
 await Account.upsert({ id: 1, balance: 100 });
 // Первый транзакционный блок
 const t1 = await sequelize.transaction();
 // Второй транзакционный блок
 const t2 = await sequelize.transaction();
 try {
 // Транзакция T1: блокируем аккаунт для обновления
 console.log('T1: начинаем транзакцию и блокируем аккаунт...');
 const accountT1 = await Account.findByPk(1, {
 lock: t1.LOCK.UPDATE,
 transaction: t1,
 });
 console.log('T1: заблокирован аккаунт. Изменяем баланс...');
 await accountT1.update({ balance: accountT1.balance + 50 }, { transaction: t1 });
 // Запускаем асинхронно T2, которая попытается заблокировать ту же запись
 (async () => {
 console.log('T2: пытаемся заблокировать тот же аккаунт...');
 const accountT2 = await Account.findByPk(1, {
 lock: t2.LOCK.UPDATE,
 transaction: t2,
 });
 console.log('T2: заблокировал аккаунт! Обновляем баланс...');
 await accountT2.update({ balance: accountT2.balance + 25 }, { transaction: t2 });
 await t2.commit();
 console.log('T2: завершила работу и зафиксировала изменения');
 })();
 // Имитация задержки, чтобы T2 успела "подождать"
 await new Promise(res => setTimeout(res, 3000));
 // Завершение T1
 await t1.commit();
 console.log('T1: завершила работу и зафиксировала изменения');
 } catch (err) {
 await t1.rollback();
 await t2.rollback();
 console.error('Ошибка:', err);
 }
 // Проверка итогового баланса
 const account = await Account.findByPk(1);
 console.log('Итоговый баланс:', account.balance);
}
// Запуск
demoAccountLock().catch(console.error);