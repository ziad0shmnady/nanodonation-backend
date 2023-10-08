import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  Query,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { Donation_categoryService } from './Donation_category.service';
import { Request, Response } from 'express';
import {
  createDonation_categoryDto,
  updateDonation_categoryDto,
} from './Donation_category.dto';
@Controller('Donation_category')
export class Donation_categoryController {
  constructor(
    private readonly Donation_categoryService: Donation_categoryService,
  ) {}

  //create donation_category
  @Post('/create')
  async createDonation_category(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createDonation_categoryDto: createDonation_categoryDto,
  ) {
    return this.Donation_categoryService.createDonation_category(
      req,
      res,
      createDonation_categoryDto,
    );
  }
  @Get('/getAll')
  async getAllDonation_category(
    @Req() req: Request,
    @Res() res: Response,
    @Query('name') name,
    @Query('sort_type') sort_type,
  ) {
    return this.Donation_categoryService.getAllDonation_category(
      req,
      res,
      name,
      sort_type,
    );
  }
  //get donation_category by id
  @Get('/getById/:id')
  async getDonation_categoryById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id,
  ) {
    return this.Donation_categoryService.getDonation_categoryById(req, res, id);
  }
  //update donation_category
  @Put('/update')
  async updateDonation_category(
    @Query('id') id,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateDonation_categoryDto: updateDonation_categoryDto,
  ) {
    return this.Donation_categoryService.updateDonation_category(
      id,
      req,
      res,
      updateDonation_categoryDto,
    );
  }
  //delete donation_category
  @Get('/delete/:id')
  async deleteDonation_category(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id,
  ) {
    return this.Donation_categoryService.deleteDonation_category(req, res, id);
  }
}
