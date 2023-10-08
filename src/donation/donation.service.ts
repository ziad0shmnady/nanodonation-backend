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
    const donation = await this.prisma.donation.create({
      data: {
        ...createDonationDto,
      },
    });
    return res.status(HttpStatus.OK).json(donation);
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
            gte: parseInt(amount), // "gte" stands for "greater than or equal to"
          },
        },
        orderBy: {
          created_at: sort_type,
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
