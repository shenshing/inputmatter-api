import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { SubscriptionQuota } from './subscription-quota.entity';
import { Shop } from '../shop/shop.entity';
import { PLAN_LIMITS } from './plans.constants';

export interface QuotaStatus {
  plan: string;
  limit: number;
  used: number;
  hiddenCount: number;
  periodStart: Date;
  periodEnd: Date;
}

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subRepo: Repository<UserSubscription>,
    @InjectRepository(SubscriptionQuota)
    private readonly quotaRepo: Repository<SubscriptionQuota>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  // Called once when a shop is first registered.
  async initialize(shopId: number, plan: string): Promise<void> {
    await this.createNewPeriod(shopId, plan, new Date());
  }

  // Called on every feedback submission for a linked, owned shop.
  async incrementQuota(shopId: number): Promise<void> {
    const shop = await this.shopRepo.findOneBy({ id: shopId });
    if (!shop || !shop.ownerId) return; // skip unowned shops

    const period = await this.getOrCreateActivePeriod(shopId, shop.plan);
    await this.quotaRepo.increment({ subscriptionId: period.id }, 'count', 1);
  }

  // Returns the quota status for the shop owned by the given user.
  async getQuotaStatus(userId: string): Promise<QuotaStatus> {
    const shop = await this.shopRepo.findOneBy({ ownerId: userId });
    if (!shop) throw new NotFoundException('No shop registered for this account');

    const period = await this.getOrCreateActivePeriod(shop.id, shop.plan);
    const quota = await this.quotaRepo.findOneBy({ subscriptionId: period.id });
    const used = quota?.count ?? 0;
    const limit = PLAN_LIMITS[shop.plan] ?? PLAN_LIMITS.free;
    const hiddenCount = Math.max(0, used - limit);

    return {
      plan: shop.plan,
      limit,
      used,
      hiddenCount,
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
    };
  }

  // Lazily returns the active period, rolling forward any expired periods
  // to maintain the subscription anniversary date.
  private async getOrCreateActivePeriod(
    shopId: number,
    currentPlan: string,
  ): Promise<UserSubscription> {
    const now = new Date();

    const latest = await this.subRepo.findOne({
      where: { shopId },
      order: { periodStart: 'DESC' },
    });

    if (!latest) {
      return this.createNewPeriod(shopId, currentPlan, now);
    }

    if (latest.periodEnd > now) {
      return latest; // still active
    }

    // Roll forward from the last period end to the current period start,
    // preserving the anniversary date even if months were skipped.
    let periodStart = latest.periodEnd;
    let periodEnd = this.addOneMonth(periodStart);
    while (periodEnd <= now) {
      periodStart = periodEnd;
      periodEnd = this.addOneMonth(periodStart);
    }

    return this.createNewPeriod(shopId, currentPlan, periodStart);
  }

  private async createNewPeriod(
    shopId: number,
    plan: string,
    periodStart: Date,
  ): Promise<UserSubscription> {
    const periodEnd = this.addOneMonth(periodStart);
    const sub = this.subRepo.create({ shopId, plan, periodStart, periodEnd, status: 'active' });
    const saved = await this.subRepo.save(sub);

    const quota = this.quotaRepo.create({ shopId, subscriptionId: saved.id, count: 0 });
    await this.quotaRepo.save(quota);

    return saved;
  }

  private addOneMonth(date: Date): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d;
  }
}
