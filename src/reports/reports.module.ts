import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from '../feedback/feedback.entity';
import { Shop } from '../shop/shop.entity';
import { User } from '../user/user.entity';
import { DailyReportService } from './daily-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Shop, User])],
  providers: [DailyReportService],
})
export class ReportsModule {}
