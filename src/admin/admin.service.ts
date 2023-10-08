import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { updateAdminDto, adminDTO } from './admin.dto';
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

  async getAllAdmins(req, res, filter_name, sort_type): Promise<adminDTO> {
    try {
      const org = await this.prisma.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      let orgId: any;
      if (!org) {
        orgId = req.body.org_id;
      } else {
        orgId = org.org_id;
      }
      const admin = await this.prisma.admin.findMany({
        where: {
          name: {
            contains: filter_name,
            mode: 'insensitive',
          },
          org_id: orgId,
        },
        orderBy: {
          created_at: sort_type,
        },
      });
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

  async createAdmin(req, res, adminDTO): Promise<adminDTO> {
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
    if (!org) {
      var orgId = adminDTO.org_id;
    } else {
      orgId = org.org_id;
    }

    const admin = await this.prisma.admin.create({
      data: {
        ...adminDTO,

        org_id: orgId,
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
      if (
        req.user.userId &&
        (req.user.role == 'owner' || req.user.role == 'employee')
      ) {
        var adminId = req.user.userId;
      } else {
        adminId = admin_id;
      }

      const admin = await this.prisma.admin.update({
        where: {
          admin_id: adminId,
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
  // get admin by id
  async getAdminnById(req, res, admin_id): Promise<adminDTO> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: {
          admin_id: admin_id,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAdminByEmail(email: string) {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      return admin;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
