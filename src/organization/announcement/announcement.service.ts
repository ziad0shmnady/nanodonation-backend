import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnnouncementDto ,UpdateAnnouncementDto} from './announcement.tdo';
@Injectable()
export class AnnouncementService {
  constructor(private readonly prismaService: PrismaService) {}
  //create announcement
  async createAnnouncement(
    req,
    res,
    AnnouncementDto,
  ): Promise<AnnouncementDto> {
    try {
      const org = await this.prismaService.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      if (!org) {
        var orgId = AnnouncementDto.org_id;
      } else {
        orgId = org.org_id;
      }

      // const { title, description } = req.body;
      const announcement = await this.prismaService.announcement.create({
        data: {
          ...AnnouncementDto,
          org_id: orgId,
        },
      });
      return res.status(HttpStatus.CREATED).send(announcement);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //get all announcement
  async getAllAnnouncement(
    req,
    res,
    getAnnouncementDto,
    sort_type
  ): Promise<AnnouncementDto> {
    try {
      const org = await this.prismaService.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      if (!org) {
        var orgId = getAnnouncementDto.org_id;
      } else {
        orgId = org.org_id;
      }

      const announcement = await this.prismaService.announcement.findMany(

        {
          where: {
            org_id: orgId,
          },
          orderBy: {
            created_at: sort_type === 'asc' ? 'asc' : 'desc',
          },
        },
      );
      return res.status(HttpStatus.OK).send(announcement);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //update announcement
  async updateAnnouncement(
    id,
    req,
    res,
    UpdateAnnouncementDto,

  ): Promise<UpdateAnnouncementDto> {
    try {
      

      const announcement = await this.prismaService.announcement.update({
        where: {
          announcement_id: id,
        },
        data: {
          ...UpdateAnnouncementDto,

        },
      });
      return res.status(HttpStatus.OK).send(announcement);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //delete announcement
  async deleteAnnouncement(id, req, res): Promise<AnnouncementDto> {
    try {
      const announcement = await this.prismaService.announcement.delete({
        where: {
          announcement_id: id,
        },
      });
      return res.status(HttpStatus.OK).send(announcement);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
