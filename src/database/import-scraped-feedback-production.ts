// PRODUCTION variant of import-scraped-feedback.ts — loads .env.production instead of
// .env, so it writes to the live prod DB. Requires an explicit --yes-production flag
// so this can't be run by muscle memory / copy-pasted dev command.
//
// Usage: npx ts-node -r tsconfig-paths/register src/database/import-scraped-feedback-production.ts <path-to-json> --yes-production
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Shop } from '../shop/shop.entity';
import { Feedback } from '../feedback/feedback.entity';
import { importScrapedFeedback } from './import-scraped-feedback.lib';

dotenv.config({ path: '.env.production' });

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: import-scraped-feedback-production.ts <path-to-json> --yes-production');
  process.exit(1);
}
if (!process.argv.includes('--yes-production')) {
  console.error('Refusing to run against production without --yes-production.');
  process.exit(1);
}

const inputFile = path.isAbsolute(inputArg)
  ? inputArg
  : path.resolve(__dirname, '../../../scraper', inputArg);

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Shop, Feedback],
  synchronize: false,
});

async function run() {
  console.log(`⚠ Connecting to PRODUCTION DB (${process.env.DB_HOST})...`);
  await dataSource.initialize();
  await importScrapedFeedback(dataSource, inputFile);
  await dataSource.destroy();
  console.log('✓ Done.');
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
