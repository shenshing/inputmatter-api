import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Plan, Shop, ShopSocialLink } from './shop.entity';
import { Feedback } from '../feedback/feedback.entity';
import { resolveGoogleMapLongUrl } from './google-maps.util';

// Hand-picked for the welcome page's "Popular near you" section — one per major chain.
const FEATURED_SHOP_NAMES = [
  'BROWN Roastery BKK',
  'Starbucks BKK',
  'TUBE COFFEE Villa Keng Kang',
  'KOI Thé VILLA KENG KANG',
];

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
  ) {}

  // Public-facing — only shops a super-admin hasn't hidden. Used by the
  // feedback form's shop picker and the public "Places" directory.
  findAll(): Promise<Shop[]> {
    return this.shopRepo.find({ where: { is_public: true }, order: { name: 'ASC' } });
  }

  async findPopular(): Promise<Shop[]> {
    const shops = await this.shopRepo.findBy({ name: In(FEATURED_SHOP_NAMES), is_public: true });
    return shops.sort(
      (a, b) => FEATURED_SHOP_NAMES.indexOf(a.name) - FEATURED_SHOP_NAMES.indexOf(b.name),
    );
  }

  // Unfiltered — used where visibility shouldn't matter, e.g. resolving a
  // shopId on feedback submission (a hidden shop can still receive feedback).
  findById(id: number): Promise<Shop | null> {
    return this.shopRepo.findOneBy({ id });
  }

  // Super-admin only — every shop regardless of visibility, with a feedback
  // count per shop for the admin Shops tab.
  async findAllForAdmin(): Promise<(Shop & { feedbackCount: number })[]> {
    const shops = await this.shopRepo.find({ order: { name: 'ASC' } });

    const counts = await this.feedbackRepo
      .createQueryBuilder('feedback')
      .select('feedback.shop_id', 'shopId')
      .addSelect('COUNT(*)', 'count')
      .where('feedback.shop_id IS NOT NULL')
      .groupBy('feedback.shop_id')
      .getRawMany<{ shopId: number; count: string }>();
    const countByShopId = new Map(counts.map((c) => [Number(c.shopId), Number(c.count)]));

    return shops.map((shop) => ({ ...shop, feedbackCount: countByShopId.get(shop.id) ?? 0 }));
  }

  async updateVisibility(id: number, isPublic: boolean): Promise<Shop> {
    const shop = await this.shopRepo.findOneBy({ id });
    if (!shop) throw new NotFoundException(`Shop with id ${id} not found`);
    shop.is_public = isPublic;
    return this.shopRepo.save(shop);
  }

  findByOwnerId(ownerId: string): Promise<Shop | null> {
    return this.shopRepo.findOneBy({ ownerId });
  }

  async createShop(
    name: string,
    ownerId: string,
    plan: string = 'free',
    google_map_url?: string,
    social_link?: ShopSocialLink[],
  ): Promise<Shop> {
    const existing = await this.shopRepo.findOneBy({ ownerId });
    if (existing) throw new ConflictException('You already have a registered shop');

    const nameTaken = await this.shopRepo.findOneBy({ name });
    if (nameTaken) throw new ConflictException('A shop with this name already exists');

    const google_map_long_url = google_map_url ? await resolveGoogleMapLongUrl(google_map_url) : null;

    const shop = this.shopRepo.create({
      name,
      ownerId,
      plan: plan as Plan,
      google_map_url: google_map_url ?? null,
      google_map_long_url,
      social_link: social_link ?? null,
    });
    return this.shopRepo.save(shop);
  }

  async updatePlan(ownerId: string, plan: string): Promise<Shop> {
    const shop = await this.shopRepo.findOneBy({ ownerId });
    if (!shop) throw new NotFoundException('No shop found for this account');
    shop.plan = plan as Plan;
    return this.shopRepo.save(shop);
  }

  async findOrCreateByName(name: string): Promise<Shop> {
    const existing = await this.shopRepo.findOneBy({ name });
    if (existing) return existing;

    const shop = this.shopRepo.create({ name, ownerId: null });
    return this.shopRepo.save(shop);
  }
}
