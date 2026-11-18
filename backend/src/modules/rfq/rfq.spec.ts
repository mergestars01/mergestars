import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  assertOfferReady,
  checkDetails,
  fingerprint,
  nextStaffState,
  Approvals,
  OfferSnapshot,
  RfqDetails,
} from './rfq.domain';
import { inspectRfqFile } from './rfq.files';
import { CreateRfqDto } from './rfq.dto';

describe('Universal RFQ boundaries', () => {
  const details: RfqDetails = {
    industry: 'FASHION_LUXURY',
    category: 'Smart glasses',
    title: 'My design',
    material: 'Unverified composite specification',
    quantity: 1,
    countryCode: 'GE',
    city: 'Tbilisi',
    specifications: {},
  };
  const offer: OfferSnapshot = {
    amountMinor: 12345,
    currency: 'USD',
    currencyExponent: 2,
    quantity: 1,
    materials: 'Material specification',
    deliveryDays: 30,
    validUntil: '2030-01-01T00:00:00Z',
    terms: 'Reviewed terms',
    taxTreatment: 'Included',
    shippingTerms: 'Included',
    manufacturerReference: 'TEST',
    responseFileId: 'file',
    responseHash: 'hash',
    pricingPolicy: 'rfq-reviewed-offer-2026-11-08-v1',
  };
  const approval = {
    decision: 'APPROVED' as const,
    evidenceFileId: 'file',
    evidenceHash: 'hash',
    actorId: 'staff',
    recordedAt: '2026-11-08',
    offerId: null,
    reason: 'reviewed',
  };
  const all: Approvals = {
    BRAND: approval,
    TECHNICAL: approval,
    COMMERCIAL: { ...approval, offerId: 'offer' },
  };
  it('canonicalizes object keys for idempotency without translating IDs or values', () => {
    expect(fingerprint({ a: 1, b: { x: '001.50' } })).toBe(
      fingerprint({ b: { x: '001.50' }, a: 1 }),
    );
    expect(fingerprint({ a: '001.50' })).not.toBe(fingerprint({ a: '1.5' }));
  });
  it.each(['PAID', 'PRODUCTION_AUTHORIZED', 'DELIVERED'])(
    'does not permit staff RFQ actions to set %s',
    (action) => expect(() => nextStaffState('UNDER_REVIEW', action)).toThrow(),
  );
  it('accepts only explicit review transitions and preserves closed records', () => {
    expect(nextStaffState('RFQ_SUBMITTED', 'START_REVIEW')).toBe(
      'UNDER_REVIEW',
    );
    expect(nextStaffState('OFFER_RECEIVED', 'REJECT')).toBe('REJECTED');
    expect(() => nextStaffState('CANCELLED', 'START_REVIEW')).toThrow();
  });
  it.each(['BRAND', 'TECHNICAL', 'COMMERCIAL'] as const)(
    'cannot verify an offer without %s approval',
    (key) => {
      const partial = { ...all };
      delete partial[key];
      expect(() =>
        assertOfferReady(partial, 'offer', offer, 'maker', 'maker', Date.now()),
      ).toThrow();
    },
  );
  it('rejects the wrong offer, unauthenticated manufacturer, changed assignment and expired quote', () => {
    expect(() =>
      assertOfferReady(all, 'other', offer, 'maker', 'maker', Date.now()),
    ).toThrow();
    expect(() =>
      assertOfferReady(all, 'offer', offer, null, 'maker', Date.now()),
    ).toThrow();
    expect(() =>
      assertOfferReady(all, 'offer', offer, 'other', 'maker', Date.now()),
    ).toThrow();
    expect(() =>
      assertOfferReady(
        all,
        'offer',
        { ...offer, validUntil: '2020-01-01' },
        'maker',
        'maker',
        Date.now(),
      ),
    ).toThrow();
    expect(() =>
      assertOfferReady(all, 'offer', offer, 'maker', 'maker', Date.now()),
    ).not.toThrow();
  });
  it('rejects invalid or active reference URLs and credentials', () => {
    for (const referenceUrl of [
      'invalid',
      'javascript:alert(1)',
      'http://example.com',
      'https://user:password@example.com',
    ])
      expect(() => checkDetails({ ...details, referenceUrl })).toThrow();
  });
  it('limits category specification keys, values and total count', () => {
    expect(() =>
      checkDetails({ ...details, specifications: { a: 'x'.repeat(501) } }),
    ).toThrow();
    expect(() =>
      checkDetails({
        ...details,
        specifications: Object.fromEntries(
          Array.from({ length: 13 }, (_, i) => ['key' + i, 'v']),
        ),
      }),
    ).toThrow();
  });
  it.each([
    { quantity: 0 },
    { quantity: 1.5 },
    { industry: 'UNSUPPORTED' },
    { countryCode: 'Georgia' },
    { status: 'PAID' },
    { ownerId: 'someone' },
    { verifiedOffer: true },
  ])('rejects invalid or forged DTO fields %j', async (patch) => {
    expect(
      await validate(plainToInstance(CreateRfqDto, { ...details, ...patch }), {
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    ).not.toHaveLength(0);
  });
  const file = (buffer: Buffer, originalname = 'reference.png') =>
    ({
      buffer,
      originalname,
      mimetype: 'image/png',
      size: buffer.length,
    }) as Express.Multer.File;
  it('checks bytes rather than client MIME, and rejects active file formats', () => {
    expect(() =>
      inspectRfqFile(
        file(Buffer.from('<svg onload="alert(1)"></svg>')),
        'REFERENCE',
      ),
    ).toThrow();
    expect(() =>
      inspectRfqFile(file(Buffer.from('<html>bad</html>')), 'REFERENCE'),
    ).toThrow();
  });
  it('enforces file size and declared purpose', () => {
    expect(() =>
      inspectRfqFile(file(Buffer.alloc(20 * 1024 * 1024 + 1)), 'MODEL'),
    ).toThrow();
    expect(() =>
      inspectRfqFile(file(Buffer.from('%PDF-fixture')), 'REFERENCE'),
    ).toThrow();
  });
  it('rejects GLB external resources and malformed containers', () => {
    const glb = (json: unknown) => {
      const payload = Buffer.from(JSON.stringify(json));
      const b = Buffer.alloc(20 + payload.length);
      b.write('glTF');
      b.writeUInt32LE(2, 4);
      b.writeUInt32LE(b.length, 8);
      b.writeUInt32LE(payload.length, 12);
      b.write('JSON', 16);
      payload.copy(b, 20);
      return b;
    };
    expect(() =>
      inspectRfqFile(
        file(glb({ buffers: [{ uri: 'https://example.com/model.bin' }] })),
        'MODEL',
      ),
    ).toThrow();
    expect(() => inspectRfqFile(file(glb(null)), 'MODEL')).toThrow();
    expect(() =>
      inspectRfqFile(file(glb({ buffers: [null] })), 'MODEL'),
    ).toThrow();
    expect(
      inspectRfqFile(
        file(glb({ asset: { version: '2.0' }, buffers: [] }), 'model.glb'),
        'MODEL',
      ).mime,
    ).toBe('model/gltf-binary');
  });
});
