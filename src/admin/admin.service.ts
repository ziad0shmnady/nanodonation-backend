import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { updateAdminDto } from './admin.dto';
import { UserDTO } from 'src/user/user.dto';
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

  async getAllAdmins(req, res): Promise<UserDTO> {
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

  async createAdmin(req, res, adminDTO): Promise<UserDTO> {
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

    const admin = await this.prisma.admin.create({
      data: {
        ...adminDTO,

        org_id: org.org_id,
      },
    });
    return res.status(HttpStatus.CREATED).send(admin);
  }

  async updateAdmin(
    req,
    res,
    updateAdminDto,
    admin_id,
  ): Promise<updateAdminDto> {
    try {
      const admin = await this.prisma.admin.update({
        where: {
          admin_id: admin_id,
        },
        data: {
          ...updateAdminDto,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteAdmin(req, res, admin_id) {
    try {
      const admin = await this.prisma.admin.delete({
        where: {
          admin_id: admin_id,
        },
      });
      return res.status(HttpStatus.OK).send('admin deleted');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAdminByName(req: any, res: any, name: string) {
    try {
      const admin = await this.prisma.admin.findMany({
        where: {
          //use contains to search for a substring
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
