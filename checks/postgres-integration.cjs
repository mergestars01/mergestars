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
    const results = await Promise.all([orders.createForApplication(buyer, app.publicId, 'earnings'), orders.createForApplication(buyer, app.publicId, 'earnings')]);
    assert.equal(results[0].id, results[1].id, 'Duplicate payments must return the same order');
    assert.equal(await wallet.getBalance(buyer.id), 100);
    assert.equal(await wallet.getBalance(author.id), 50);

    const failingApp = await apps.save(apps.create({ ...app, id: undefined, publicId: `FAIL-${seed}` }));
    const failureWallet = Object.create(wallet);
    failureWallet.credit = async () => { throw new Error('Injected royalty failure'); };
    const failingOrders = new OrdersService(ds.getRepository(Order), apps, failureWallet, ds);
    await assert.rejects(failingOrders.createForApplication(buyer, failingApp.publicId, 'earnings'), /Injected royalty failure/);
    assert.equal(await wallet.getBalance(buyer.id), 100, 'Failed royalty must roll back debit');
    assert.equal(await ds.getRepository(Order).countBy({ applicationId: failingApp.id }), 0);
    console.log('PASS: PostgreSQL migrations, schema columns, concurrent registration and wallet credits, duplicate payment and rollback.');
  } finally { await ds.destroy(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
