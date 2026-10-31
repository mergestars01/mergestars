const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');

function fixture(refresh) {
  let rejected;
  let calls = 0;
  let cleared = 0;
  const sessions = [];
  const client = async (config) => ({ config });
  client.interceptors = { request: { use() {} }, response: { use(_ok, fail) { rejected = fail; } } };
  client.post = async () => { calls++; return refresh(); };
  const location = { pathname: '/dashboard', href: '' };
  const store = { accessToken: 'old', setSession: (...args) => sessions.push(args), clearSession: () => { cleared++; } };
  const filename = path.join(__dirname, '../frontend/src/lib/axios.ts');
  const source = fs.readFileSync(filename, 'utf8').replace('import.meta.env.VITE_API_URL', 'undefined');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  vm.runInNewContext(compiled, { exports: {}, window: { location }, require: (name) => {
    if (name === 'axios') return { create: () => client };
    if (name.includes('auth.store')) return { useAuthStore: { getState: () => store } };
    throw new Error(`Unexpected import ${name}`);
  } });
  return { fail: (url = '/orders') => rejected({ config: { url, headers: {} }, response: { status: 401 } }), calls: () => calls, cleared: () => cleared, location, sessions };
}

async function bounded(promise) {
  let timer;
  try { return await Promise.race([promise, new Promise((_ok, fail) => { timer = setTimeout(() => fail(new Error('Refresh deadlocked')), 1000); })]); }
  finally { clearTimeout(timer); }
}

(async () => {
  const success = fixture(async () => ({ data: { data: { accessToken: 'new', user: { id: 'member' } } } }));
  const results = await bounded(Promise.all([success.fail(), success.fail('/wallet')]));
  assert.equal(success.calls(), 1);
  assert.equal(success.sessions.length, 1);
  assert.ok(results.every((r) => r.config.headers.Authorization === 'Bearer new'));

  let failure;
  failure = fixture(async () => failure.fail('/auth/refresh'));
  const failures = await bounded(Promise.allSettled([failure.fail(), failure.fail('/wallet')]));
  assert.ok(failures.every((r) => r.status === 'rejected'));
  assert.equal(failure.calls(), 1);
  assert.equal(failure.location.href, '/login');
  assert.ok(failure.cleared() > 0);

  const empty = fixture(async () => ({ data: { data: { accessToken: null } } }));
  await assert.rejects(bounded(empty.fail()));
  assert.equal(empty.location.href, '/login');

  const login = fixture(async () => { throw new Error('Must not refresh login'); });
  await assert.rejects(login.fail('/auth/login'));
  assert.equal(login.calls(), 0);

  const admin = fixture(async () => { throw new Error('Expired'); });
  admin.location.pathname = '/admin/users';
  await assert.rejects(admin.fail());
  assert.equal(admin.location.href, '/admin/login');
  console.log('PASS: 5 session regression scenarios (concurrent success, recursive failure, empty refresh, login failure, admin redirect).');
})().catch((error) => { console.error(error); process.exitCode = 1; });
