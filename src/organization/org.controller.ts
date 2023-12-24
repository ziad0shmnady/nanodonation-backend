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

  //create org
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('/createOrg')
  async createOrg(
    @Body(ValidationPipe) createOrgDto: OrgDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.createOrg(req, res, createOrgDto);
  }
  //get all org
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.SuperAdmin)
  @Get('/getAllOrg')
  async getAllOrg(
    @Query('filter_name') filter_name: String,
    @Query('sort_type') sort_type: String,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.getAllOrgs(req, res, filter_name, sort_type);
  }
  //update org 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Owner)
  @Put('/updateOrg')
  async updateOrg(
    @Query('org_id') org_id: string,
    @Body(ValidationPipe) updateOrgDto: UpdateOrgDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.updateOrganization(req, res, updateOrgDto, org_id);
  }
  

  //get org by id
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.SuperAdmin)
  @Get('/getOrgById/:id')
  async getOrgById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.getOrgById(req, res, id);
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
  // get current org
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Role.Owner,Role.employee)
  @Get('/getCurrentOrg')
  async getCurrentOrg(@Req() req: Request, @Res() res: Response) {
    return this.orgService.getCurrentOrg(req, res);
  }
}
