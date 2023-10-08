import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createDonation_categoryDto,
  updateDonation_categoryDto,
} from './Donation_category.dto';

@Injectable()
export class Donation_categoryService {
  constructor(private prisma: PrismaService) {}

  //create donation_category
  async createDonation_category(
    req,
    res,
    createDonation_categoryDto,
  ): Promise<createDonation_categoryDto> {
    try {
      const donation_category = await this.prisma.donation_Category.create({
        data: {
          ...createDonation_categoryDto,
        },
      });
      return res.status(HttpStatus.OK).json(donation_category);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDonation_category(
    req,
    res,
    name,
    sort_type,
  ): Promise<createDonation_categoryDto> {
    try {
      const donation_category = await this.prisma.donation_Category.findMany({
        where: {
          name: {
            contains: name, // "gte" stands for "greater than or equal to"
          },
        },
        orderBy: {
          created_at: sort_type,
        },
      });
      return res.status(HttpStatus.OK).send(donation_category);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getDonation_categoryById(
    req,
    res,
    id,
  ): Promise<createDonation_categoryDto> {
    try {
      const donation_category = await this.prisma.donation_Category.findUnique({
        where: {
          donation_category_id: id,
        },
      });
      return res.status(HttpStatus.OK).send(donation_category);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //update donation_category
  async updateDonation_category(
    id,
    req,
    res,

    updateDonation_categoryDto,
  ): Promise<updateDonation_categoryDto> {
    try {
     
      const donation_category = await this.prisma.donation_Category.update({
        where: {
          donation_category_id: id,
        },
        data: {
          ...updateDonation_categoryDto,
        },
      });
      return res.status(HttpStatus.OK).json(donation_category);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //delete donation_category
  async deleteDonation_category(
    req,
    res,
    id,
  ): Promise<createDonation_categoryDto> {
    try {
      const donation_category = await this.prisma.donation_Category.delete({
        where: {
          donation_category_id: id,
        },
      });
      return res
        .status(HttpStatus.OK)
        .send('donation_category deleted successfully');
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
