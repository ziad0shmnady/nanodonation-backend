import { Controller, Req, Post, UseGuards, Get, Res } from '@nestjs/common';
import {
  LocalAuthGuard,
  AdminAuthGuard,
  SuperAdminAuthGuard,
  kioskGuard,
} from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from '../admin/admin.guard';
import { SuperAdminGuard } from '../superAdmin/superAdmin.guard';
// import { AdminAuthGuard } from './admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateJwt(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkToken')
  async user(@Req() req): Promise<any> {
    //check if the token is not valid retrun false
    return req.user;
    
  }
  @UseGuards(AdminAuthGuard) // Add this guard for admin login
  @Post('adminLogin') // Define the endpoint for admin login
  async adminLogin(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateAdminJwt(req.user,req, res); // Implement this method in AuthService
  }
  @UseGuards(SuperAdminAuthGuard) // Add this guard for admin login
  @Post('superAdminLogin') // Define the endpoint for admin login
  async SuperAdminLogin(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateSuperAdminJwt(req.user, req,res); // Implement this method in AuthService
  }
  // kiosk login
  @UseGuards(kioskGuard)
  @Post('kioskLogin')
  async kioskLogin(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateKioskJwt(req.user, req,res);
  }

 
}
