import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Res,
  Query,
  ValidationPipe,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrgService } from './org.service';
import { Request, Response } from 'express';
import { OrgDTO, UpdateOrgDto } from './org.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard } from 'src/admin/admin.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  //get all org
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAllOrg')
  async getAllOrg(@Req() req: Request, @Res() res: Response) {
    return this.orgService.getAllOrgs(req, res);
  }
  //chage org request status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Put('/updateOrg')
  async updateOrg(
    @Body(ValidationPipe) updateOrgDto: UpdateOrgDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.updateOrganization(req, res, updateOrgDto);
  }
  //chage org request status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  //sort org by created at
  @Get('/sortOrgByCreatedAt')
  async sortOrgByCreatedAt(
    @Query('sort_type') sort_type: string, //dsec or asc

    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.sortOrgReqByCreatedAt(req, res, sort_type);
  }

  //get org by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getOrgById/:id')
  async getOrgById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.getOrgById(req, res, id);
  }

  //get org by name
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getOrgByName')
  async getOrgByName(
    @Query('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.getOrgByName(req, res, name);
  }
  //delete org
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('/deleteOrg/:id')
  async deleteOrg(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.deleteOrg(req, res, id);
  }
}
