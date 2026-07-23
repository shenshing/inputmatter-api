import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/feedback.entity';
import { ShopModule } from './shop/shop.module';
import { Shop } from './shop/shop.entity';
import { User } from './user/user.entity';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserSubscription } from './subscription/user-subscription.entity';
import { SubscriptionQuota } from './subscription/subscription-quota.entity';
import { ContactModule } from './contact/contact.module';
import { ContactSubmission } from './contact/contact-submission.entity';
import { MailModule } from './mail/mail.module';
import { AppVisitorModule } from './app-visitor/app-visitor.module';
import { AppVisitor } from './app-visitor/app-visitor.entity';
import { UploadsModule } from './uploads/uploads.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '..', `.env.${process.env.NODE_ENV ?? 'local'}`),
        join(__dirname, '..', '.env'),
      ],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        ssl: { rejectUnauthorized: false },
        entities: [Shop, Feedback, User, UserSubscription, SubscriptionQuota, ContactSubmission, AppVisitor],
        // synchronize: process.env.NODE_ENV !== 'production',
        synchronize: false 
      }),
    }),
    AuthModule,
    ShopModule,
    FeedbackModule,
    SubscriptionModule,
    MailModule,
    ContactModule,
    AppVisitorModule,
    UploadsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
