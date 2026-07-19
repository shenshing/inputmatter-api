import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './feedback.entity';
import { FeedbackService, PublicFeedback } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(dto);
  }

  // Public — total feedback count for marketing/stat displays
  @Get('count')
  async count(): Promise<{ count: number }> {
    return { count: await this.feedbackService.count() };
  }

  // Public — paginated public feedback for one shop, shown on the feedback form
  @Get('public')
  findPublicForShop(
    @Query('shopId') shopIdRaw: string,
    @Query('page') pageRaw?: string,
  ): Promise<{ items: PublicFeedback[]; total: number; page: number; totalPages: number }> {
    const shopId = Number(shopIdRaw);
    if (!shopIdRaw || !Number.isInteger(shopId) || shopId <= 0) {
      throw new BadRequestException('A valid shopId query param is required');
    }

    let page = 1;
    if (pageRaw !== undefined) {
      page = Number(pageRaw);
      if (!Number.isInteger(page) || page <= 0) {
        throw new BadRequestException('page must be a positive integer');
      }
    }

    return this.feedbackService.findPublicForShop(shopId, page);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin', 'shop-admin')
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }
}
