/* Disposable local PostgreSQL only. Real Nest JWT/RBAC + real migrations; no external providers. */
const path = require("node:path");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const fs = require("node:fs");
const root = path.resolve(__dirname, "..");
const load = (name) => require(path.join(root, "backend/node_modules", name));
require(path.join(root, "backend/node_modules/reflect-metadata"));
const { DataSource } = load("typeorm");
const { Test } = load("@nestjs/testing");
const { PassportModule } = load("@nestjs/passport");
const { JwtService } = load("@nestjs/jwt");
const { getRepositoryToken } = load("@nestjs/typeorm");
const request = load("supertest");
const {
  entities,
  User,
  BrandLineProfile,
  CatalogCollection,
  CatalogItem,
  Order,
  WalletTransaction,
} = require("../backend/dist/database/entities");
const { RfqService } = require("../backend/dist/modules/rfq/rfq.service");
const { RfqController } = require("../backend/dist/modules/rfq/rfq.controller");
const { JwtStrategy } = require("../backend/dist/modules/auth/jwt.strategy");
const {
  JwtAuthGuard,
} = require("../backend/dist/common/guards/jwt-auth.guard");
const { RolesGuard } = require("../backend/dist/common/guards/roles.guard");
const { WalletController } = require("../backend/dist/modules/wallet/wallet.controller");
const { WalletService } = require("../backend/dist/modules/wallet/wallet.service");
const { OrdersController } = require("../backend/dist/modules/orders/orders.controller");
const { OrdersService } = require("../backend/dist/modules/orders/orders.service");
const {
  TransformInterceptor,
} = require("../backend/dist/common/interceptors/transform.interceptor");
const { BrandService } = require("../backend/dist/modules/brand/brand.service");
const {
  ExperienceController,
} = require("../backend/dist/modules/experience/experience.controller");
const {
  ExperienceService,
} = require("../backend/dist/modules/experience/experience.service");
const {
  FitProfile,
  DesignProposal,
  ProductInteraction,
} = require("../backend/dist/modules/experience/experience.entity");
const {
  UniversalRfq1794132000000,
} = require("../backend/dist/database/migrations/1794132000000-UniversalRfq");

async function main() {
  // These constants deliberately cannot point to a production database.
  process.env.NODE_ENV = "test";
  process.env.RFQ_ENABLED = "true";
  process.env.JWT_SECRET =
    "local-disposable-r71-fixture-key-not-a-production-secret";
  const db = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 55471,
    username: "r71_local_test",
    password: "local-fixture-only",
    database: "r71_disposable_test",
    entities,
    migrations: [path.join(root, "backend/dist/database/migrations/*.js")],
    synchronize: false,
  });
  await db.initialize();
  const tables = await db.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public'",
  );
  assert.equal(
    tables.length,
    0,
    "Test requires a new empty disposable database; it never drops an existing database",
  );
  await db.runMigrations();
  const migration = new UniversalRfq1794132000000();
  const qr = db.createQueryRunner();
  await migration.down(qr);
  await migration.up(qr);
  await qr.release();
  const users = {};
  for (const [name, roles] of Object.entries({
    owner: ["user"],
    other: ["user"],
    staff: ["manager"],
    manufacturer: ["manufacturer"],
    outsider: ["manufacturer"],
    legacy: ["user"],
  })) {
    users[name] = await db.manager.save(
      User,
      db.manager.create(User, {
        id: randomUUID(),
        email: `${name}@r71-fixture.invalid`,
        passwordHash: "NOT_A_REAL_LOGIN",
        firstName: name,
        lastName: "Synthetic fixture",
        mergeId: `TEST-${name}`,
        roles,
        status: "active",
        kycStatus: name === "other" ? "pending" : "verified",
      }),
    );
  }
  const legacyHouse = await db.manager.save(
    BrandLineProfile,
    db.manager.create(BrandLineProfile, {
      userId: users.legacy.id,
      name: "Existing public fixture",
      visibility: "PUBLIC",
    }),
  );
  const legacyOrder = await db.manager.save(
    Order,
    db.manager.create(Order, {
      publicId: "TEST-HISTORICAL",
      userId: users.legacy.id,
      amount: 77.77,
      paymentMethod: "bank",
      status: "paid",
      deliveryStatus: "pending",
    }),
  );
  const historical = JSON.stringify(
    await db.manager.findOneByOrFail(Order, { id: legacyOrder.id }),
  );
  const builder = Test.createTestingModule({
    imports: [PassportModule],
    controllers: [RfqController, ExperienceController, WalletController, OrdersController],
    providers: [
      RfqService,
      ExperienceService,
      JwtStrategy,
      JwtAuthGuard,
      RolesGuard,
      BrandService,
      WalletService,
      OrdersService,
      { provide: DataSource, useValue: db },
      ...[
        User,
        BrandLineProfile,
        CatalogCollection,
        CatalogItem,
        FitProfile,
        DesignProposal,
        ProductInteraction,
        Order,
        WalletTransaction,
      ].map((entity) => ({
        provide: getRepositoryToken(entity),
        useValue: db.getRepository(entity),
      })),
    ],
  });
  const module = await builder.compile();
  const app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix("api");
  let sessions;
  if (process.argv.includes("--serve"))
    app
      .getHttpAdapter()
      .get("/api/qa/sessions", (_req, res) => res.json(sessions));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.init();
  const jwt = new JwtService({ secret: process.env.JWT_SECRET });
  sessions = Object.fromEntries(
    Object.entries(users).map(([name, user]) => [
      name,
      {
        user,
        token: jwt.sign(
          { sub: user.id, email: user.email },
          { expiresIn: "2h" },
        ),
      },
    ]),
  );
  const api = (role, method, url) =>
    request(app.getHttpServer())
      [method](`/api${url}`)
      .set("Authorization", `Bearer ${sessions[role].token}`);
  const checks = [];
  async function check(name, run) {
    await run();
    checks.push({ name, status: "PASS" });
  }
  const details = {
    industry: "FASHION_LUXURY",
    category: "Smart eyewear",
    title: "Private custom eyewear",
    requestedBrand: "Meta",
    referenceProduct: "Reference only",
    referenceUrl: "https://example.com/model",
    material: "Composite — technical review required",
    finishes: "black",
    mosaic: "selective silver",
    dimensions: "pending fit review",
    quantity: 1,
    countryCode: "GE",
    city: "Tbilisi",
    specifications: { electronics: "manufacturer to confirm" },
  };
  let draft, staffFile, responseFile, offer;
  await check("Empty-schema migration up/down/up", async () =>
    assert.equal(
      (await db.query("SELECT count(*)::int AS n FROM brand_rfqs"))[0].n,
      0,
    ),
  );
  await check("Unauthenticated request denied by real JWT guard", async () =>
    request(app.getHttpServer()).post("/api/rfqs").send(details).expect(401),
  );
  await check("Wallet credits are retired and legacy paid paths cannot write", async () => {
    await db.manager.insert(WalletTransaction, {
      userId: users.owner.id, type: "credit", amount: 7, balanceAfter: 7,
      reason: "historical_fixture",
    });
    const history = (await api("owner", "get", "/wallet/me").expect(200)).body.data;
    assert.equal(history.readOnly, true);
    assert.equal(history.balance, 7);
    await api("owner", "post", "/admin/wallet/credit").send({ amount: 5 }).expect(403);
    await api("staff", "post", "/admin/wallet/credit").send({ amount: 5 }).expect(410);
    for (const paymentMethod of ["bank", "full", "earnings"]) {
      await api("owner", "post", "/orders")
        .send({ applicationId: "legacy", paymentMethod }).expect(400);
    }
    assert.deepEqual((await api("owner", "get", "/wallet/me").expect(200)).body.data, history);
  });
  await check("Forged owner, state and offer inputs rejected", async () =>
    api("owner", "post", "/rfqs")
      .set("Idempotency-Key", randomUUID())
      .send({
        ...details,
        ownerId: users.other.id,
        status: "PAID",
        verifiedOffer: true,
      })
      .expect(400),
  );
  const key = randomUUID();
  await check(
    "Ten simultaneous retries create one RFQ, one House and one design version",
    async () => {
      const responses = await Promise.all(
        Array.from({ length: 10 }, () =>
          api("owner", "post", "/rfqs")
            .set("Idempotency-Key", key)
            .send(details)
            .expect(201),
        ),
      );
      draft = responses[0].body.data;
      assert.equal(new Set(responses.map((r) => r.body.data.id)).size, 1);
      assert.equal(
        await db.manager.countBy(BrandLineProfile, { userId: users.owner.id }),
        1,
      );
      assert.equal(
        (
          await db.query(
            "SELECT count(*)::int AS n FROM design_proposals WHERE creator_id=$1",
            [users.owner.id],
          )
        )[0].n,
        1,
      );
      assert.equal(
        (
          await db.manager.findOneByOrFail(BrandLineProfile, {
            userId: users.owner.id,
          })
        ).visibility,
        "PRIVATE",
      );
    },
  );
  await check("Idempotency key reuse with different payload fails", async () =>
    api("owner", "post", "/rfqs")
      .set("Idempotency-Key", key)
      .send({ ...details, quantity: 2 })
      .expect(409),
  );
  await check(
    "Private houses excluded from public listing and direct profile",
    async () => {
      const brand = module.get(BrandService);
      assert(
        !(await brand.listPublicBrands()).some(
          (b) => b.mergeId === users.owner.mergeId,
        ),
      );
      assert(
        (await brand.listPublicBrands()).some(
          (b) => b.mergeId === users.legacy.mergeId,
        ),
      );
      await assert.rejects(brand.getPublicProfile(users.owner.mergeId));
    },
  );
  await check(
    "Other customers cannot read, submit or download this RFQ",
    async () => {
      await api("other", "get", `/rfqs/${draft.id}`).expect(404);
      await api("other", "post", `/rfqs/${draft.id}/submit`)
        .send({ rightsDeclaration: true, sharingConsent: true })
        .expect(404);
    },
  );
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/ld8AAAAASUVORK5CYII=",
    "base64",
  );
  await check(
    "Private image upload works; active content masquerading as image fails",
    async () => {
      const response = await api(
        "owner",
        "post",
        `/rfqs/${draft.id}/files/REFERENCE`,
      )
        .attach("file", png, {
          filename: "reference.png",
          contentType: "image/png",
        })
        .expect(201);
      const file = response.body.data.files[0];
      await api("owner", "get", `/rfqs/${draft.id}/files/${file.id}`)
        .expect(200)
        .expect("Cache-Control", "private, no-store");
      await api("other", "get", `/rfqs/${draft.id}/files/${file.id}`).expect(
        404,
      );
      await api("owner", "post", `/rfqs/${draft.id}/files/REFERENCE`)
        .attach("file", Buffer.from("<script>alert(1)</script>"), {
          filename: "fake.png",
          contentType: "image/png",
        })
        .expect(400);
    },
  );
  await check(
    "Explicit sharing and rights consent required; submit retries create one event",
    async () => {
      await api("owner", "post", `/rfqs/${draft.id}/submit`)
        .send({ rightsDeclaration: true, sharingConsent: false })
        .expect(400);
      await Promise.all(
        Array.from({ length: 5 }, () =>
          api("owner", "post", `/rfqs/${draft.id}/submit`)
            .send({ rightsDeclaration: true, sharingConsent: true })
            .expect(201),
        ),
      );
      assert.equal(
        (
          await db.query(
            "SELECT count(*)::int AS n FROM brand_rfq_events WHERE rfq_id=$1 AND action='RFQ_SUBMITTED'",
            [draft.id],
          )
        )[0].n,
        1,
      );
      await api("owner", "post", `/rfqs/${draft.id}/files/REFERENCE`)
        .attach("file", png, "later.png")
        .expect(409);
    },
  );
  await check(
    "Customer and manufacturer cannot use staff state endpoints",
    async () => {
      await api("owner", "post", `/rfqs/${draft.id}/staff-action`)
        .send({ action: "START_REVIEW", reason: "forged" })
        .expect(403);
      await api("manufacturer", "post", `/rfqs/${draft.id}/approvals`)
        .send({ kind: "TECHNICAL", decision: "APPROVED", reason: "forged" })
        .expect(403);
      await api("staff", "post", `/rfqs/${draft.id}/staff-action`)
        .send({ action: "PAID", reason: "forged payment" })
        .expect(400);
    },
  );
  await api("staff", "post", `/rfqs/${draft.id}/staff-action`)
    .send({ action: "START_REVIEW", reason: "Fixture review" })
    .expect(201);
  const pdf = Buffer.from("%PDF-1.4\nSYNTHETIC TEST EVIDENCE ONLY\n%%EOF");
  await check(
    "Staff assignment requires evidence and an independent verified manufacturer account",
    async () => {
      const uploaded = await api(
        "staff",
        "post",
        `/rfqs/${draft.id}/files/EVIDENCE`,
      )
        .attach("file", pdf, "fixture-verification.pdf")
        .expect(201);
      staffFile = uploaded.body.data.files.find((f) => f.kind === "EVIDENCE");
      await api("staff", "post", `/rfqs/${draft.id}/manufacturer`)
        .send({ userId: users.other.id, evidenceFileId: staffFile.id })
        .expect(400);
      await api("staff", "post", `/rfqs/${draft.id}/manufacturer`)
        .send({ userId: users.manufacturer.id, evidenceFileId: staffFile.id })
        .expect(201);
      await api("outsider", "get", `/rfqs/${draft.id}`).expect(404);
      const visible = (
        await api("manufacturer", "get", `/rfqs/${draft.id}`).expect(200)
      ).body.data;
      assert(!visible.files.some((f) => f.id === staffFile.id));
      assert(!("ownerId" in visible));
      assert(!("houseId" in visible));
    },
  );
  const quoted = {
    amountMinor: 199999,
    currency: "USD",
    currencyExponent: 2,
    quantity: 1,
    materials: "Synthetic fixture specification",
    deliveryDays: 60,
    validUntil: new Date(Date.now() + 86400000).toISOString(),
    terms: "Synthetic offer. No real manufacturer involved.",
    taxTreatment: "Fixture inclusive",
    shippingTerms: "Fixture included",
    manufacturerReference: "TEST-ONLY-001",
  };
  await check(
    "Only assigned manufacturer can propose; unverified offers stay hidden from customer",
    async () => {
      const uploaded = await api(
        "manufacturer",
        "post",
        `/rfqs/${draft.id}/files/EVIDENCE`,
      )
        .attach("file", pdf, "fixture-response.pdf")
        .expect(201);
      responseFile = uploaded.body.data.files.find(
        (f) => f.kind === "EVIDENCE",
      );
      const proposal = { ...quoted, responseFileId: responseFile.id };
      await api("owner", "post", `/rfqs/${draft.id}/offers`)
        .send(proposal)
        .expect(404);
      const response = await api(
        "manufacturer",
        "post",
        `/rfqs/${draft.id}/offers`,
      )
        .send(proposal)
        .expect(201);
      offer = response.body.data.offers[0];
      assert.equal(
        (await api("owner", "get", `/rfqs/${draft.id}`).expect(200)).body.data
          .offers.length,
        0,
      );
    },
  );
  await check(
    "Three separate staff approvals required; third-party brand authorization cannot be waived",
    async () => {
      await api(
        "staff",
        "post",
        `/rfqs/${draft.id}/offers/${offer.id}/verify`,
      ).expect(409);
      await api("staff", "post", `/rfqs/${draft.id}/approvals`)
        .send({
          kind: "BRAND",
          decision: "NOT_REQUIRED",
          reason: "forged waiver",
        })
        .expect(400);
      for (const kind of ["BRAND", "TECHNICAL", "COMMERCIAL"]) {
        await api("staff", "post", `/rfqs/${draft.id}/approvals`)
          .send({
            kind,
            decision: "APPROVED",
            reason: "Synthetic reviewed evidence",
            evidenceFileId: staffFile.id,
            ...(kind === "COMMERCIAL" ? { offerId: offer.id } : {}),
          })
          .expect(201);
      }
      await api(
        "owner",
        "post",
        `/rfqs/${draft.id}/offers/${offer.id}/verify`,
      ).expect(403);
      await api(
        "staff",
        "post",
        `/rfqs/${draft.id}/offers/${offer.id}/verify`,
      ).expect(201);
    },
  );
  await check(
    "Acceptance retains exact price snapshot and does not charge, commission or authorize production",
    async () => {
      await api(
        "other",
        "post",
        `/rfqs/${draft.id}/offers/${offer.id}/accept`,
      ).expect(404);
      await db.manager.update(User, users.manufacturer.id, { kycStatus: "rejected" });
      await api("owner", "post", `/rfqs/${draft.id}/offers/${offer.id}/accept`).expect(409);
      await db.manager.update(User, users.manufacturer.id, { kycStatus: "verified" });
      const accepted = (
        await api(
          "owner",
          "post",
          `/rfqs/${draft.id}/offers/${offer.id}/accept`,
        ).expect(201)
      ).body.data;
      assert.equal(accepted.acceptedSnapshot.amountMinor, quoted.amountMinor);
      assert.equal(accepted.productionAuthorized, false);
      assert.equal(accepted.paymentStatus, "NOT_REQUESTED");
      assert.equal(accepted.orderId, null);
      await api(
        "owner",
        "post",
        `/rfqs/${draft.id}/offers/${offer.id}/accept`,
      ).expect(201);
      assert.equal(
        (
          await db.query(
            "SELECT count(*)::int AS n FROM brand_rfq_events WHERE rfq_id=$1 AND action='OFFER_ACCEPTED'",
            [draft.id],
          )
        )[0].n,
        1,
      );
      assert.equal(await db.manager.count(Order), 1);
    },
  );
  await check(
    "Database rejects offer, accepted-snapshot, evidence and audit tampering",
    async () => {
      await assert.rejects(
        db.query(
          "UPDATE brand_rfq_offers SET snapshot=jsonb_set(snapshot,'{amountMinor}','1') WHERE id=$1",
          [offer.id],
        ),
      );
      await assert.rejects(
        db.query("UPDATE brand_rfqs SET accepted_snapshot='{}' WHERE id=$1", [
          draft.id,
        ]),
      );
      await assert.rejects(
        db.query("UPDATE brand_rfq_events SET payload='{}' WHERE rfq_id=$1", [
          draft.id,
        ]),
      );
      await assert.rejects(
        db.query("DELETE FROM brand_rfq_files WHERE id=$1", [staffFile.id]),
      );
    },
  );
  await check(
    "Cancellation and rejection remain traceable; accepted snapshot survives cancellation",
    async () => {
      const cancelled = (
        await api("owner", "post", `/rfqs/${draft.id}/cancel`)
          .send({ reason: "Synthetic cancellation" })
          .expect(201)
      ).body.data;
      assert.equal(cancelled.acceptedSnapshot.amountMinor, quoted.amountMinor);
      assert.equal(cancelled.status, "CANCELLED");
      const second = (
        await api("other", "post", "/rfqs")
          .set("Idempotency-Key", randomUUID())
          .send(details)
          .expect(201)
      ).body.data;
      await api("other", "post", `/rfqs/${second.id}/submit`)
        .send({ rightsDeclaration: true, sharingConsent: true })
        .expect(201);
      await api("staff", "post", `/rfqs/${second.id}/staff-action`)
        .send({ action: "REJECT", reason: "TEST_UNSUPPORTED_SPECIFICATION" })
        .expect(201);
      const rejected = (
        await api("other", "get", `/rfqs/${second.id}`).expect(200)
      ).body.data;
      assert(
        rejected.events.some(
          (e) => e.reason === "TEST_UNSUPPORTED_SPECIFICATION",
        ),
      );
      await api("other", "post", `/rfqs/${second.id}/submit`)
        .send({ rightsDeclaration: true, sharingConsent: true })
        .expect(409);
    },
  );
  await check(
    "Legacy records unchanged; destructive rollback blocked once RFQ data exists",
    async () => {
      assert.equal(
        JSON.stringify(
          await db.manager.findOneByOrFail(Order, { id: legacyOrder.id }),
        ),
        historical,
      );
      assert.equal(
        (
          await db.manager.findOneByOrFail(BrandLineProfile, {
            id: legacyHouse.id,
          })
        ).visibility,
        "PUBLIC",
      );
      const runner = db.createQueryRunner();
      await assert.rejects(migration.down(runner));
      await runner.release();
      assert.equal(
        (await db.query("SELECT count(*)::int AS n FROM brand_rfqs"))[0].n,
        2,
      );
    },
  );
  await check(
    "Existing design version is preserved, a new linked version is created and private Museum auto-populates",
    async () => {
      const original = await db.manager.findOneByOrFail(DesignProposal, {
        id: draft.designVersionId,
      });
      const snapshot = JSON.stringify(original);
      const created = (
        await api("owner", "post", "/rfqs")
          .set("Idempotency-Key", randomUUID())
          .send({ ...details, designId: original.id })
          .expect(201)
      ).body.data;
      const child = await db.manager.findOneByOrFail(DesignProposal, {
        id: created.designVersionId,
      });
      assert.equal(child.parentProposalId, original.id);
      assert.equal(child.sourceProductId, original.sourceProductId);
      assert.equal(
        JSON.stringify(
          await db.manager.findOneByOrFail(DesignProposal, { id: original.id }),
        ),
        snapshot,
      );
      const museum = (
        await api("owner", "get", "/experience/museum").expect(200)
      ).body.data;
      assert(museum.versions.some((d) => d.id === child.id));
      const parallel = await Promise.all(
        Array.from({ length: 3 }, () =>
          api("owner", "post", "/rfqs")
            .set("Idempotency-Key", randomUUID())
            .send(details)
            .expect(201),
        ),
      );
      assert.equal(new Set(parallel.map((r) => r.body.data.houseId)).size, 1);
      assert.equal(
        await db.manager.countBy(BrandLineProfile, { userId: users.owner.id }),
        1,
      );
    },
  );
  if (
    process.env.RFQ_PG_BIN_DIR &&
    fs.existsSync(path.join(process.env.RFQ_PG_BIN_DIR, "pg_dump")) &&
    fs.existsSync(path.join(process.env.RFQ_PG_BIN_DIR, "pg_restore"))
  )
    await check(
      "Disposable pg_dump/pg_restore preserves RFQs, event history and historical order",
      async () => {
        const { execFileSync } = require("node:child_process");
        const args = ["-h", "127.0.0.1", "-p", "55471", "-U", "r71_local_test"];
        const env = { ...process.env, PGPASSWORD: "local-fixture-only" };
        const dump = execFileSync(
          path.join(process.env.RFQ_PG_BIN_DIR, "pg_dump"),
          [...args, "-Fc", "r71_disposable_test"],
          { env, maxBuffer: 20 * 1024 * 1024 },
        );
        await db.query("CREATE DATABASE r71_disposable_restore");
        execFileSync(
          path.join(process.env.RFQ_PG_BIN_DIR, "pg_restore"),
          [...args, "-d", "r71_disposable_restore"],
          { env, input: dump, maxBuffer: 20 * 1024 * 1024 },
        );
        const restored = new DataSource({
          type: "postgres",
          host: "127.0.0.1",
          port: 55471,
          username: "r71_local_test",
          password: "local-fixture-only",
          database: "r71_disposable_restore",
        });
        await restored.initialize();
        for (const table of [
          "brand_rfqs",
          "brand_rfq_events",
          "brand_rfq_offers",
          "brand_rfq_files",
          "design_proposals",
          "orders",
        ]) {
          const sql = `SELECT row_to_json(t) AS row FROM (SELECT * FROM ${table} ORDER BY id) t`;
          assert.deepEqual(await restored.query(sql), await db.query(sql));
        }
        await restored.destroy();
        await db.query("DROP DATABASE r71_disposable_restore");
      },
    );
  const fingerprints = {};
  for (const table of [
    "brand_rfqs",
    "brand_rfq_events",
    "brand_rfq_offers",
    "brand_rfq_files",
    "design_proposals",
    "orders",
  ])
    fingerprints[table] = require("node:crypto")
      .createHash("sha256")
      .update(
        JSON.stringify(
          await db.query(
            `SELECT row_to_json(t) AS row FROM (SELECT * FROM ${table} ORDER BY id) t`,
          ),
        ),
      )
      .digest("hex");
  const result = {
    database: (await db.query("SELECT version() AS version"))[0].version,
    checks,
    fingerprints,
    logicalPgDump: "BLOCKED_BINARY_UNAVAILABLE",
    realExternalManufacturer: false,
    realPaymentProvider: false,
    stagingDeployment: false,
  };
  const reportPath = process.env.RFQ_TEST_REPORT;
  if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (process.argv.includes("--serve")) {
    // Local QA only, never part of production AppModule.
    await app.listen(3000, "127.0.0.1");
    console.log("Synthetic RFQ browser QA API listening on loopback:3000");
    await new Promise((resolve) => {
      process.on("SIGINT", resolve);
      process.on("SIGTERM", resolve);
    });
  }
  await app.close();
  await db.destroy();
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
