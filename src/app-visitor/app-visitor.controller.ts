import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AppVisitorService } from './app-visitor.service';

@Controller('app-visitors')
export class AppVisitorController {
  constructor(private readonly appVisitorService: AppVisitorService) {}

  @Post()
  logVisit(@Body('type') type: string) {
    return this.appVisitorService.logVisit(type ?? 'telegram');
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin')
  getStats(@Query('type') type?: string, @Query('period') period?: string) {
    return this.appVisitorService.getStats(type, (period as any) ?? '30d');
  }
}
