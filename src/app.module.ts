import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrgModule } from './organization/org.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [ConfigModule.forRoot({}), OrgModule,UserModule, AuthModule,AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
