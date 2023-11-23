import { BadRequestException, Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<any | undefined> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    // check if password match
 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<any | undefined> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    if (!(password === admin.password)) {
      throw new BadRequestException('Invalid password');
    }

    return admin;
  }
  async validateSuperAdmin(
    email: string,
    password: string,
  ): Promise<any | undefined> {
    const admin = await this.prisma.superAdmin.findUnique({
      where: {
        email: email,
      },
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    if (!(password === admin.password)) {
      throw new BadRequestException('Invalid password');
    }

    return admin;
  }

  async validateKiosk(
    username: string,
    password: string,
  ): Promise<any | undefined> {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: {
        username: username,
      },
    });
    if (!kiosk) {
      throw new BadRequestException('Kiosk not found');
    }
    if (!(password === kiosk.password)) {
      throw new BadRequestException('Invalid password');
    }
    return kiosk;
  }
  async generateJwt(user, res) {
    const payload = {
      email: user.email,
      sub: user.user_id,
      Role: 'User',
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
  }

async generateKioskJwt(kiosk, res) {
    const payload = {
      username: kiosk.username,
      sub: kiosk.kiosk_id,
      Role: 'kiosk',
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
}

  async generateAdminJwt(admin, res) {
    const adminn = await this.prisma.admin.findUnique({
      where: {
        email: admin.email,
      },
    });
    const payload = {
      email: admin.email,
      sub: admin.admin_id,
      Role: adminn.role,
      // Add any additional admin claims as needed
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
  }

  async generateSuperAdminJwt(admin, res) {
    const payload = {
      email: admin.email,
      sub: admin.super_admin_id,
      Role: 'SuperAdmin',
      // Add any additional admin claims as needed
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
  }
}
