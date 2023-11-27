import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonationDto } from './donation.dto';
import { userInfo } from 'os';
import { filter, first } from 'rxjs';

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
    kiosk_id,
  ): Promise<CreateDonationDto> {
    try {
      const donations = await this.prisma.donation.findMany({
        where: {
          amount: {
            gte: parseInt(amount) || 0, // "gte" stands for "greater than or equal to"
          },
          kiosk_id: kiosk_id,
        },
        orderBy: {
          created_at: sort_type,
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
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

  //get statistics for donations for a specific organization
  async getDonationStatistics(req, res, filter_by): Promise<any> {
    try {
      // get org id from user token
      const admin = req.user.userId;
      const AdminInfo = await this.prisma.admin.findUnique({
        where: {
          admin_id: admin,
        },
        select: {
          org_id: true,
        },
      });
      const today = new Date();
      // For donations within the yesterday
      const yesterdayStartDate = new Date(today);
      yesterdayStartDate.setDate(today.getDate() - 1);
      // For donations within the last year

      const FisrtYear = new Date(today.getFullYear(), 0, 2);
      // console.log('FisrtYear', FisrtYear);

      const SecondeYear = new Date(today.getFullYear() - 1, 0, 2);

      // console.log('SecondeYear', SecondeYear);
      const day = today.getDay(),
        diff = today.getDate() - day + (day == 0 ? -6 : 1);
      const first_Week = new Date(today.setDate(diff));

      // console.log('Firstweek', first_Week);
      const seconde_Week = new Date(first_Week);
      seconde_Week.setDate(first_Week.getDate() - 7);
      // console.log('seconde_Week', seconde_Week);

      const First_Month = new Date(today.getFullYear(), today.getMonth(), 2);
      // First_Month.setDate(today.getDate() - 30);
      // console.log('firstmonth', First_Month);
      const year = today.getFullYear();
      const Seconde_month = new Date(year - 1, 0, 2);
      // console.log('Seconde_month', Seconde_month);

      let filter_from;
      let filter_to;

      if (filter_by == 'today') {
        filter_from = today;
        filter_to = yesterdayStartDate;
        const filtersDay = {
          gte: today,
        };
        const statisticsToday = await this.filterDonationBydata(
          AdminInfo,
          filtersDay,
        );
        // console.log('statistics today', statisticsToday);
        const filtersYesterDay = {
          gte: yesterdayStartDate,
          lte: today,
        };
        const statisticsyesterDay = await this.filterDonationBydata(
          AdminInfo,
          filtersYesterDay,
        );
        // console.log('statistics yesterday', statisticsyesterDay);
        return res.status(HttpStatus.OK).send({
          statisticsToday: statisticsToday,
          statisticsyesterDay: statisticsyesterDay,
        });
      } else if (filter_by == 'lastweek') {
        const filtersFirtWeek = {
          gte: first_Week,
        };
        const statisticsFirstWeek = await this.filterDonationBydata(
          AdminInfo,
          filtersFirtWeek,
        );
        // console.log('statistics first week', statisticsFirstWeek);
        const filtersSecondeWeek = {
          gte: seconde_Week,
          lte: first_Week,
        };
        const statisticSsecondeWeek = await this.filterDonationBydata(
          AdminInfo,
          filtersSecondeWeek,
        );
        // console.log('statistics seconde week ', statisticSsecondeWeek);
        return res.status(HttpStatus.OK).send({
          statisticsFirstWeek: statisticsFirstWeek,
          statisticSsecondeWeek: statisticSsecondeWeek,
        });
      } else if (filter_by == 'lastmonth') {
        filter_from = First_Month;
        filter_to = Seconde_month;
        const filtersFirstMonth = {
          gte: First_Month,
        };
        const statisticsFirstMonth = await this.filterDonationBydata(
          AdminInfo,
          filtersFirstMonth,
        );
        // console.log('statistics first month', statisticsFirstMonth);

        const filtersSecondeMonth = {
          gte: Seconde_month,
          lte: First_Month,
        };
        const statisticsSecondeMonth = await this.filterDonationBydata(
          AdminInfo,
          filtersSecondeMonth,
        );
        // console.log('statistics seconde month', statisticsSecondeMonth);
        return res.status(HttpStatus.OK).send({
          statisticsFirstMonth: statisticsFirstMonth,
          statisticsSecondeMonth: statisticsSecondeMonth,
        });
      } else if (filter_by == 'lastyear') {
        const filtersFirstYear = {
          gte: FisrtYear,
        };
        const statisticsFirstYear = await this.filterDonationBydata(
          AdminInfo,
          filtersFirstYear,
        );
        // console.log('statistics first year', statisticsFirstYear);
        const filtersSecondeYear = {
          gte: SecondeYear,
          lte: FisrtYear,
        };
        const statisticsSecondeYear = await this.filterDonationBydata(
          AdminInfo,
          filtersSecondeYear,
        );
        // console.log('statistics seconde year', statisticsSecondeYear);
        return res.status(HttpStatus.OK).send({
          statisticsFirstYear: statisticsFirstYear,
          statisticsSecondeYear: statisticsSecondeYear,
        });
      }

      // get total amount of donations for this organization and number of donation and number of categories for this organization and avarage amount of donations for this organization in one query
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async filterDonationBydata(AdminInfo, filters) {
    const donationInfo = await this.prisma.donation.aggregate({
      where: {
        org_id: AdminInfo.org_id,
        status: 'success',
        updated_at: filters,
      },
      _sum: {
        amount: true,
      },
      //count number of donations
      _count: {
        donation_category_id: true,
        //count number of donations
      },
      _avg: {
        amount: true,
      },
    });
    //get number of categories for this organization from donation_category table
    const numberOfCategories = await this.prisma.donation_Category.count({
      where: {
        org_id: AdminInfo.org_id,
        updated_at: filters,
      },
    });

    const totalAmount = donationInfo._sum.amount;
    //count number of donations
    const numberOfDonations = donationInfo._count.donation_category_id;

    const averageAmount = donationInfo._avg.amount;
    const statistics = {
      totalAmount: totalAmount,
      numberOfDonations: numberOfDonations,
      numberOfCategories: numberOfCategories,
      averageAmount: averageAmount,
    };
    return statistics;
  }
}
