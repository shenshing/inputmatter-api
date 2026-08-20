/**
 * Shared engine for seeding shop brands scraped from Google Maps links.
 * Category-specific seed files (e.g. coffee-shops.seed.ts, restaurants.seed.ts)
 * supply brand data and a category tag and call seedShopBrands() — this
 * module owns the DB connection, logo upload, dedup, and Google Maps URL
 * resolution that's identical across all of them.
 *
 * By default only the first location of each brand is inserted, to avoid
 * burning through dev/staging storage — pass --all (or SEED_ALL=true) to
 * insert every location for every brand, which is what production seeding
 * should use once the brand data has been verified locally.
 *
 * Each brand's logo is uploaded once to Supabase Storage and its public URL
 * is reused across every location belonging to that brand.
 *
 * Brands with logoFile: null (no logo provided yet) are always skipped
 * unless --include-no-logo (or INCLUDE_NO_LOGO=true) is also passed — these
 * are meant to stay out of dev/staging entirely and only go to production
 * once explicitly approved.
 *
 * google_map_long_url is resolved the same way the real shop-registration
 * flow does (see shop.service.ts), by following the short link's redirect
 * server-side — see google-maps.util.ts for why that can't be left to the
 * visitor's browser.
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Shop, ShopCategory } from '../../shop/shop.entity';
import { resolveGoogleMapLongUrl } from '../../shop/google-maps.util';

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

const SEED_ALL =
  process.argv.includes('--all') || process.env.SEED_ALL === 'true';
const INCLUDE_NO_LOGO =
  process.argv.includes('--include-no-logo') ||
  process.env.INCLUDE_NO_LOGO === 'true';

export interface ShopBrandLocation {
  name: string;
  /** A maps.app.goo.gl short link, as given by the user — resolved to
   * google_map_long_url server-side below. Use null when only a
   * pre-resolved long URL is available (e.g. scraper output, which
   * captures the long URL directly and never has a short link). */
  google_map_url: string | null;
  /** Pre-resolved long URL — set this instead of triggering resolution
   * when the source data already has it (see google_map_url above). */
  google_map_long_url?: string;
}

export interface ShopBrand {
  slug: string;
  logoFile: string | null;
  locations: ShopBrandLocation[];
}

export interface SeedShopBrandsOptions {
  /** Folder name under src/database/seeds/assets/ holding this run's logo files. */
  assetsDirName: string;
  /** Applied to every location this run inserts. */
  categories: ShopCategory[];
  /** Used in log messages only, e.g. "Coffee shop" -> "Coffee shop seeding complete." */
  label: string;
}

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

// Talks to the Supabase Storage REST API directly (rather than
// @supabase/supabase-js) because the SDK's realtime client requires a
// native WebSocket global that isn't available on Node < 22, and this
// script only needs plain object upload — no realtime features.
async function uploadLogo(
  brand: ShopBrand,
  assetsDir: string,
): Promise<string | null> {
  if (!brand.logoFile) return null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET ?? 'feedback-images';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload shop logos.',
    );
  }

  const filePath = path.join(assetsDir, brand.logoFile);
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

export async function seedShopBrands(
  brands: ShopBrand[],
  options: SeedShopBrandsOptions,
): Promise<void> {
  const assetsDir = path.resolve(__dirname, 'assets', options.assetsDirName);

  await dataSource.initialize();
  const repo = dataSource.getRepository(Shop);

  for (const brand of brands) {
    if (!brand.logoFile && !INCLUDE_NO_LOGO) {
      console.log(
        `Skipped brand (no logo yet, awaiting approval): ${brand.slug}`,
      );
      continue;
    }

    const locationsToSeed = SEED_ALL
      ? brand.locations
      : brand.locations.slice(0, 1);

    const newLocations: ShopBrandLocation[] = [];
    for (const location of locationsToSeed) {
      const exists = await repo.findOneBy({ name: location.name });
      if (exists) {
        console.log(`Skipped (exists): ${location.name}`);
      } else {
        newLocations.push(location);
      }
    }

    if (newLocations.length === 0) continue;

    const logoUrl = await uploadLogo(brand, assetsDir);
    if (logoUrl) console.log(`Uploaded logo for ${brand.slug}: ${logoUrl}`);

    for (const location of newLocations) {
      const google_map_long_url =
        location.google_map_long_url ??
        (location.google_map_url
          ? await resolveGoogleMapLongUrl(location.google_map_url)
          : null);
      if (!google_map_long_url) {
        console.warn(`  ⚠ Could not resolve long URL for: ${location.name}`);
      }

      await repo.save(
        repo.create({
          name: location.name,
          google_map_url: location.google_map_url,
          google_map_long_url,
          logo_url: logoUrl,
          is_public: true,
          categories: options.categories,
        }),
      );
      console.log(`Seeded: ${location.name}`);
    }
  }

  await dataSource.destroy();
  console.log(`${options.label} seeding complete.`);
}
