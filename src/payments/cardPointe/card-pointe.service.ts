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

  async getCardDetails(req) {
    const body = req.body;
    if (body.card_id) {
      const creditCard = await this.prismService.creditCard.findUnique({
        where: {
          credit_card_id: body.card_id,
        },
      });
      return {
        account: creditCard.card_number,
        amount: body.amount,
        expiry: creditCard.expiry_date,
        cvv2: creditCard.cvv,
        new: false,
      };
    }
    return {
      account: body.token,
      amount: body.amount,
      expiry: body.expiry,
      cvv2: body.cvv,
      new: true,
    };
  }

  async handleSaveCardDetials(req, card) {
    const body = req.body;
    console.log(!card.new && (body.save_card || body.type === 'recurring'));
    if (card.new && (body.save_card || body.type === 'recurring')) {
      return await this.prismService.creditCard.upsert({
        where: {
          card_number: card.account,
        },
        update: {
          expiry_date: card.expiry,
          cvv: card.cvv2,
        },
        create: {
          user_id: req.user.userId,
          expiry_date: card.expiry,
          card_number: card.account,
          cvv: card.cvv2,
        },
      });
    }
    return null;
  }

  // get user credit card from token
  async getCreditCard(req, res) {
    try {
      const creditCards = await this.prismService.creditCard.findMany({
        where: {
          user_id: req.user.userId,
        },
      });
      if (creditCards.length === 0) {
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

  // user donate
  async userDonate(req, res) {
    try {
      const body = req.body;
      console.log('pending donation');
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
      console.log('getting card details');
      const cardData = await this.getCardDetails(req);
      console.log(cardData);
      console.log('sending payment');
      const paymentRes = await this.cardpointeapi.post('/auth', {
        merchid: process.env.MERCHID,
        account: cardData.account,
        amount: cardData.amount,
        cvv2: cardData.cvv2,
        expiry: cardData.expiry,
        orderid: donation.donation_id,
      });
      console.log(paymentRes.data);
      const paymentStatus =
        paymentRes.data.respstat === 'A' ? 'success' : 'failed';
      await this.prismService.donation.update({
        where: {
          donation_id: donation.donation_id,
        },
        data: {
          status: paymentStatus,
          transaction_id: paymentRes.data.retref,
          last_four_digits: paymentRes.data.token.slice(-4),
        },
      });
      if (paymentStatus === 'failed') {
        // send invoice email
        return res.status(200).send(paymentRes);
      }
      console.log('saving cc');
      const creditCard = await this.handleSaveCardDetials(req, cardData);
      console.log(creditCard);
      if (body.type === 'one_time') {
        // send invoice email
        return res.status(200).send(paymentRes);
      }
      // handle recurring
      await this.prismService.cronJob.create({
        data: {
          user_id: req.user.userId,
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
