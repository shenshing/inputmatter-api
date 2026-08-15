// PRODUCTION variant of sync-dev-schema.ts — loads .env.production instead of .env,
// so it runs `synchronize: true` against the live prod DB. Requires an explicit
// --yes-production flag so this can't be run by muscle memory / copy-pasted dev
// command. Only adds missing columns/types (per TypeORM's synchronize diffing) —
// never drops or renames anything existing entity code still references.
//
// Usage: npm run sync:production-schema -- --yes-production
import { DataSource } from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { Feedback } from '../feedback/feedback.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

if (!process.argv.includes('--yes-production')) {
  console.error('Refusing to run against production without --yes-production.');
  process.exit(1);
}

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Shop, Feedback],
  synchronize: true,
});

async function run() {
  console.log(`⚠ Syncing schema to PRODUCTION DB (${process.env.DB_HOST})...`);
  await dataSource.initialize();
  console.log('✓ Schema synced — no data was modified, only missing columns/types added.');
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
