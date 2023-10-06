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
