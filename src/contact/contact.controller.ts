import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { ContactSubmission } from './contact-submission.entity';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public — anyone can submit without logging in.
  @Post()
  create(@Body() dto: CreateContactDto): Promise<ContactSubmission> {
    return this.contactService.create(dto);
  }

  // Super-admin only — read all submissions from the dashboard.
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin')
  findAll(): Promise<ContactSubmission[]> {
    return this.contactService.findAll();
  }

  // Super-admin only — update status of a submission.
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactStatusDto,
  ): Promise<ContactSubmission> {
    return this.contactService.updateStatus(id, dto.status);
  }
}
