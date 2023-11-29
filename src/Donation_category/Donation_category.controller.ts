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
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Donation_categoryService } from './Donation_category.service';
import { Request, Response } from 'express';
import {
  createDonation_categoryDto,
  updateDonation_categoryDto,
} from './Donation_category.dto';
import { ValidationTypes } from 'class-validator';
@Controller('Donation_category')
export class Donation_categoryController {
  constructor(
    private readonly Donation_categoryService: Donation_categoryService,
  ) {}

  //create donation_category
  @UsePipes(ValidationPipe)
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
    @Query('type') type,
  ) {
    return this.Donation_categoryService.getAllDonation_category(
      req,
      res,
      name,
      sort_type,
      type,
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
  @UsePipes(ValidationPipe)
  @Put('/update/:id')
  async updateDonation_category(
    @Param('id') id,
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
  @Delete('/delete/:id')
  async deleteDonation_category(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id,
  ) {
    return this.Donation_categoryService.deleteDonation_category(req, res, id);
  }
  
}
