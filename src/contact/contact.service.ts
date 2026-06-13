import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './contact-submission.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly repo: Repository<ContactSubmission>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactSubmission> {
    const submission = this.repo.create({
      category: dto.category,
      description: dto.description,
      shopName: dto.shopName ?? null,
      name: dto.name,
      contactInfo: dto.contactInfo,
    });

    const saved = await this.repo.save(submission);

    const payload = {
      category: dto.category,
      description: dto.description,
      shopName: dto.shopName ?? null,
      name: dto.name,
      contactInfo: dto.contactInfo,
    };

    // Fire-and-forget — failures must not block the submission.
    this.mailService.sendContactNotification(payload).catch(() => {});
    this.mailService.sendTelegramNotification(payload).catch(() => {});

    return saved;
  }

  findAll(): Promise<ContactSubmission[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string): Promise<ContactSubmission> {
    await this.repo.update(id, { status: status as any });
    const updated = await this.repo.findOneByOrFail({ id });
    return updated;
  }
}
