import { BrandService } from './brand.service';
import { User } from '../../database/entities/user.entity';

/** Existing BrandService.getMine is an idempotent on-demand House provisioner. */
describe('Brand House provisioning on first visit', () => {
  const user = {
    id: 'member-1',
    firstName: 'Demo',
    lastName: 'Member',
    mergeId: 'MERGE-DEMO',
    brandLineId: 'BRAND-DEMO',
  } as User;

  function fixture(existing = false) {
    const profile = {
      userId: user.id, name: 'Demo Member', description: null,
      logoUrl: null, profileViews: 0, qrScans: 0,
    };
    const profiles = {
      findOne: jest.fn(async () => existing ? profile : null),
      create: jest.fn((row) => row),
      save: jest.fn(async (row) => row),
    };
    const items = {
      createQueryBuilder: jest.fn(() => ({
        innerJoin() { return this; },
        where() { return this; },
        andWhere() { return this; },
        getCount: jest.fn(async () => 0),
      })),
    };
    const service = new BrandService(
      profiles as never, {} as never, items as never, {} as never,
    );
    return { service, profiles };
  }

  it('creates a personal Brand House when a registered member first opens it', async () => {
    const { service, profiles } = fixture();
    const result = await service.getMine(user);
    expect(profiles.create).toHaveBeenCalledWith(expect.objectContaining({ userId: user.id }));
    expect(profiles.save).toHaveBeenCalledTimes(1);
    expect(result.name).toBe('Demo Member');
  });

  it('does not create another House when a profile already exists', async () => {
    const { service, profiles } = fixture(true);
    await service.getMine(user);
    expect(profiles.create).not.toHaveBeenCalled();
    expect(profiles.save).not.toHaveBeenCalled();
  });
});
