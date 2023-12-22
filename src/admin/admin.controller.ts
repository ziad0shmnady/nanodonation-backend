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
import { ZodValidationEmail } from './admin-zod.pipe';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get all admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Owner)
  @Get('/getAllAdmins')
  async getAllAdmins(
    @Query('filter_name') filter_name: string,
    @Query('sort_type') sort_type: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.adminService.getAllAdmins(req, res, filter_name, sort_type);
  }

  //create new admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Owner)
  @UsePipes(ValidationPipe, ZodValidationEmail)
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
  @Roles(Role.SuperAdmin, Role.Owner, Role.employee)
  @UsePipes(ValidationPipe)
  @Put('/updateAdmin')
  async updateAdmin(
    @Query('admin_id') admin_id: String,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateAdminDto: updateAdminDto,
  ) {
    return this.adminService.updateAdmin(req, res, updateAdminDto, admin_id);
  }

  //delete admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Owner)
  @Delete('/deleteAdmin')
  async deleteAdmin(
    @Query('admin_id') admin_id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.adminService.deleteAdmin(req, res, admin_id);
  }
  // get admin by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Owner)
  @Get('/getAdminById/:admin_id')
  async getAdminById(
    @Param('admin_id') admin_id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.adminService.getAdminnById(req, res, admin_id);
  }

    // forgot password
    @Post('forgotPassword')
    async forgotPassword(@Req() req: Request, @Res() res: Response) {
      return this.adminService.forgotPassword(req, res);
    }
    // verify token
    @Post('verifyToken')
    async verifyToken(@Req() req: Request, @Res() res: Response) {
      return this.adminService.verifyToken(req, res);
    }
    // reset password
    @Put('resetPassword')
    async resetPassword(@Req() req: Request, @Res() res: Response) {
      return this.adminService.resetPassword(req, res);
    }
    //change Password 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Owner, Role.employee)
    @Put('changePassword')
    async changePassword(@Req() req: Request, @Res() res: Response) {
      return this.adminService.changePassword(req, res);
    }
}
