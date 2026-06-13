/**
 * Sets the quota counter to 1 050 for every owned shop on the free plan
 * so the "quota exceeded" banner is visible in the dashboard.
 * Run once for testing, then reset with seed:subscriptions to restore real counts.
 */
import { DataSource } from 'typeorm';
import { UserSubscription } from '../../subscription/user-subscription.entity';
import { SubscriptionQuota } from '../../subscription/subscription-quota.entity';
import { Shop } from '../../shop/shop.entity';
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
  entities: [Shop, UserSubscription, SubscriptionQuota],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const result = await dataSource
    .createQueryBuilder()
    .update(SubscriptionQuota)
    .set({ count: 1050 })
    .where(
      'subscriptionId IN (SELECT id FROM user_subscriptions WHERE shopId IN (SELECT id FROM shop WHERE "ownerId" IS NOT NULL))',
    )
    .execute();

  console.log(`Updated ${result.affected} quota record(s) → count set to 1 050 (free plan limit is 1 000).`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
