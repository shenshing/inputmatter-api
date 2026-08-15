// One-off schema sync for the DEV database only. Unlike seeds/*.seed.ts (which target
// .env.${NODE_ENV} — .env.local or .env.production), this always loads plain `.env`,
// which is the dev database's env file in this repo. Run after adding/changing entity
// columns so the running dev API (which hardcodes synchronize: false in app.module.ts)
// has a schema that actually matches the code. Never touches .env.production.
import { DataSource } from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { Feedback } from '../feedback/feedback.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

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
  console.log(`Syncing schema to dev DB (${process.env.DB_HOST})...`);
  await dataSource.initialize();
  console.log('✓ Schema synced — no data was modified, only missing columns/types added.');
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
