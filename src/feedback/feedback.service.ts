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
}
