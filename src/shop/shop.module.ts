import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Feedback } from '../feedback/feedback.entity';

@Module({
  // Feedback is registered here (not imported via FeedbackModule) purely so
  // ShopService can read per-shop feedback counts for the admin Shops tab,
  // without creating a circular dependency — FeedbackModule already imports
  // ShopModule the other way around.
  imports: [TypeOrmModule.forFeature([Shop, Feedback]), SubscriptionModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
