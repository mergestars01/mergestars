import { Repository } from 'typeorm';
import { BrandLineProfile } from '../../database/entities/brand-line-profile.entity';
import { User } from '../../database/entities/user.entity';

export async function ensureBrandProfile(
  profiles: Repository<BrandLineProfile>,
  user: User,
  initialVisibility: BrandLineProfile['visibility'] = 'PRIVATE',
) {
  const existing = await profiles.findOneBy({ userId: user.id });
  if (existing) return existing;
  await profiles
    .createQueryBuilder()
    .insert()
    .values({
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || 'My Brand House',
      visibility: initialVisibility,
    })
    .orIgnore()
    .execute();
  return profiles.findOneByOrFail({ userId: user.id });
}
