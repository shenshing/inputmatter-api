import { DataSource } from 'typeorm';
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
  entities: [Shop],
  synchronize: true,
});

const shops = [
  'Tube Coffee (BKK)',
  'Brown Roastery TK',
  'Blue Bottle Coffee',
  'Starbucks Reserve',
  'The Coffee Club',
  'Café Amazon',
  'Roots Coffee Roaster',
  'Graph Café',
  'Brave Roasters',
  'Factory Coffee',
];

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Shop);

  for (const name of shops) {
    const exists = await repo.findOneBy({ name });
    if (!exists) {
      await repo.save(repo.create({ name }));
      console.log(`Seeded: ${name}`);
    } else {
      console.log(`Skipped (exists): ${name}`);
    }
  }

  await dataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
