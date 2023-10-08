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
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/role.guard';
@Controller('superAdmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  //create super admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAllSuperAdmin')
  async getAllSuperAdmin(
    @Query('filter_name') filter_name: String,
    @Query('sort_type') sort_type: String,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const superAdmins = await this.superAdminService.getAllSuperAdmins(
      req,
      res,
      filter_name,
      sort_type,
    );
    return superAdmins;
  }

  //update super admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('/deleteSuperAdmin')
  async deleteSuperAdmin(@Req() req: Request, @Res() res: Response) {
    const superAdmin = await this.superAdminService.deleteSuperAdmin(req, res);
    return superAdmin;
  }

  // get current super admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getCurrentSuperAdmin')
  async getCurrentSuperAdmin(@Req() req: Request, @Res() res: Response) {
    const superAdmin = await this.superAdminService.getCurrentSuperAdmin(
      req,
      res,
    );
    return superAdmin;
  }
}
