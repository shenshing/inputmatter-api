import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as https from 'https';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('MAIL_HOST');
    if (!host) {
      this.logger.warn('MAIL_HOST not set — email notifications are disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: config.get<number>('MAIL_PORT') ?? 587,
      secure: false,
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendContactNotification(data: {
    category: string;
    description: string;
    shopName: string | null;
    name: string;
    contactInfo: string;
  }): Promise<void> {
    const to = this.config.get<string>('CONTACT_NOTIFY_EMAIL');

    if (!this.transporter || !to) {
      this.logger.log(
        `[Contact submission — email not sent] ${JSON.stringify(data)}`,
      );
      return;
    }

    const categoryLabel: Record<string, string> = {
      'feedback': 'Feedback',
      'feature-request': 'Feature Request',
      'free-trial': 'Free Trial Request',
      'book-demo': 'Book a Demo',
      'other': 'Other',
    };

    const subject = `[Contact] ${categoryLabel[data.category] ?? data.category} from ${data.name}`;

    const html = `
      <h2 style="color:#212120;font-family:sans-serif">New contact submission</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#696b63;width:140px"><strong>Category</strong></td><td>${categoryLabel[data.category] ?? data.category}</td></tr>
        <tr><td style="padding:8px 0;color:#696b63"><strong>Name</strong></td><td>${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#696b63"><strong>Contact</strong></td><td>${data.contactInfo}</td></tr>
        ${data.shopName ? `<tr><td style="padding:8px 0;color:#696b63"><strong>Shop name</strong></td><td>${data.shopName}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#696b63;vertical-align:top"><strong>Message</strong></td><td style="white-space:pre-wrap">${data.description}</td></tr>
      </table>
    `;

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM') ?? to,
      to,
      subject,
      html,
    });
  }

  async sendTelegramNotification(data: {
    category: string;
    description: string;
    shopName: string | null;
    name: string;
    contactInfo: string;
  }): Promise<void> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
      this.logger.log('[Contact submission — Telegram not configured]');
      return;
    }

    const categoryLabel: Record<string, string> = {
      'feedback': 'Feedback',
      'feature-request': 'Feature Request',
      'free-trial': 'Free Trial Request',
      'book-demo': 'Book a Demo',
      'other': 'Other',
    };

    const lines = [
      `📬 <b>New contact submission</b>`,
      ``,
      `<b>Category:</b> ${categoryLabel[data.category] ?? data.category}`,
      `<b>Name:</b> ${data.name}`,
      `<b>Contact:</b> ${data.contactInfo}`,
      data.shopName ? `<b>Shop:</b> ${data.shopName}` : null,
      ``,
      `<b>Message:</b>`,
      data.description,
    ].filter((l) => l !== null).join('\n');

    await this.telegramPost(token, chatId, lines);
  }

  // Generic Telegram push for non-contact notifications (e.g. the daily report) — same bot/chat, caller-supplied title.
  async sendTelegramReport(data: {
    title: string;
    lines: string[];
  }): Promise<void> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
      this.logger.log(`[${data.title} — Telegram not configured]`);
      return;
    }

    const text = [`<b>${data.title}</b>`, ``, ...data.lines].join('\n');
    await this.telegramPost(token, chatId, text);
  }

  private telegramPost(token: string, chatId: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
      const req = https.request(
        {
          hostname: 'api.telegram.org',
          path: `/bot${token}/sendMessage`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
        },
        (res: import('http').IncomingMessage) => {
          let raw = '';
          res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
          res.on('end', () => {
            const parsed = JSON.parse(raw);
            if (!parsed.ok) {
              this.logger.warn(`Telegram error: ${raw}`);
              reject(new Error(parsed.description ?? 'Telegram API error'));
            } else {
              resolve();
            }
          });
        },
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}
