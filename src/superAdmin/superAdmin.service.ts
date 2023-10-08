import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuperAdminDto, SuperAdminUpdateDto } from './superAdmin.dto';

@Injectable()
export class SuperAdminService {
  constructor(private prismaService: PrismaService) {}

  async getSuperAdminById(id: UUID) {
    return await this.prismaService.superAdmin.findUnique({
      where: {
        super_admin_id: id,
      },
    });
  }

  async createSuperAdmin(superAdminDto, req, res): Promise<SuperAdminDto> {
    try {
      const admin = await this.prismaService.superAdmin.create({
        data: {
          ...superAdminDto,
        },
      });
      return res.status(HttpStatus.CREATED).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllSuperAdmins(
    req,
    res,
    filter_name,
    sort_type,
  ): Promise<SuperAdminDto> {
    try {
      const admins = await this.prismaService.superAdmin.findMany({
        where: {
          name: {
            contains: filter_name,
            mode: 'insensitive',
          },
        },
        orderBy: {
          created_at: sort_type,
        },
      });

      return res.status(HttpStatus.OK).send(admins);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSuperAdmin(
    superAdminDto,
    req,
    res,
  ): Promise<SuperAdminUpdateDto> {
    try {
      const super_admin_id = req.user;
      const admin = await this.prismaService.superAdmin.update({
        where: {
          super_admin_id: super_admin_id.userId,
        },
        data: {
          ...superAdminDto,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteSuperAdmin(res, req): Promise<SuperAdminDto> {
    try {
      const admin = await this.prismaService.superAdmin.delete({
        where: {
          super_admin_id: req.user.userId,
        },
      });
      return res.status(HttpStatus.OK).send('admin deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //get current super admin
  async getCurrentSuperAdmin(req, res): Promise<SuperAdminDto> {
    try {
      const admin = await this.prismaService.superAdmin.findUnique({
        where: {
          super_admin_id: req.user.userId,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
