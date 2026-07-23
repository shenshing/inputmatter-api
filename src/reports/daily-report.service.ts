import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Feedback } from '../feedback/feedback.entity';
import { Shop } from '../shop/shop.entity';
import { User } from '../user/user.entity';
import { MailService } from '../mail/mail.service';

const REPORT_TIMEZONE = 'Asia/Phnom_Penh';

@Injectable()
export class DailyReportService {
  private readonly logger = new Logger(DailyReportService.name);

  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  // Runs every day at 07:00 Cambodia time, reporting on the prior 24h.
  @Cron('0 7 * * *', { name: 'daily-report', timeZone: REPORT_TIMEZONE })
  async sendDailyReport(): Promise<void> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      newFeedback,
      newShops,
      newUsers,
      totalFeedback,
      totalShops,
      totalUsers,
    ] = await Promise.all([
      this.feedbackRepo.count({
        where: { created_at: MoreThanOrEqual(since) },
      }),
      this.shopRepo.count({ where: { created_at: MoreThanOrEqual(since) } }),
      this.userRepo.count({ where: { createdAt: MoreThanOrEqual(since) } }),
      this.feedbackRepo.count(),
      this.shopRepo.count(),
      this.userRepo.count(),
    ]);

    const dateLabel = new Intl.DateTimeFormat('en-CA', {
      timeZone: REPORT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    await this.mailService
      .sendTelegramReport({
        title: `📊 Daily Report — ${dateLabel}`,
        lines: [
          `<b>Last 24h</b>`,
          `New feedback: ${newFeedback}`,
          `New shop registrations: ${newShops}`,
          `New user registrations: ${newUsers}`,
          ``,
          `<b>All-time totals</b>`,
          `Feedback: ${totalFeedback}`,
          `Shop registrations: ${totalShops}`,
          `User registrations: ${totalUsers}`,
        ],
      })
      .then(() => this.logger.log('Daily report sent'))
      .catch((err) => this.logger.error('Failed to send daily report', err));
  }
}
