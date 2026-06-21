import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan, Shop } from './shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  findAll(): Promise<Shop[]> {
    return this.shopRepo.find({ order: { name: 'ASC' } });
  }

  findByOwnerId(ownerId: string): Promise<Shop | null> {
    return this.shopRepo.findOneBy({ ownerId });
  }

  async createShop(
    name: string,
    ownerId: string,
    plan: string = 'free',
    google_map_url?: string,
  ): Promise<Shop> {
    const existing = await this.shopRepo.findOneBy({ ownerId });
    if (existing) throw new ConflictException('You already have a registered shop');

    const nameTaken = await this.shopRepo.findOneBy({ name });
    if (nameTaken) throw new ConflictException('A shop with this name already exists');

    const shop = this.shopRepo.create({ name, ownerId, plan: plan as Plan, google_map_url: google_map_url ?? null });
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
