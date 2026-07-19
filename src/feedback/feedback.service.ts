import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Shop } from '../shop/shop.entity';
import { ShopService } from '../shop/shop.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    private readonly shopService: ShopService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<Feedback> {
    let shop: Shop | null = null;
    let shopName: string;

    if (dto.shopId != null) {
      const shops = await this.shopService.findAll();
      shop = shops.find((s) => s.id === dto.shopId) ?? null;
      if (!shop) {
        throw new BadRequestException(`Shop with id ${dto.shopId} not found`);
      }
      shopName = shop.name;
    } else if (dto.shopName) {
      shop = await this.shopService.findOrCreateByName(dto.shopName);
      shopName = shop.name;
    } else {
      throw new BadRequestException('Either shopId or shopName must be provided');
    }

    const feedback = this.feedbackRepo.create({
      description: dto.description,
      categories: dto.categories,
      shop,
      shop_name: shopName,
      source: dto.source ?? 'web',
      rating: dto.rating ?? null,
      image_urls: dto.imageUrls ?? null,
    });

    const saved = await this.feedbackRepo.save(feedback);

    // Increment quota for the shop's current billing period (fire-and-forget).
    if (shop) {
      this.subscriptionService.incrementQuota(shop.id).catch(() => {});
    }

    return saved;
  }

  findAll(): Promise<Feedback[]> {
    return this.feedbackRepo.find({ order: { created_at: 'DESC' } });
  }

  count(): Promise<number> {
    return this.feedbackRepo.count();
  }

  // Public — paginated public feedback for a single shop, shown on the
  // feedback form so visitors can see what others said before/after
  // submitting. Page 1 is fetched on shop selection; later pages are only
  // fetched when the visitor actually pages through, so a shop with lots of
  // feedback doesn't load it all up front.
  async findPublicForShop(
    shopId: number,
    page = 1,
  ): Promise<{ items: PublicFeedback[]; total: number; page: number; totalPages: number }> {
    const limit = FEEDBACK_PUBLIC_PAGE_SIZE;
    const where = { shop: { id: shopId }, is_public: true } as const;

    const [entries, total] = await this.feedbackRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items: entries.map((f) => ({
        id: f.id,
        description: f.description,
        categories: f.categories,
        rating: f.rating,
        imageUrls: f.image_urls ?? [],
        createdAt: f.created_at,
      })),
    };
  }
}

export const FEEDBACK_PUBLIC_PAGE_SIZE = 10;

export interface PublicFeedback {
  id: string;
  description: string;
  categories: string[];
  rating: number | null;
  imageUrls: string[];
  createdAt: Date;
}
