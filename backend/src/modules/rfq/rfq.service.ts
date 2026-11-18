import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from '../../database/entities/user.entity';
import { BrandLineProfile } from '../../database/entities/brand-line-profile.entity';
import { ensureBrandProfile } from '../brand/brand-profile';
import { CatalogCollection } from '../../database/entities/catalog-collection.entity';
import { CatalogItem } from '../../database/entities/catalog-item.entity';
import { DesignProposal } from '../experience/experience.entity';
import { BrandRfq, RfqEvent, RfqFile, RfqOffer } from './rfq.entity';
import {
  assertOfferReady,
  checkDetails,
  fingerprint,
  industries,
  nextStaffState,
  OfferSnapshot,
} from './rfq.domain';
import {
  ApprovalDto,
  AssignManufacturerDto,
  CreateRfqDto,
  OfferDto,
  StaffActionDto,
  SubmitRfqDto,
} from './rfq.dto';
import { inspectRfqFile } from './rfq.files';
import { industryDestinations } from '../catalog/industry-destinations';

@Injectable()
export class RfqService {
  constructor(private readonly db: DataSource) {}
  capabilities() {
    return {
      enabled: process.env.RFQ_ENABLED === 'true',
      industries,
      industryDestinations,
      fileLimitBytes: 20 * 1024 * 1024,
      generation: 'NOT_INTEGRATED',
      checkout: 'CORE_PAYMENT_BRIDGE_REQUIRED',
      productionAuthorized: false,
    };
  }
  private staff(user: User) {
    return user.roles?.some((r) => ['admin', 'manager'].includes(r)) === true;
  }
  private manufacturerEligible(user: User) {
    return (
      user.kycStatus === 'verified' &&
      user.status === 'active' &&
      !this.staff(user)
    );
  }
  private enabled() {
    if (!this.capabilities().enabled)
      throw new ServiceUnavailableException('RFQ rollout is not enabled');
  }
  private access(
    row: BrandRfq,
    user: User,
    scope?: 'owner' | 'staff' | 'manufacturer',
  ) {
    if (scope === 'staff') {
      if (!this.staff(user)) throw new ForbiddenException();
      return;
    }
    if (scope === 'owner') {
      if (row.ownerId !== user.id) throw new NotFoundException('RFQ not found');
      return;
    }
    if (scope === 'manufacturer') {
      if (
        row.manufacturerId !== user.id ||
        !row.manufacturerEvidenceId ||
        !this.manufacturerEligible(user)
      )
        throw new NotFoundException('Assigned RFQ not found');
      return;
    }
    if (this.staff(user) || row.ownerId === user.id) return;
    this.access(row, user, 'manufacturer');
  }
  private async change(
    user: User,
    id: string,
    scope: 'owner' | 'staff' | 'manufacturer',
    operation: (m: EntityManager, row: BrandRfq) => Promise<void>,
  ) {
    this.enabled();
    return this.db.transaction(async (m) => {
      const row = await m.findOne(BrandRfq, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!row) throw new NotFoundException('RFQ not found');
      this.access(row, user, scope);
      await operation(m, row);
      return this.view(m, row, user);
    });
  }
  private async event(
    m: EntityManager,
    row: BrandRfq,
    user: User,
    action: string,
    payload: Record<string, unknown> = {},
  ) {
    row.revision += 1;
    await m.save(BrandRfq, row);
    await m.insert(RfqEvent, {
      id: randomUUID(),
      rfqId: row.id,
      revision: row.revision,
      actorId: user.id,
      action,
      payload,
    });
  }
  async createDraft(user: User, dto: CreateRfqDto, key: string) {
    this.enabled();
    if (!/^[A-Za-z0-9_-]{8,100}$/.test(key ?? ''))
      throw new BadRequestException(
        'Idempotency-Key must contain 8–100 letters, digits, hyphens or underscores',
      );
    const { designId, ...details } = dto;
    checkDetails(details);
    const payloadHash = fingerprint(dto);
    return this.db.transaction(async (m) => {
      await m.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `rfq:${user.id}:${key}`,
      ]);
      const existing = await m.findOneBy(BrandRfq, {
        ownerId: user.id,
        idempotencyKey: key,
      });
      if (existing) {
        if (existing.payloadHash !== payloadHash)
          throw new ConflictException(
            'Idempotency key already used for a different request',
          );
        return this.view(m, existing, user);
      }
      let parent: DesignProposal | null = null;
      let source: CatalogItem;
      if (designId) {
        parent = await m.findOneBy(DesignProposal, {
          id: designId,
          creatorId: user.id,
        });
        if (!parent)
          throw new NotFoundException('Owned design version not found');
        source = await m.findOne(CatalogItem, {
          where: { id: parent.sourceProductId, status: 'ACTIVE' },
          relations: { collection: true },
        });
        if (
          !source ||
          (source.collection.visibility !== 'PUBLIC' &&
            source.collection.userId !== user.id)
        )
          throw new NotFoundException('Design source not available');
      }
      const house = await ensureBrandProfile(
        m.getRepository(BrandLineProfile),
        user,
      );
      if (!source) {
        const collection = await m.save(
          CatalogCollection,
          m.create(CatalogCollection, {
            userId: user.id,
            title: 'Private RFQ designs',
            slug: `rfq-${randomUUID()}`,
            visibility: 'PRIVATE',
            category: 'more',
          }),
        );
        source = await m.save(
          CatalogItem,
          m.create(CatalogItem, {
            collectionId: collection.id,
            title: details.title,
            description:
              'Customer design concept; manufacturing and brand permissions pending review.',
            metalType: details.material,
            status: 'ACTIVE',
            priceUsd: null,
          }),
        );
      }
      const proposal = await m.save(
        DesignProposal,
        m.create(DesignProposal, {
          creatorId: user.id,
          sourceProductId: source.id,
          parentProposalId: parent?.id ?? null,
          sourceUpdatedAt: parent?.sourceUpdatedAt ?? source.updatedAt,
          houseId: house.id,
          brandLineId: user.brandLineId ?? null,
          preferences: {
            material: details.material,
            notes: details.description || details.title,
            measurements: {},
            fitSource: null,
            fitUpdatedAt: null,
          },
          publicationRequestedAt: null,
          publicationConsentVersion: null,
          verificationRequestedAt: null,
        }),
      );
      const row = m.create(BrandRfq, {
        id: randomUUID(),
        ownerId: user.id,
        houseId: house.id,
        designId: proposal.id,
        idempotencyKey: key,
        payloadHash,
        revision: 0,
        status: 'DRAFT',
        details,
        approvals: {},
        consent: null,
        manufacturerId: null,
        manufacturerEvidenceId: null,
        acceptedOfferId: null,
        acceptedSnapshot: null,
        submittedAt: null,
      });
      await this.event(m, row, user, 'DRAFT_CREATED', {
        designVersionId: proposal.id,
      });
      return this.view(m, row, user);
    });
  }
  async submit(user: User, id: string, dto: SubmitRfqDto) {
    return this.change(user, id, 'owner', async (m, row) => {
      if (['REJECTED', 'CANCELLED'].includes(row.status))
        throw new ConflictException('Closed RFQ cannot be resubmitted');
      if (row.submittedAt) return;
      if (dto.rightsDeclaration !== true || dto.sharingConsent !== true)
        throw new BadRequestException(
          'Rights declaration and scoped sharing consent required',
        );
      row.consent = {
        version: 'rfq-sharing-2026-11-08-v1',
        at: new Date().toISOString(),
      };
      row.submittedAt = new Date();
      row.status = 'RFQ_SUBMITTED';
      await this.event(m, row, user, 'RFQ_SUBMITTED', {
        consentVersion: row.consent.version,
      });
    });
  }
  async list(
    user: User,
    mode: 'mine' | 'staff' | 'manufacturer',
    status?: string,
    page = 0,
  ) {
    if (mode === 'staff' && !this.staff(user)) throw new ForbiddenException();
    if (mode === 'manufacturer' && !this.manufacturerEligible(user))
      throw new ForbiddenException();
    const where = {
      ...(mode === 'mine'
        ? { ownerId: user.id }
        : mode === 'manufacturer'
          ? { manufacturerId: user.id }
          : {}),
      ...(status ? { status: status as BrandRfq['status'] } : {}),
    };
    const rows = await this.db.manager.find(BrandRfq, {
      where,
      order: { createdAt: 'DESC', id: 'DESC' },
      take: 51,
      skip: page * 50,
    });
    return {
      items: rows.slice(0, 50).map((row) => ({
        id: row.id,
        title: row.details.title,
        industry: row.details.industry,
        category: row.details.category,
        status: row.status,
        designVersionId: row.designId,
        createdAt: row.createdAt,
      })),
      page,
      hasMore: rows.length > 50,
    };
  }
  async get(user: User, id: string) {
    const row = await this.db.manager.findOneBy(BrandRfq, { id });
    if (!row) throw new NotFoundException('RFQ not found');
    this.access(row, user);
    return this.view(this.db.manager, row, user);
  }
  async brief(user: User, id: string) {
    const row = await this.db.manager.findOneBy(BrandRfq, { id });
    if (!row) throw new NotFoundException();
    this.access(row, user, 'staff');
    if (
      !row.consent ||
      !row.submittedAt ||
      ['CANCELLED', 'REJECTED'].includes(row.status)
    )
      throw new ConflictException(
        'Open submitted request and sharing consent required',
      );
    const files = await this.db.manager.findBy(RfqFile, { rfqId: id });
    return {
      rfqId: row.id,
      designVersionId: row.designId,
      request: row.details,
      files: files
        .filter((f) => f.kind !== 'EVIDENCE')
        .map((f) => ({ id: f.id, name: f.name, kind: f.kind, hash: f.hash })),
      officialPartner: false,
      permissionStatus: 'REQUIRES_BRAND_AND_TECHNICAL_REVIEW',
      transmissionStatus: 'NOT_SENT_BY_PLATFORM',
    };
  }
  private async evidence(
    m: EntityManager,
    id: string | undefined,
    rfqId: string,
  ) {
    const file =
      id && (await m.findOneBy(RfqFile, { id, rfqId, kind: 'EVIDENCE' }));
    if (!file)
      throw new BadRequestException('Evidence file for this RFQ required');
    return file;
  }
  async staffAction(user: User, id: string, dto: StaffActionDto) {
    return this.change(user, id, 'staff', async (m, row) => {
      let evidence: RfqFile;
      if (dto.action === 'CONTACT_RECORDED')
        evidence = await this.evidence(m, dto.evidenceFileId, id);
      row.status = nextStaffState(row.status, dto.action);
      if (row.status === 'REJECTED')
        await m.update(
          RfqOffer,
          { rfqId: id, status: 'VERIFIED' },
          { status: 'REVOKED' },
        );
      await this.event(m, row, user, dto.action, {
        reasonCode: dto.action === 'REJECT' ? 'STAFF_REJECTED' : dto.action,
        reason: dto.reason,
        evidenceFileId: evidence?.id ?? null,
        evidenceHash: evidence?.hash ?? null,
      });
    });
  }
  async assign(user: User, id: string, dto: AssignManufacturerDto) {
    return this.change(user, id, 'staff', async (m, row) => {
      if (
        !row.consent ||
        !['UNDER_REVIEW', 'BRAND_CONTACTED', 'APPROVAL_PENDING'].includes(
          row.status,
        )
      )
        throw new ConflictException('Submitted request under review required');
      const manufacturer = await m.findOneBy(User, { id: dto.userId });
      if (
        !manufacturer ||
        manufacturer.id === row.ownerId ||
        !this.manufacturerEligible(manufacturer)
      )
        throw new BadRequestException(
          'Independent active manufacturer account with completed verification required',
        );
      const evidence = await this.evidence(m, dto.evidenceFileId, id);
      if (evidence.actorId !== user.id)
        throw new BadRequestException(
          'Staff-uploaded manufacturer verification evidence required',
        );
      row.manufacturerId = manufacturer.id;
      row.manufacturerEvidenceId = evidence.id;
      row.approvals = {};
      await this.event(m, row, user, 'MANUFACTURER_ASSIGNED', {
        manufacturerId: manufacturer.id,
        evidenceId: evidence.id,
        evidenceHash: evidence.hash,
      });
    });
  }
  async approve(user: User, id: string, dto: ApprovalDto) {
    return this.change(user, id, 'staff', async (m, row) => {
      if (
        !row.submittedAt ||
        ['REJECTED', 'CANCELLED'].includes(row.status) ||
        (['VERIFIED_OFFER', 'ACCEPTED'].includes(row.status) &&
          dto.decision !== 'REJECTED')
      )
        throw new ConflictException('Request is not open for this review');
      if (
        dto.decision === 'NOT_REQUIRED' &&
        (dto.kind !== 'BRAND' || row.details.requestedBrand?.trim())
      )
        throw new BadRequestException(
          'Brand authorization cannot be waived for a requested third-party brand',
        );
      const file =
        dto.decision === 'NOT_REQUIRED'
          ? null
          : await this.evidence(m, dto.evidenceFileId, id);
      if (dto.kind === 'COMMERCIAL') {
        const offer =
          dto.offerId &&
          (await m.findOneBy(RfqOffer, { id: dto.offerId, rfqId: id }));
        if (!offer || offer.status !== 'RECEIVED')
          throw new BadRequestException(
            'An exact received manufacturer offer is required',
          );
      }
      row.approvals = {
        ...row.approvals,
        [dto.kind]: {
          decision: dto.decision,
          evidenceFileId: file?.id ?? null,
          evidenceHash: file?.hash ?? null,
          actorId: user.id,
          recordedAt: new Date().toISOString(),
          offerId: dto.offerId ?? null,
          reason: dto.reason,
        },
      };
      if (dto.decision === 'REJECTED') {
        row.status = 'REJECTED';
        await m.update(
          RfqOffer,
          { rfqId: id, status: 'VERIFIED' },
          { status: 'REVOKED' },
        );
      }
      await this.event(m, row, user, `${dto.kind}_REVIEW`, {
        decision: dto.decision,
        evidenceFileId: file?.id ?? null,
        evidenceHash: file?.hash ?? null,
        offerId: dto.offerId ?? null,
        reason: dto.reason,
      });
    });
  }
  async propose(user: User, id: string, dto: OfferDto) {
    return this.change(user, id, 'manufacturer', async (m, row) => {
      if (
        ![
          'UNDER_REVIEW',
          'BRAND_CONTACTED',
          'APPROVAL_PENDING',
          'OFFER_RECEIVED',
        ].includes(row.status)
      )
        throw new ConflictException('RFQ is not open for proposals');
      if (
        dto.quantity !== row.details.quantity ||
        Date.parse(dto.validUntil) <= Date.now()
      )
        throw new BadRequestException(
          'Matching quantity and future validity required',
        );
      const response = await this.evidence(m, dto.responseFileId, id);
      if (response.actorId !== user.id)
        throw new BadRequestException(
          'Response must come from the assigned manufacturer',
        );
      if ((await m.countBy(RfqOffer, { rfqId: id })) >= 20)
        throw new ConflictException('Proposal limit reached');
      const snapshot: OfferSnapshot = {
        ...dto,
        responseHash: response.hash,
        pricingPolicy: 'rfq-reviewed-offer-2026-11-08-v1',
      };
      const offer = await m.save(
        RfqOffer,
        m.create(RfqOffer, {
          id: randomUUID(),
          rfqId: id,
          manufacturerId: user.id,
          snapshot,
          hash: fingerprint(snapshot),
          status: 'RECEIVED',
        }),
      );
      row.status = 'OFFER_RECEIVED';
      row.approvals = { ...row.approvals };
      delete row.approvals.COMMERCIAL;
      await this.event(m, row, user, 'OFFER_RECEIVED', {
        offerId: offer.id,
        snapshotHash: offer.hash,
      });
    });
  }
  async verifyOffer(user: User, id: string, offerId: string) {
    return this.change(user, id, 'staff', async (m, row) => {
      const offer = await m.findOneBy(RfqOffer, { id: offerId, rfqId: id });
      if (
        !offer ||
        row.status !== 'OFFER_RECEIVED' ||
        offer.status !== 'RECEIVED' ||
        !row.manufacturerEvidenceId
      )
        throw new ConflictException(
          'Received offer and verified manufacturer assignment required',
        );
      await this.requireCurrentManufacturer(m, row);
      assertOfferReady(
        row.approvals,
        offer.id,
        offer.snapshot,
        row.manufacturerId,
        offer.manufacturerId,
        Date.now(),
      );
      if (offer.hash !== fingerprint(offer.snapshot))
        throw new ConflictException('Offer integrity check failed');
      offer.status = 'VERIFIED';
      offer.verifiedBy = user.id;
      offer.verifiedAt = new Date();
      await m.save(RfqOffer, offer);
      row.status = 'VERIFIED_OFFER';
      await this.event(m, row, user, 'OFFER_VERIFIED', {
        offerId,
        snapshotHash: offer.hash,
      });
    });
  }
  async accept(user: User, id: string, offerId: string) {
    return this.change(user, id, 'owner', async (m, row) => {
      if (row.status === 'ACCEPTED' && row.acceptedOfferId === offerId) return;
      const offer = await m.findOneBy(RfqOffer, {
        id: offerId,
        rfqId: id,
        status: 'VERIFIED',
      });
      if (!offer || row.status !== 'VERIFIED_OFFER')
        throw new ConflictException('Active verified offer required');
      await this.requireCurrentManufacturer(m, row);
      assertOfferReady(
        row.approvals,
        offer.id,
        offer.snapshot,
        row.manufacturerId,
        offer.manufacturerId,
        Date.now(),
      );
      if (offer.hash !== fingerprint(offer.snapshot))
        throw new ConflictException('Offer integrity check failed');
      row.acceptedOfferId = offer.id;
      row.acceptedSnapshot = offer.snapshot;
      row.status = 'ACCEPTED';
      await this.event(m, row, user, 'OFFER_ACCEPTED', {
        offerId,
        snapshotHash: offer.hash,
      });
    });
  }
  private async requireCurrentManufacturer(m: EntityManager, row: BrandRfq) {
    const manufacturer = row.manufacturerId
      ? await m.findOne(User, {
          where: { id: row.manufacturerId },
          lock: { mode: 'pessimistic_read' },
        })
      : null;
    if (
      !row.manufacturerEvidenceId ||
      !manufacturer ||
      !this.manufacturerEligible(manufacturer)
    )
      throw new ConflictException('Current manufacturer verification required');
  }
  async cancel(user: User, id: string, reason: string) {
    return this.change(user, id, 'owner', async (m, row) => {
      if (row.status === 'CANCELLED') return;
      if (row.status === 'REJECTED')
        throw new ConflictException('Rejected RFQ is already closed');
      row.status = 'CANCELLED';
      await m.update(
        RfqOffer,
        { rfqId: id, status: 'VERIFIED' },
        { status: 'REVOKED' },
      );
      await this.event(m, row, user, 'CANCELLED', {
        reasonCode: 'CUSTOMER_CANCELLED',
        reason,
      });
    });
  }
  async upload(
    user: User,
    id: string,
    kind: string,
    file: Express.Multer.File,
  ) {
    if (!['REFERENCE', 'MODEL', 'EVIDENCE'].includes(kind))
      throw new BadRequestException('Unsupported file purpose');
    const inspected = inspectRfqFile(file, kind);
    return this.change(
      user,
      id,
      kind === 'EVIDENCE'
        ? this.staff(user)
          ? 'staff'
          : 'manufacturer'
        : 'owner',
      async (m, row) => {
        if (
          (kind !== 'EVIDENCE' && row.status !== 'DRAFT') ||
          ['REJECTED', 'CANCELLED', 'ACCEPTED'].includes(row.status)
        )
          throw new ConflictException('Files are locked for this RFQ');
        const files = await m.find(RfqFile, { where: { rfqId: id } });
        if (
          files.length >= 24 ||
          files.reduce((sum, x) => sum + x.size, 0) + inspected.size >
            80 * 1024 * 1024
        )
          throw new ConflictException('RFQ file quota reached');
        const saved = await m.save(
          RfqFile,
          m.create(RfqFile, {
            id: randomUUID(),
            rfqId: id,
            actorId: user.id,
            kind,
            ...inspected,
          }),
        );
        await this.event(m, row, user, 'FILE_ADDED', {
          fileId: saved.id,
          kind,
          hash: saved.hash,
        });
      },
    );
  }
  private visibleFile(
    file: RfqFile,
    row: BrandRfq,
    user: User,
    offers: RfqOffer[],
  ) {
    if (this.staff(user)) return true;
    if (file.kind !== 'EVIDENCE')
      return (
        row.ownerId === user.id ||
        (!!row.consent && row.manufacturerId === user.id)
      );
    if (row.manufacturerId === user.id && file.actorId === user.id) return true;
    return (
      row.ownerId === user.id &&
      offers.some(
        (o) => o.status === 'VERIFIED' && o.snapshot.responseFileId === file.id,
      )
    );
  }
  async download(user: User, id: string, fileId: string) {
    const row = await this.db.manager.findOneBy(BrandRfq, { id });
    if (!row) throw new NotFoundException();
    this.access(row, user);
    const file = await this.db.manager
      .createQueryBuilder(RfqFile, 'file')
      .addSelect('file.bytes')
      .where('file.id = :fileId AND file.rfq_id = :id', { fileId, id })
      .getOne();
    const offers = await this.db.manager.findBy(RfqOffer, { rfqId: id });
    if (!file || !this.visibleFile(file, row, user, offers))
      throw new NotFoundException();
    return file;
  }
  private async view(m: EntityManager, row: BrandRfq, user: User) {
    // A transaction has one PostgreSQL connection; keep its queries sequential.
    const files = await m.find(RfqFile, {
      where: { rfqId: row.id },
      order: { createdAt: 'ASC' },
    });
    const allOffers = await m.find(RfqOffer, {
      where: { rfqId: row.id },
      order: { createdAt: 'DESC' },
    });
    const events = await m.find(RfqEvent, {
      where: { rfqId: row.id },
      order: { revision: 'ASC' },
    });
    const isStaff = this.staff(user),
      isOwner = row.ownerId === user.id;
    const offers = allOffers.filter(
      (o) =>
        isStaff ||
        (!isOwner && o.manufacturerId === user.id) ||
        o.status === 'VERIFIED',
    );
    return {
      id: row.id,
      status: row.status,
      revision: row.revision,
      details: row.details,
      designVersionId: row.designId,
      ...(isStaff || isOwner ? { houseId: row.houseId } : {}),
      approvals: Object.fromEntries(
        Object.entries(row.approvals).map(([kind, approval]) => [
          kind,
          { decision: approval.decision },
        ]),
      ),
      manufacturerAssigned: !!row.manufacturerId,
      acceptedSnapshot: row.acceptedSnapshot,
      offers: offers.map((o) => ({
        id: o.id,
        status: o.status,
        snapshot: o.snapshot,
        hash: o.hash,
        verifiedAt: o.verifiedAt,
      })),
      files: files
        .filter((f) => this.visibleFile(f, row, user, allOffers))
        .map((f) => ({
          id: f.id,
          kind: f.kind,
          name: f.name,
          mime: f.mime,
          size: f.size,
          hash: f.hash,
        })),
      events: events.map((e) => ({
        revision: e.revision,
        action: e.action,
        at: e.createdAt,
        ...(isStaff
          ? { actorId: e.actorId, payload: e.payload }
          : ['REJECT', 'CANCELLED'].includes(e.action)
            ? { reason: e.payload.reason }
            : {}),
      })),
      officialPartner: false,
      paymentStatus: 'NOT_REQUESTED',
      orderId: null,
      orderAllowed: false,
      productionAuthorized: false,
      commerceHandoff: 'BLOCKED_CORE_PAYMENT_BRIDGE_REQUIRED',
      createdAt: row.createdAt,
      submittedAt: row.submittedAt,
    };
  }
}
