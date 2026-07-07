import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';

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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin', 'shop-admin')
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }
}
