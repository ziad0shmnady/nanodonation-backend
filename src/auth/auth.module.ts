import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';


import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import{JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from './jwt.startegy';

import{JwtAuthGuard} from './jwt-auth.guard';
import { AdminStrategy } from './admin.strategy';
import { AdminService } from 'src/admin/admin.service';
import { SuperAdminStrategy } from './superAdmin.strategy';
import { SuperAdminService } from 'src/superAdmin/superAdmin.service'; // import SuperAdminService
import { KioskStrategy } from './kiosk.strategy';

@Module({
  imports: [PassportModule,UserModule,JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1d' },
  })],
  providers: [AuthService,LocalStrategy,JwtStrategy,AdminStrategy,AdminService,SuperAdminStrategy,SuperAdminService,KioskStrategy], // add SuperAdminService to providers array
  controllers: [AuthController],
  exports: [AuthService,JwtStrategy,SuperAdminService], // add SuperAdminService to exports array
})
export class AuthModule {}
