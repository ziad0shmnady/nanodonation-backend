import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAdminById(id: string) {
    return await this.prisma.admin.findUnique({
      where: {
        admin_id: id,
      },
    });
  }

  async getAllAdmins(req, res) {
    try {
      const admin = await this.prisma.admin.findMany();
      //check if user returm empty array
      if (admin.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  catch(error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }

  async createAdmin(req, res, adminDTO) {
    const salt = await bcrypt.genSalt();
    //check if user already exists
    //get org id from admin
    const org = await this.prisma.admin.findUnique({
      where: {
        admin_id: req.user.userId,
      },
      select: {
        org_id: true,
      },
    });

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const admin = await this.prisma.admin.create({
      data: {
        ...adminDTO,
        password: hashPassword,
        org_id: org.org_id,
      },
    });
    return res.status(HttpStatus.CREATED).send(admin);
  }
}
