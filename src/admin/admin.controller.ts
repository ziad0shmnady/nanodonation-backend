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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard, OwnerGuard } from './admin.guard';
import { adminDTO, updateAdminDto } from './admin.dto';
import { UUID } from 'crypto';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get all admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Get('/getAllAdmins')
  async getAllAdmins(@Req() req: Request, @Res() res: Response) {
    return this.adminService.getAllAdmins(req, res);
  }

  //create new admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UsePipes(ValidationPipe)
  @Post('/createAdmin')
  async createAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() adminDTO: adminDTO,
  ) {
    return this.adminService.createAdmin(req, res, adminDTO);
  }

  //update admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UsePipes(ValidationPipe)
  @Put('/updateAdmin')
  async updateAdmin(
    @Query('admin_id') admin_id: UUID,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateAdminDto: updateAdminDto,
  ) {
    return this.adminService.updateAdmin(req, res, updateAdminDto, admin_id);
  }

  //delete admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Delete('/deleteAdmin')
  async deleteAdmin(
    @Query('admin_id') admin_id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.adminService.deleteAdmin(req, res, admin_id);
  }

  // get admin by name
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Get('/getAdminByName')
  async getAdminByName(
    @Query('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.adminService.getAdminByName(req, res, name);
  }
}
