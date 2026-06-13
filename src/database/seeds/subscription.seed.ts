import { DataSource } from 'typeorm';
import { Shop } from '../../shop/shop.entity';
import { Feedback } from '../../feedback/feedback.entity';
import { UserSubscription } from '../../subscription/user-subscription.entity';
import { SubscriptionQuota } from '../../subscription/subscription-quota.entity';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'local'}` });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Shop, Feedback, UserSubscription, SubscriptionQuota],
  synchronize: true,
});

function addOneMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
}

// Returns the current active billing period anchored on the shop's creation date.
function getCurrentPeriod(createdAt: Date): { periodStart: Date; periodEnd: Date } {
  const now = new Date();
  let periodStart = new Date(createdAt);
  let periodEnd = addOneMonth(periodStart);

  while (periodEnd <= now) {
    periodStart = periodEnd;
    periodEnd = addOneMonth(periodStart);
  }

  return { periodStart, periodEnd };
}

async function seed() {
  await dataSource.initialize();

  const shopRepo = dataSource.getRepository(Shop);
  const feedbackRepo = dataSource.getRepository(Feedback);
  const subRepo = dataSource.getRepository(UserSubscription);
  const quotaRepo = dataSource.getRepository(SubscriptionQuota);

  // 1. Ensure every shop is on the free plan.
  await shopRepo
    .createQueryBuilder()
    .update(Shop)
    .set({ plan: 'free' })
    .execute();
  console.log('Set all shops to free plan.');

  // 2. For each owned shop, seed a subscription period and quota count.
  const ownedShops = await shopRepo
    .createQueryBuilder('shop')
    .where('shop.ownerId IS NOT NULL')
    .getMany();

  for (const shop of ownedShops) {
    const { periodStart, periodEnd } = getCurrentPeriod(shop.created_at);

    // Count feedbacks for this shop that fall within the current billing period.
    const count = await feedbackRepo
      .createQueryBuilder('feedback')
      .where('feedback.shop_id = :shopId', { shopId: shop.id })
      .andWhere('feedback.created_at >= :periodStart', { periodStart })
      .getCount();

    // Upsert subscription: remove any existing record and create a clean one.
    const existing = await subRepo.findOne({
      where: { shopId: shop.id },
      order: { periodStart: 'DESC' },
    });

    let sub: UserSubscription;

    if (existing) {
      existing.plan = 'free';
      existing.periodStart = periodStart;
      existing.periodEnd = periodEnd;
      existing.status = 'active';
      sub = await subRepo.save(existing);
      console.log(`Updated subscription for shop "${shop.name}".`);
    } else {
      sub = await subRepo.save(
        subRepo.create({ shopId: shop.id, plan: 'free', periodStart, periodEnd, status: 'active' }),
      );
      console.log(`Created subscription for shop "${shop.name}".`);
    }

    // Upsert quota: set count to the actual number of feedbacks in the current period.
    const existingQuota = await quotaRepo.findOneBy({ subscriptionId: sub.id });

    if (existingQuota) {
      existingQuota.count = count;
      await quotaRepo.save(existingQuota);
    } else {
      await quotaRepo.save(
        quotaRepo.create({ shopId: shop.id, subscriptionId: sub.id, count }),
      );
    }

    console.log(`  → period ${periodStart.toISOString().slice(0, 10)} → ${periodEnd.toISOString().slice(0, 10)}, quota count: ${count}`);
  }

  await dataSource.destroy();
  console.log('Subscription seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
