import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementDto } from './announcement.tdo';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard } from 'src/admin/admin.guard';
import { Request, Response } from 'express';
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  //create announcement
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post('/createAnnouncement')
  async createAnnouncement(
    @Body(ValidationPipe) AnnouncementDto: AnnouncementDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.announcementService.createAnnouncement(
      req,
      res,
      AnnouncementDto,
    );
  }
}
