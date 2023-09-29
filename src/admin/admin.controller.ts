import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard } from './admin.guard';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get all admins
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get('/getAllAdmins')
  async getAllAdmins(@Req() req: Request, @Res() res: Response) {
    return this.adminService.getAllAdmins(req, res);
  }

  //create new admin
    @UseGuards(JwtAuthGuard, OwnerGuard)
    @Post('/createAdmin')
    async createAdmin(
      @Req() req: Request,
      @Res() res: Response,
      @Body() adminDTO,
    ) {
      return this.adminService.createAdmin(req, res, adminDTO);
    }
}
