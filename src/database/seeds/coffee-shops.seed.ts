/**
 * Seeds coffee shop brands scraped from Google Maps links provided by the team.
 *
 * By default only the first location of each brand is inserted, to avoid
 * burning through dev/staging storage — pass --all (or SEED_ALL=true) to
 * insert every location for every brand, which is what production seeding
 * should use once the brand data has been verified locally.
 *
 * Each brand's logo is uploaded once to Supabase Storage and its public URL
 * is reused across every location belonging to that brand.
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Shop } from '../../shop/shop.entity';

const envFile = `.env.${process.env.NODE_ENV ?? 'local'}`;
dotenv.config({ path: fs.existsSync(envFile) ? envFile : '.env' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Shop],
  synchronize: false,
});

const ASSETS_DIR = path.resolve(__dirname, 'assets/coffee-shops');
const SEED_ALL =
  process.argv.includes('--all') || process.env.SEED_ALL === 'true';

interface Location {
  name: string;
  google_map_url: string;
}

interface Brand {
  slug: string;
  logoFile: string;
  locations: Location[];
}

const brands: Brand[] = [
  {
    slug: 'arabica',
    logoFile: 'arabica-coffee-logo.jpg',
    locations: [
      {
        name: '% Arabica Phnom Penh Vattanac Capital',
        google_map_url: 'https://maps.app.goo.gl/sfWoTKhGCq1zTFa16',
      },
      {
        name: '% Arabica Phnom Penh The Commune Toul Kork',
        google_map_url: 'https://maps.app.goo.gl/fCAyu2knHAVGedSU6',
      },
    ],
  },
  {
    slug: 'temple-coffee',
    logoFile: 'temple-coffee-logo.png',
    locations: [
      {
        name: 'Temple Coffee n Bakery (BKK 51)',
        google_map_url: 'https://maps.app.goo.gl/r6KavtZ6f49DVb9y5',
      },
      {
        name: 'Temple Coffee n Bakery Siem Reap',
        google_map_url: 'https://maps.app.goo.gl/wHMsKKKykcGEXPHq9',
      },
      {
        name: 'Temple Coffee n Bakery (BKK 370)',
        google_map_url: 'https://maps.app.goo.gl/vRHvCbgmrZrDjRwJ7',
      },
    ],
  },
  {
    slug: 'enso-cafe',
    logoFile: 'enso-cafe-logo.png',
    locations: [
      {
        name: 'Enso Cafe',
        google_map_url: 'https://maps.app.goo.gl/AQFJ2Y1kfj5KtJseA',
      },
    ],
  },
  {
    slug: 'sip-house',
    logoFile: 'sip-house-logo.jpg',
    locations: [
      {
        name: 'Sip House - Matcha & Coffee (Independence Monument)',
        google_map_url: 'https://maps.app.goo.gl/D2VAiQSrcBXTrw5k9',
      },
      {
        name: 'Sip House - Matcha & Coffee (Toul Tompoung)',
        google_map_url: 'https://maps.app.goo.gl/q99c1gTABMkjNzqj9',
      },
      {
        name: 'Sip House - Matcha (Toul Kork)',
        google_map_url: 'https://maps.app.goo.gl/5V1zwUDdgejc1kzY6',
      },
    ],
  },
  {
    slug: 'coffee-corner',
    logoFile: 'coffee-corner-logo.jpg',
    locations: [
      {
        name: 'Coffee Corner Koh Pich',
        google_map_url: 'https://maps.app.goo.gl/VPqKtJj6eLiwVpbo7',
      },
      {
        name: 'Coffee Corner Watbotum',
        google_map_url: 'https://maps.app.goo.gl/hNCcztNYrnizyttB8',
      },
      {
        name: 'Coffee Corner Sisowat',
        google_map_url: 'https://maps.app.goo.gl/c7oVAzMrspjgYQfS9',
      },
      {
        name: 'Coffee Corner Kampuchea Krom',
        google_map_url: 'https://maps.app.goo.gl/32tuZEqqVLUvdiCK8',
      },
      {
        name: 'Coffee Corner Chak Angrae Kraom',
        google_map_url: 'https://maps.app.goo.gl/4iA2pqkgpHe8AgfL6',
      },
      {
        name: 'Coffee Corner Toulkork',
        google_map_url: 'https://maps.app.goo.gl/vFQhfgJXyqKDWTYq6',
      },
      {
        name: 'Coffee Corner Sovanna',
        google_map_url: 'https://maps.app.goo.gl/V5tBnXuvF5onT6oV9',
      },
      {
        name: 'Coffee Corner 360',
        google_map_url: 'https://maps.app.goo.gl/S6NWCxxX2Pj5FpH7A',
      },
      {
        name: 'Coffee Corner STM2',
        google_map_url: 'https://maps.app.goo.gl/H6mr2Xu3ZAXAGFDQ8',
      },
      {
        name: 'Coffee Corner Ang Duong',
        google_map_url: 'https://maps.app.goo.gl/4TreVmxCqwyRpNoJ7',
      },
      {
        name: 'Coffee Corner Chamkar Doung',
        google_map_url: 'https://maps.app.goo.gl/tv2xzANFtL1ua4fR7',
      },
      {
        name: 'Coffee Corner Psa Derm Thkov',
        google_map_url: 'https://maps.app.goo.gl/qW2MGU8uXJFYfvp2A',
      },
      {
        name: 'Coffee Corner Chba Ompov',
        google_map_url: 'https://maps.app.goo.gl/vG9NmgpZr89eMY3E6',
      },
      {
        name: 'Coffee Corner Koh Norea',
        google_map_url: 'https://maps.app.goo.gl/PvAwocNxGk4MfSMD9',
      },
    ],
  },
];

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

// Talks to the Supabase Storage REST API directly (rather than
// @supabase/supabase-js) because the SDK's realtime client requires a
// native WebSocket global that isn't available on Node < 22, and this
// script only needs plain object upload — no realtime features.
async function uploadLogo(brand: Brand): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET ?? 'feedback-images';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload shop logos.',
    );
  }

  const filePath = path.join(ASSETS_DIR, brand.logoFile);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(brand.logoFile).toLowerCase();
  const storagePath = `shop-logos/${brand.slug}${ext}`;

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: fileBuffer,
    },
  );
  if (!res.ok) {
    throw new Error(
      `Logo upload failed for ${brand.slug}: ${res.status} ${await res.text()}`,
    );
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Shop);

  for (const brand of brands) {
    const locationsToSeed = SEED_ALL
      ? brand.locations
      : brand.locations.slice(0, 1);

    const newLocations: Location[] = [];
    for (const location of locationsToSeed) {
      const exists = await repo.findOneBy({ name: location.name });
      if (exists) {
        console.log(`Skipped (exists): ${location.name}`);
      } else {
        newLocations.push(location);
      }
    }

    if (newLocations.length === 0) continue;

    const logoUrl = await uploadLogo(brand);
    console.log(`Uploaded logo for ${brand.slug}: ${logoUrl}`);

    for (const location of newLocations) {
      await repo.save(
        repo.create({
          name: location.name,
          google_map_url: location.google_map_url,
          logo_url: logoUrl,
          is_public: true,
        }),
      );
      console.log(`Seeded: ${location.name}`);
    }
  }

  await dataSource.destroy();
  console.log('Coffee shop seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
