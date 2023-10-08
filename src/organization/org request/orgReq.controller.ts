import {
  Body,
  Controller,
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
import { Request, Response } from 'express';
import { OrgReqService } from './orgReq.service';
import { ZodValidationReqEmail } from '../org-validation.pipe';
import { ReqDTO } from './orgReq.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { approvedDTO } from './orgReq.dto';
@Controller('OrgReq')
export class OrgReqController {
  constructor(private readonly orgReqService: OrgReqService) {}
  // create new org request
  @UsePipes(ValidationPipe, ZodValidationReqEmail)
  @Post('/createRequest')
  async createOrgRequest(
    @Body() reqDTO: ReqDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgReqService.createOrgRequest(req, res, reqDTO);
  }

  //chage org request status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Put('/changeRequestStatus')
  async changeOrgRequestStatus(@Req() req: Request, @Res() res: Response) {
    return this.orgReqService.changeOrgRequestStatus(req, res);
  }
  // get all org request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAllRequests')
  async getAllOrgRequests(
  @Query('filter_name') filter_name: String
    ,@Query('sort_type') sort_type: String,
    @Req() req: Request, @Res() res: Response) {
    return this.orgReqService.getAllOrgRequests(req, res,filter_name,sort_type);
  }
  // get org request by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getRequestById/:request_id')
  async getOrgRequestById(@Req() req: Request, @Res() res: Response) {
    return this.orgReqService.getOrgRequestById(req, res);
  }
  // get org request by name using query
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getRequestByName')
  async getOrgRequestByName(
    @Query('name') query: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgReqService.getOrgRequestByName(req, res, query);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  // change org request status to approved
  @Put('/approveRequest')
  async approveOrgRequest(
    @Body(ValidationPipe) approvedDTO: approvedDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgReqService.approveOrgRequest(req, res);
  }
}
