import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrgModule } from './organization/org.module';
import { AdminModule } from './admin/admin.module';
import { SuperAdminModule } from './superAdmin/superAdmin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DonationModule } from './donation/donation.module';
import { Donation_categoryModule } from './Donation_category/Donation_category.module';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payments/payment.module';
import { KioskModule } from './kiosk/kiosk.module';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    ThrottlerModule.forRoot([
      {
        ttl: 0.2,
        limit: 2,
      },
    ]),
    OrgModule,
    UserModule,
    AuthModule,
    AdminModule,
    SuperAdminModule,
    DonationModule,
    Donation_categoryModule,
    MailModule,
    PaymentModule,
    KioskModule
  ],
  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
