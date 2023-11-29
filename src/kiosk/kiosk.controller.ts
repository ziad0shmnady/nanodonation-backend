import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Put,
  UsePipes,
  Param,
  ValidationPipe
} from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { KioskDTO } from './kiosk.dto';
import { Request, Response } from 'express';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Role } from 'src/roles/role.enum';
import { UUID } from 'crypto';
import { UpdateKioskDto } from './kiosk.dto';
@Controller('kiosk')
export class KioskController {
  constructor(private kioskService: KioskService) {}

  // create a new kiosk
  @Post('/create')
  //add validation pipe
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @UsePipes(ValidationPipe)
  async createKiosk(
    @Body() kioskDTO: KioskDTO, // Use a different variable name to avoid conflict with the class name
    @Req() req,
    @Res() res,
  ) {
    return this.kioskService.createKiosk(req, res, kioskDTO); // Pass kioskDTO instead of KioskDTO
  }
  //get all kiosks with filter and sort
  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  async getAllKiosk(
    @Req() req,
    @Res() res,
    @Query('filter_name') filter_name: String,
    @Query('sort_type') sort_type: String,
    @Query('org_id') org_id: UUID,
  
  ) {
    return this.kioskService.getAllKiosk(req, res,filter_name,sort_type,org_id);
  }
  //edite kiosk by id
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.kiosk)
  @UsePipes(ValidationPipe)
  @Put('/update/:id')
  async updateKiosk(
    @Param('id') id: UUID,
    @Body() UpdateKioskDto: UpdateKioskDto,
    @Req() req,
    @Res() res,
  ){
    return this.kioskService.updateKiosk(req,res,id,UpdateKioskDto);
  }
  //get kiosk by id
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SuperAdmin,Role.Owner,Role.kiosk)

  @Get('/getById/:id')
  async getKioskById(
    @Req() req,
    @Res() res,
    @Param('id') id: UUID,
  ) {
    return this.kioskService.getKioskById(req, res, id);
  }

}
