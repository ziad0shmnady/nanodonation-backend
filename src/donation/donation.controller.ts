import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './donation.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/roles/role.enum';
import { UUID } from 'crypto';
@Controller('donation')
export class DonationController {
  constructor(private donationService: DonationService) {}

  //create donation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('/create')
  async createDonation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createDonationDto: CreateDonationDto,
  ) {
    return this.donationService.createDonation(req, res, createDonationDto);
  }

  //get all donations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAll')
  async getAllDonations(
    @Query('amount') amount: String,
    @Query('sort_type') sort_type: String,
    @Query('kiosk_id') kiosk_id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.donationService.getAllDonations(req, res, amount, sort_type,kiosk_id);
  }

  //get donation by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('getOneUnique/:id')
  async getDonationById(
    @Param('id') id: String,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.donationService.getDonationById(req, res, id);
  }
  //delete donation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('delete/:id')
  async deleteDonation(
    @Param('id') id: String,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.donationService.deleteDonation(req, res, id);
  }

  //get statistics for donations 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Owner)
  @Get('getStatistics')
  async getStatistics(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter_by') filter_by: String,
  ) {
    return this.donationService.getDonationStatistics(req, res,filter_by);
  }
}
