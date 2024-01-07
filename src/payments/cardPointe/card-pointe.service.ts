import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class CardPointeService {
  cardpointeapi = axios.create({
    baseURL: process.env.BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    auth: {
      username: process.env.CARDPOINTE_USERNAME,
      password: process.env.CARDPOINTE_PASS,
    },
  });
  constructor(
    private prismService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  // get user credit card from token
  async getCreditCard(req, res) {
    try {
      const creditCards = await this.prismService.creditCard.findUnique({
        where: {
          user_id: req.user.userId,
        },
      });
      if (!creditCards) {
        return res.status(404).send({ message: 'no credit card found' });
      }
      return res.status(200).send(creditCards);
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error getting credit card' });
    }
  }
  async userDonate(req, res) {
    try {
      const body = req.body;

      // add data from the request to donation database
      const donation = await this.prismService.donation.create({
        data: {
          amount: body.amount,
          status: 'pending',
          source: 'mobile',
          type: body.type,
          ...(body.type === 'recurring' && {
            duration: body.duration,
            frequency: body.frequency,
          }),
          donation_category_id: body.donation_category_id,
          org_id: body.org_id,
          kiosk_id: body.kiosk_id || null,
          user_id: req.user.userId,
          email: body.email,
        },
      });
      //add data from the request to object
      let data = null;
      if (body.card_id) {
        const creditCard = await this.prismService.creditCard.findUnique({
          where: {
            credit_card_id: body.card_id,
          },
        });
        data = {
          merchid: process.env.MERCHID,
          account: creditCard.card_number,
          amount: body.amount,
          expiry: creditCard.expiry_date,
          cvv2: creditCard.cvv,
          orderid: donation.donation_id,
        };
      } else {
        data = {
          merchid: process.env.MERCHID,
          account: body.token,
          amount: body.amount,
          expiry: body.expiry,
          cvv2: body.cvv,
          orderid: donation.donation_id,
        };
        if (body.save_card) {
          await this.prismService.creditCard.upsert({
            where: {
              user_id: req.user.userId,
            },
            update: {
              expiry_date: body.expiry,
              card_number: body.token,
              cvv: body.cvv,
            },
            create: {
              user_id: req.user.userId,
              expiry_date: body.expiry,
              card_number: body.token,
              cvv: body.cvv,
            },
          });
        }
      }
      const paymentRes = await this.cardpointeapi.post('/auth', data);
      console.log(paymentRes.data);
      // check if the payment is success
      const paymentStatus =
        paymentRes.data.respstat === 'A' ? 'success' : 'failed';
      await this.prismService.donation.update({
        where: {
          donation_id: donation.donation_id,
        },

        data: {
          status: paymentStatus,
          transaction_id: paymentRes.data.retref,
          last_four_digits: paymentRes.data.token,
        },
      });

      if (paymentStatus === 'success') {
        if (body.type === 'recurring') {
          const creditCard = await this.prismService.creditCard.create({
            data: {
              user_id: body.user_id,
              expiry_date: body.expiry,
              card_number: body.token,
              cvv: body.cvv,
            },
          });
          await this.prismService.cronJob.create({
            data: {
              user_id: body.user_id,
              amount: body.amount,
              duration: body.duration,
              frequency: body.frequency,
              credit_card_id: creditCard.credit_card_id,

              next_payment:
                body.duration === 'monthly'
                  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              merchid: process.env.MERCHID,
            },
          });
        }
        //
      }

      return res.status(200).send(paymentRes.data);
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating paymnet' });
    }
  }
  async guestDonate(req, res) {
    try {
      const body = req.body;
      // add data from the request to donation database
      const donation = await this.prismService.donation.create({
        data: {
          amount: body.amount,
          status: 'pending',
          source: body.source,
          type: body.type,
          ...(body.type === 'recurring' && {
            duration: body.duration,
            frequency: body.frequency,
          }),
          donation_category_id: body.donation_category_id,
          org_id: body.org_id,
          kiosk_id: body.kiosk_id || null,
          user_id: body.user_id || null,
          email: body.email,
        },
      });
      //add data from the request to object
      const data = {
        merchid: process.env.MERCHID,
        account: body.token,
        amount: body.amount,
        expiry: body.expiry,
        cvv2: body.cvv,
        orderid: donation.donation_id,
        save_care: body.save_card || false,
      };

      const paymentRes = await this.cardpointeapi.post('/auth', data);
      console.log(paymentRes.data);
      // check if the payment is success
      const paymentStatus =
        paymentRes.data.respstat === 'A' ? 'success' : 'failed';
      await this.prismService.donation.update({
        where: {
          donation_id: donation.donation_id,
        },

        data: {
          status: paymentStatus,
          transaction_id: paymentRes.data.retref,
          last_four_digits: paymentRes.data.token,
        },
      });

      if (paymentStatus === 'success') {
        if (body.type === 'recurring') {
          const creditCard = await this.prismService.creditCard.create({
            data: {
              user_id: body.user_id,
              expiry_date: body.expiry,
              card_number: body.token,
              cvv: body.cvv,
            },
          });
          await this.prismService.cronJob.create({
            data: {
              user_id: body.user_id,
              amount: body.amount,
              duration: body.duration,
              frequency: body.frequency,
              credit_card_id: creditCard.credit_card_id,

              next_payment:
                body.duration === 'monthly'
                  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              merchid: process.env.MERCHID,
            },
          });
        }
        //
      }

      return res.status(200).send(paymentRes.data);
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating paymnet' });
    }
  }

  // cronJob function
  // runn every day at 12 pm
  @Cron('0 12 * * *')
  async cronJob(req, res) {
    // get all cronjobs if next payment is today exclude time

    const cronJobs = await this.prismService.cronJob.findMany({
      where: {
        next_payment: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: {
        credit_card: true,
      },
    });

    //get credit card info from the cronjob
    for (let i = 0; i < cronJobs.length; i++) {
      const data = {
        merchid: process.env.MERCHID,
        account: cronJobs[i].credit_card.card_number,
        amount: cronJobs[i].amount,
        expiry: cronJobs[i].credit_card.expiry_date,
        cvv: cronJobs[i].credit_card.cvv,
      };

      const paymentRes = await this.cardpointeapi.post('/auth', data);
      console.log(paymentRes.data);
      // check if the payment is success
      const paymentStatus =
        paymentRes.data.respstat === 'A' ? 'success' : 'failed';

      if (paymentStatus === 'success') {
        if (cronJobs[i].counter + 1 === cronJobs[i].frequency) {
          await this.prismService.cronJob.delete({
            where: {
              cron_job_id: cronJobs[i].cron_job_id,
            },
          });
          return res.send(paymentRes.data);
        }
        await this.prismService.cronJob.update({
          where: {
            cron_job_id: cronJobs[i].cron_job_id,
          },

          data: {
            counter: cronJobs[i].counter + 1,
            next_payment:
              cronJobs[i].duration === 'monthly'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      return res.send(paymentRes.data);
    }
  }
}
