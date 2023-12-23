import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { KioskDTO } from './kiosk.dto';
import { Request, Response } from 'express';

@Injectable()
export class KioskService {
  constructor(private prismService: PrismaService) {}

  // create a new kiosk
  async createKiosk(req: Request, res: Response, kioskDTO: KioskDTO) {
    try {
      const { name, org_id } = kioskDTO;
      // outomatically generate username and password
      const username = name + '@kiosk.com';
      const password = Math.random().toString(36).slice(-8);
      //check if kiosk with this username already exists
      const existingKiosk = await this.prismService.kiosk.findUnique({
        where: { username: username },
      });
      if (existingKiosk) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'Kiosk with this name already exists' });
      }
      const kiosk = await this.prismService.kiosk.create({
        data: {
          name,
          org_id,
          username,
          password,
        },
      });
      return res.status(HttpStatus.CREATED).json({
        message: 'Kiosk created successfully',
        data: kiosk,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // get all kiosks with filter and sort
  async getAllKiosk(req, res, filter_name, sort_type, org_id) {
    try {
      // check role of user from token
      const role = req.user.role;

      //check if user is super admin
      if (role === 'SuperAdmin') {
        // get all kiosks
        const kiosks = await this.prismService.kiosk.findMany({
          where: {
            name: {
              contains: filter_name, // "gte" stands for "greater than or equal to"
            },
            org_id: org_id,
          },
          orderBy: {
            created_at: sort_type,
          },
        });
        return res.status(HttpStatus.OK).json({
          data: kiosks,
        });
      }
      //check if user is oge_admin return all kiosks of his org
      else if (role === 'owner') {
        // get org id from token
        const admin = await this.prismService.admin.findUnique({
          where: {
            admin_id: req.user.userId,
          },
        });
        // get all kiosks
        const kiosks = await this.prismService.kiosk.findMany({
          where: {
            name: {
              contains: filter_name, // "gte" stands for "greater than or equal to"
            },
            org_id: admin.org_id,
          },
          orderBy: {
            created_at: sort_type,
          },
        });
        return res.status(HttpStatus.OK).json({
          data: kiosks,
        });
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateKiosk(req, res, id, UpdateKioskDto) {
    try {
      const kiosk = await this.prismService.kiosk.update({
        where: {
          kiosk_id: id,
        },
        data: {
          ...UpdateKioskDto,
        },
      });
      return res.status(HttpStatus.OK).json({
        message: 'Kiosk updated successfully',
        data: kiosk,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get kiosk by id
  async getKioskById(req, res, id) {
    try {
      // check if org for this kiosk is the same as org for user
      const role = req.user.userId;
      const org_id = await this.prismService.admin.findUnique({
        where: {
          admin_id: role,
        },
        select: {
          org_id: true,
        },
      });

      const kiosk = await this.prismService.kiosk.findUnique({
        where: {
          kiosk_id: id,
        },
      });
      if (kiosk.org_id !== org_id.org_id) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      } else {
        return res.status(HttpStatus.OK).json({
          data: kiosk,
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
