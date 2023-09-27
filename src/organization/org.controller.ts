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
} from '@nestjs/common';
import { OrgService } from './org.service';
import { Request, Response } from 'express';
import  {ReqDTO,approvedDTO}  from './org.dto';
@Controller('org')
export class OrgController {
  constructor(private orgService: OrgService) {}

  // create new org request
  @Post('/createRequest')
  async createOrgRequest(
    @Body(ValidationPipe) ReqDTO: ReqDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.createOrgRequest(req, res);
  }
  // get all org request
  @Get('/getAllRequests')
  async getAllOrgRequests(@Req() req: Request, @Res() res: Response) {
    return this.orgService.getAllOrgRequests(req, res);
  }
  // change org request status
  @Put('/changeRequestStatus')
  async changeOrgRequestStatus(@Req() req: Request, @Res() res: Response) {
    return this.orgService.changeOrgRequestStatus(req, res);
  }
  // get org request by id
  @Get('/getRequestById/:request_id')
  async getOrgRequestById(@Req() req: Request, @Res() res: Response) {
    return this.orgService.getOrgRequestById(req, res);
  }
  // get org request by name using query
  @Get('/getRequestByName')
  async getOrgRequestByName(
    @Query('name') query: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.orgService.getOrgRequestByName(req, res, query);
  }
  // change org request status to approved
  @Put('/approveRequest')
  async approveOrgRequest(
    @Body(ValidationPipe) approvedDTO: approvedDTO,@Req() req: Request, @Res() res: Response) {
    return this.orgService.approveOrgRequest(req, res);
  }
}
