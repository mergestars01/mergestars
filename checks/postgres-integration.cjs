// Runs only against a dedicated disposable PostgreSQL test database.
const assert = require('node:assert/strict');
const path = require('node:path');
const base = path.join(__dirname, '../backend');
require(path.join(base, 'node_modules/ts-node')).register({
  project: path.join(base, 'tsconfig.json'),
  transpileOnly: true,
});
const ds = require(path.join(base, 'src/database/data-source')).default;
const database = ds.options.url
  ? decodeURIComponent(new URL(ds.options.url).pathname.slice(1))
  : ds.options.database;
if (process.env.RUN_DATABASE_CHECKS !== 'true' || !/^[a-z0-9_]+_test$/i.test(database || '')) {
  throw new Error('Set RUN_DATABASE_CHECKS=true and use a disposable database ending in _test.');
}
const { User, CoinApplication, Order, WalletTransaction } = require(
  path.join(base, 'src/database/entities'),
);
const { WalletService } = require(path.join(base, 'src/modules/wallet/wallet.service'));
const { OrdersController } = require(path.join(base, 'src/modules/orders/orders.controller'));
const { OrdersService } = require(path.join(base, 'src/modules/orders/orders.service'));
const { AuthService } = require(path.join(base, 'src/modules/auth/auth.service'));

(async () => {
  await ds.initialize();
  try {
    assert.ok(ds.migrations.length >= 14, 'Migrations must load from the repository root');
    await ds.runMigrations();
    assert.equal((await ds.runMigrations()).length, 0, 'Migration retry must be a no-op');
    for (const meta of ds.entityMetadatas) {
      const columns = await ds.query(
        'SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2',
        ['public', meta.tableName],
      );
      for (const column of meta.columns) {
        assert.ok(columns.some((c) => c.column_name === column.databaseName),
          `${meta.tableName}.${column.databaseName} missing`);
      }
    }
    const users = ds.getRepository(User);
    const auth = Object.assign(Object.create(AuthService.prototype), { users });
    const seed = Date.now();
    const [buyer, author] = await Promise.all(['buyer', 'author'].map((name) => auth.createMember({
      email: `${name}-${seed}@example.test`, passwordHash: 'test-only',
      firstName: name, lastName: 'Test', status: 'active', roles: ['user'],
    })));
    assert.notEqual(buyer.mergeId, author.mergeId, 'Concurrent registrations must have distinct IDs');
    const records = ds.getRepository(WalletTransaction);
    const wallet = new WalletService(records);
    await records.save(records.create({
      userId: buyer.id, type: 'credit', amount: 200, balanceAfter: 200, reason: 'historical_fixture',
    }));
    const before = await wallet.getMe(buyer.id);
    assert.equal(before.balance, 200);
    assert.equal(before.readOnly, true);
    const apps = ds.getRepository(CoinApplication);
    const application = await apps.save(apps.create({
      publicId: `TEST-${seed}`, userId: buyer.id, coinType: 'silver', metalType: 'silver',
      quantity: 1, metalPurity: 999, coinValue: 100, priceQuotedAt: new Date(),
      status: 'approved', designAuthorId: author.id,
    }));
    const orderRecords = ds.getRepository(Order);
    const orders = new OrdersController(new OrdersService(orderRecords));
    assert.throws(() => orders.create(), /locked CORE pricing snapshot/);
    assert.deepEqual(await wallet.getMe(buyer.id), before);
    assert.equal((await wallet.getMe(author.id)).transactions.length, 0);
    assert.equal(await orderRecords.countBy({ applicationId: application.id }), 0);
    console.log('PASS: PostgreSQL migrations, catalogued columns, concurrent registration, read-only ledger and rejected legacy orders.');
  } finally {
    await ds.destroy();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
