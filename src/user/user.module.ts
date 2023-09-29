import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
// import { IsEmailUniqueConstraint } from './user.constraint';


@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController,],
  providers: [UserService,AdminService,PrismaService],
  exports:[UserService]
})
export class UserModule {}
