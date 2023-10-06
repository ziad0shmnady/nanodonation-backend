import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prismaService: PrismaService) {}
    //create announcement
    async createAnnouncement(req, res,AnnouncementDto) {
      try {
    
        const {org_id} =await this.prismaService.admin.findUnique({
          where: {
            admin_id: req.user.userId,
          },
          select: {
            org_id: true,
          },
        });
      
        // const { title, description } = req.body;
        const announcement = await this.prismaService.announcement.create({
          data: {
            ...AnnouncementDto,
            org_id: org_id,
          },
        });
        return res.status(HttpStatus.CREATED).send(announcement);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    
    
}
