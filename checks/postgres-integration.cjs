// Runs only against a dedicated disposable PostgreSQL test database.
const assert = require('node:assert/strict');
const path = require('node:path');
if (process.env.RUN_DATABASE_CHECKS !== 'true' || !/test/i.test(process.env.DB_NAME || '')) {
  throw new Error('Set RUN_DATABASE_CHECKS=true and DB_NAME to a dedicated test database.');
}
const base = path.join(__dirname, '../backend');
require(path.join(base, 'node_modules/ts-node')).register({ project: path.join(base, 'tsconfig.json'), transpileOnly: true });
const ds = require(path.join(base, 'src/database/data-source')).default;
const { User, CoinApplication, Order, WalletTransaction } = require(path.join(base, 'src/database/entities'));
const { WalletService } = require(path.join(base, 'src/modules/wallet/wallet.service'));
const { OrdersService } = require(path.join(base, 'src/modules/orders/orders.service'));
const { AuthService } = require(path.join(base, 'src/modules/auth/auth.service'));

(async () => {
  await ds.initialize();
  try {
    await ds.runMigrations();
    assert.equal((await ds.runMigrations()).length, 0, 'Migrations must be repeatable');
    for (const meta of ds.entityMetadatas) {
      const columns = await ds.query('SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2', ['public', meta.tableName]);
      for (const column of meta.columns) assert.ok(columns.some((c) => c.column_name === column.databaseName), `${meta.tableName}.${column.databaseName} missing`);
    }
    const users = ds.getRepository(User);
    const auth = Object.assign(Object.create(AuthService.prototype), { users });
    const seed = Date.now();
    const members = await Promise.all(['buyer', 'author'].map((name) => auth.createMember({
      email: `${name}-${seed}@example.test`, passwordHash: 'test-only', firstName: name, lastName: 'Test', status: 'active', roles: ['user'],
    })));
    const [buyer, author] = members;
    assert.notEqual(buyer.mergeId, author.mergeId, 'Concurrent registrations must have distinct IDs');
    const wallet = new WalletService(ds.getRepository(WalletTransaction), users, ds, { create: async () => undefined });
    await Promise.all([wallet.credit({ userId: buyer.id, amount: 100, reason: 'test' }), wallet.credit({ userId: buyer.id, amount: 100, reason: 'test' })]);
    assert.equal(await wallet.getBalance(buyer.id), 200, 'Concurrent first credits must serialize');
    const apps = ds.getRepository(CoinApplication);
    const app = await apps.save(apps.create({ publicId: `TEST-${seed}`, userId: buyer.id, coinType: 'silver', metalType: 'silver', quantity: 1, metalPurity: 999, coinValue: 100, priceQuotedAt: new Date(), status: 'approved', designAuthorId: author.id }));
    const orders = new OrdersService(ds.getRepository(Order), apps, wallet, ds);
    // Public legacy payment endpoints remain closed until CORE has a verified offer.
    for (const method of ['earnings', 'bank']) {
      await assert.rejects(orders.createForApplication(buyer, app.publicId, method), /Verified Brand House offer/);
    }
    await assert.rejects(orders.markOrderPaid('unverified'), /Verified Brand House offer/);
    assert.equal(await wallet.getBalance(buyer.id), 200, 'Rejected payments must not debit the wallet');
    assert.equal(await ds.getRepository(Order).countBy({ applicationId: app.id }), 0);

    // Exercise the existing ledger methods with a fixture in this disposable DB,
    // rather than removing or bypassing the public payment gate.
    const orderRepository = ds.getRepository(Order);
    const paidFixture = await orderRepository.save(orderRepository.create({
      publicId: `LEDGER-${seed}`, applicationId: app.id, userId: buyer.id,
      amount: '100', paymentMethod: 'earnings', status: 'paid',
    }));
    const settleFixture = () => ds.transaction(async manager => {
      await wallet.lockUsers(manager, [buyer.id, author.id]);
      await wallet.debitForOrder({ userId: buyer.id, amount: 100, orderId: paidFixture.id, note: 'Disposable ledger fixture' }, manager);
      await orders.creditDesignRoyalty(paidFixture, app, manager);
    });
    await Promise.all([settleFixture(), settleFixture()]);
    assert.equal(await wallet.getBalance(buyer.id), 100, 'Repeated settlement must debit once');
    assert.equal(await wallet.getBalance(author.id), 50, 'Repeated royalty must credit once');

    const failingApp = await apps.save(apps.create({ ...app, id: undefined, publicId: `FAIL-${seed}` }));
    const failureWallet = Object.create(wallet);
    failureWallet.credit = async () => { throw new Error('Injected royalty failure'); };
    const failingOrders = new OrdersService(orderRepository, apps, failureWallet, ds);
    await assert.rejects(ds.transaction(async manager => {
      await wallet.lockUsers(manager, [buyer.id, author.id]);
      const repository = manager.getRepository(Order);
      const fixture = await repository.save(repository.create({
        publicId: `ROLLBACK-${seed}`, applicationId: failingApp.id, userId: buyer.id,
        amount: '100', paymentMethod: 'earnings', status: 'paid',
      }));
      await wallet.debitForOrder({ userId: buyer.id, amount: 100, orderId: fixture.id }, manager);
      await failingOrders.creditDesignRoyalty(fixture, failingApp, manager);
    }), /Injected royalty failure/);
    assert.equal(await wallet.getBalance(buyer.id), 100, 'Failed royalty must roll back debit');
    assert.equal(await wallet.getBalance(author.id), 50, 'Failed royalty must not change author balance');
    assert.equal(await orderRepository.countBy({ applicationId: failingApp.id }), 0);
    console.log('PASS: PostgreSQL migrations, schema columns, concurrent registration and wallet credits, closed payment gates, idempotent ledger settlement and rollback.');
  } finally { await ds.destroy(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
