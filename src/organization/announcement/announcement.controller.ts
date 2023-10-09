import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementDto, UpdateAnnouncementDto, getAnnouncementDto } from './announcement.tdo';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard } from 'src/admin/admin.guard';
import { Request, Response } from 'express';
import { RolesGuard } from 'src/roles/role.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  //create announcement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.employee)
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
  //get all announcement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.employee)
  @Get('/getAllAnnouncement')
  async getAllAnnouncement(
    @Query("sort_type") sort_type: string,
    @Body(ValidationPipe) getAnnouncementDto: getAnnouncementDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.announcementService.getAllAnnouncement(
      req,
      res,
      getAnnouncementDto,
      sort_type
    );
  }

  //update announcement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.employee)
  @Put('/updateAnnouncement/:id')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body(ValidationPipe) UpdateAnnouncementDto: UpdateAnnouncementDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.announcementService.updateAnnouncement(
      id,req,
      res,
      UpdateAnnouncementDto,
    );
  }
  //delete announcement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.employee)
  @Delete('/deleteAnnouncement/:id')
  async deleteAnnouncement(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.announcementService.deleteAnnouncement(id, req, res);
  }

}
