// Shared logic for import-scraped-feedback.ts (dev) and
// import-scraped-feedback-production.ts. Imports a scraper/by-name-*.json file
// (see scraper/scrape-by-name.js) into Shop + Feedback on whichever DataSource
// the caller already configured/initialized.
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { Shop } from '../shop/shop.entity';
import { Feedback } from '../feedback/feedback.entity';

// Converts Google's relative-date text ("11 months ago", "2 years ago", "a year ago",
// "Edited a year ago") into an actual Date, counted back from `reference` (the scrape
// timestamp, not "now" at import time — otherwise a delay between scraping and
// importing would skew every date). Mirrors feedback.seed.ts's daysAgo() pattern:
// created_at/updated_at are set explicitly rather than left to auto-stamp "now".
function parseRelativeDate(relativeText: string, reference: Date): Date {
  const text = relativeText.replace(/^Edited\s+/i, '').trim();

  const singular = text.match(/^an?\s+(\w+?)\s+ago$/i);
  if (singular) return unitsAgo(1, singular[1], reference);

  const plural = text.match(/^(\d+)\s+(\w+?)s?\s+ago$/i);
  if (plural) return unitsAgo(parseInt(plural[1], 10), plural[2], reference);

  return reference;
}

function unitsAgo(n: number, unit: string, reference: Date): Date {
  const d = new Date(reference);
  switch (unit.toLowerCase()) {
    case 'day': d.setDate(d.getDate() - n); break;
    case 'week': d.setDate(d.getDate() - n * 7); break;
    case 'month': d.setMonth(d.getMonth() - n); break;
    case 'year': d.setFullYear(d.getFullYear() - n); break;
    // Unrecognized unit (e.g. "hour", "minute") — leave at `reference`, close enough.
  }
  return d;
}

interface ScrapedReview {
  author_name: string;
  rating: number | null;
  relative_date: string;
  review_text: string;
  likes_count: number;
  owner_reply: string | null;
  image_urls: string[];
  categories: string[];
}

interface ScrapedShop {
  name: string;
  google_map_url: string | null;
  google_map_long_url: string | null;
  phone: string | null;
  service_options: string[] | null;
  opening_hours: { status: string | null; schedule: { day: string; hours: string }[] | null } | null;
  categories: string[];
  reviews: ScrapedReview[];
}

export async function importScrapedFeedback(dataSource: DataSource, inputFile: string): Promise<void> {
  console.log(`Reading ${inputFile}...`);
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as {
    scraped_at: string;
    shops: ScrapedShop[];
  };
  const reference = data.scraped_at ? new Date(data.scraped_at) : new Date();

  const shopRepo = dataSource.getRepository(Shop);
  const feedbackRepo = dataSource.getRepository(Feedback);

  for (const scrapedShop of data.shops) {
    let shop = await shopRepo.findOneBy({ name: scrapedShop.name });

    if (!shop) {
      shop = await shopRepo.save(
        shopRepo.create({
          name: scrapedShop.name,
          google_map_url: scrapedShop.google_map_url,
          google_map_long_url: scrapedShop.google_map_long_url,
          phone: scrapedShop.phone,
          service_options: scrapedShop.service_options,
          opening_hours: scrapedShop.opening_hours,
          categories: scrapedShop.categories as Shop['categories'],
        }),
      );
      console.log(`✓ Created shop: ${shop.name} (id ${shop.id})`);
    } else {
      console.log(`— Shop already exists, reusing as-is (not overwriting): ${shop.name} (id ${shop.id})`);
    }

    let created = 0;
    let dateFixed = 0;

    for (const review of scrapedShop.reviews) {
      const postedAt = parseRelativeDate(review.relative_date, reference);
      const existing = await feedbackRepo.findOne({
        where: { shop: { id: shop.id }, description: review.review_text },
      });

      if (existing) {
        // Already imported (e.g. before this script set dates correctly) — fix the
        // date in place rather than leave it wrongly stamped with the import time.
        if (existing.created_at.getTime() !== postedAt.getTime()) {
          existing.created_at = postedAt;
          existing.updated_at = postedAt;
          await feedbackRepo.save(existing);
          dateFixed++;
        }
        continue;
      }

      const feedback = feedbackRepo.create({
        description: review.review_text,
        rating: review.rating,
        categories: review.categories,
        image_urls: review.image_urls.length > 0 ? review.image_urls : null,
        source: 'google_maps',
        shop_name: shop.name,
        shop,
        metadata: {
          author_name: review.author_name,
          relative_date: review.relative_date,
          likes_count: review.likes_count,
          owner_reply: review.owner_reply,
        },
      });
      feedback.created_at = postedAt;
      feedback.updated_at = postedAt;
      await feedbackRepo.save(feedback);
      created++;
    }

    console.log(`  Feedback: ${created} created, ${dateFixed} existing row(s) had their date corrected.`);
  }
}
