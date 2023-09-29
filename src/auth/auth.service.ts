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
    name: string,
    password: string,
  ): Promise<any | undefined> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        name: name,
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

  async generateJwt(user, res) {
    const payload = {
      email: user.email,
      sub: user.user_id,
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
  }

  async generateAdminJwt(admin, res) {
    const payload = {
      email: admin.name,
      sub: admin.admin_id,
      // Add any additional admin claims as needed
    };

    return res.json({
      access_token: this.jwtService.sign(payload),
    });
  }
}
