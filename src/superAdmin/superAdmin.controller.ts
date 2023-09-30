import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './superAdmin.service';
import { SuperAdminDto, SuperAdminUpdateDto } from './superAdmin.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SuperAdminGuard } from './superAdmin.guard';
import { UUID } from 'crypto';
@Controller('superAdmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  //create super admin
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post('/createSuperAdmin')
  async createSuperAdmin(
    @Body() superAdminDto: SuperAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const superAdmin = await this.superAdminService.createSuperAdmin(
      superAdminDto,
      req,
      res,
    );
    return superAdmin;
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get('/getAllSuperAdmin')
  async getAllSuperAdmin(@Req() req: Request, @Res() res: Response) {
    const superAdmins = await this.superAdminService.getAllSuperAdmins(
      req,
      res,
    );
    return superAdmins;
  }

  //update super admin
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Put('/updateSuperAdmin')
  async updateSuperAdmin(
    @Body() superAdminDto: SuperAdminUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const superAdmin = await this.superAdminService.updateSuperAdmin(
      superAdminDto,
      req,
      res,
    );
    return superAdmin;
  }

  //delete super admin
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete('/deleteSuperAdmin')
  async deleteSuperAdmin(
  
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const superAdmin = await this.superAdminService.deleteSuperAdmin(
    
      req,
      res,
    );
    return superAdmin;
  }
}
