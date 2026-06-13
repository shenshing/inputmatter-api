import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'local'}`, '.env'],
    }),
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
        entities: [Shop, Feedback, User, UserSubscription, SubscriptionQuota, ContactSubmission],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    AuthModule,
    ShopModule,
    FeedbackModule,
    SubscriptionModule,
    MailModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
