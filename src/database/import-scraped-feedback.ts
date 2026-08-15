// Imports a scraper/by-name-*.json file (see scraper/scrape-by-name.js) into Shop +
// Feedback. Always loads plain `.env` — same DB as sync-dev-schema.ts (dev/staging
// currently resolve to the same database; there's no separate .env.staging file).
// Never touches .env.production — for that, use import-scraped-feedback-production.ts.
//
// Usage: npx ts-node -r tsconfig-paths/register src/database/import-scraped-feedback.ts <path-to-json>
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Shop } from '../shop/shop.entity';
import { Feedback } from '../feedback/feedback.entity';
import { importScrapedFeedback } from './import-scraped-feedback.lib';

dotenv.config({ path: '.env' });

const inputArg = process.argv[2] || 'by-name-kungfu-kitchen-feedbacks.json';
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
  console.log(`Connecting to DB (${process.env.DB_HOST})...`);
  await dataSource.initialize();
  await importScrapedFeedback(dataSource, inputFile);
  await dataSource.destroy();
  console.log('✓ Done.');
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
