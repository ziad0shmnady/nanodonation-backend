import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonationDto } from './donation.dto';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async createDonation(
    req,
    res,
    createDonationDto: CreateDonationDto,
  ): Promise<CreateDonationDto> {
    try {
      const donation = await this.prisma.donation.create({
        data: {
          ...createDonationDto,
        },
      });
      return res.status(HttpStatus.OK).json(donation);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllDonations(
    req,
    res,
    amount,
    sort_type,
  ): Promise<CreateDonationDto> {
    try {
      const donations = await this.prisma.donation.findMany({
        where: {
          amount: {
            gte: parseInt(amount) || 0, // "gte" stands for "greater than or equal to"
          },
        },
        orderBy: {
          created_at: sort_type,
        },
        include: {
          user: {
            select: {
              first_name: true,
              phone: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
              //get name of parent category using parent_category_id
              donation_parent: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      return res.status(HttpStatus.OK).send(donations);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDonationById(req, res, id): Promise<CreateDonationDto> {
    try {
      const donation = await this.prisma.donation.findUnique({
        where: {
          donation_id: id,
        },
      });
      return res.status(HttpStatus.OK).send(donation);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //delete donation
  async deleteDonation(req, res, id): Promise<CreateDonationDto> {
    try {
      const donation = await this.prisma.donation.delete({
        where: {
          donation_id: id,
        },
      });
      return res.status(HttpStatus.OK).send('donation deleted successfully');
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
