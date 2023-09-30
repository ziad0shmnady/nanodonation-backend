import { Controller, Req, Post, UseGuards, Get, Res } from '@nestjs/common';
import { LocalAuthGuard,AdminAuthGuard, SuperAdminAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from '../admin/admin.guard'
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

  @UseGuards(JwtAuthGuard,SuperAdminGuard )
  @Get('user')
  async user(@Req() req): Promise<any> {
    return req.user;
  }
  @UseGuards(AdminAuthGuard) // Add this guard for admin login
  @Post('adminLogin') // Define the endpoint for admin login
  async adminLogin(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateAdminJwt(req.user, res); // Implement this method in AuthService
  }
  @UseGuards(SuperAdminAuthGuard) // Add this guard for admin login
  @Post('superAdminLogin') // Define the endpoint for admin login
  async SuperAdminLogin(@Req() req, @Res() res): Promise<any> {
    return this.authService.generateSuperAdminJwt(req.user, res); // Implement this method in AuthService
  }
}
