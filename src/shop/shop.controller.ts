import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ShopService } from './shop.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { Shop } from './shop.entity';

@Controller('shops')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // Public — feedback form needs the shop list without authentication
  @Get()
  findAll(): Promise<Shop[]> {
    return this.shopService.findAll();
  }

  // Returns the shop owned by the currently logged-in shop-admin (null if none)
  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shop-admin')
  async getMine(@Req() req: any): Promise<Shop | null> {
    return this.shopService.findByOwnerId(req.user.id);
  }

  // Registers a new shop and initialises its subscription period.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shop-admin')
  async createShop(@Req() req: any, @Body() dto: CreateShopDto): Promise<Shop> {
    const shop = await this.shopService.createShop(dto.name, req.user.id, dto.plan);
    await this.subscriptionService.initialize(shop.id, shop.plan);
    return shop;
  }

  // Updates the subscription plan for the currently logged-in shop-admin's shop.
  @Patch('mine/plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shop-admin')
  updatePlan(@Req() req: any, @Body() dto: UpdatePlanDto): Promise<Shop> {
    return this.shopService.updatePlan(req.user.id, dto.plan);
  }
}
