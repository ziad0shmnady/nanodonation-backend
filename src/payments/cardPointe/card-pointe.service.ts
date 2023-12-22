import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
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
  constructor(private prismService: PrismaService) {}

  async donate(req, res) {
    try {
      const {
        amount,
        source,
        type,
        duration,
        donation_category_id,
        org_id,
        kiosk_id,
        token,
        expiry,
        cronJob = false,
      } = req.body;
      // add data from the request to donation database
      const donation = await this.prismService.donation.create({
        data: {
          amount: parseFloat(amount),
          status: 'pending',
          source: source || null,
          type: cronJob ? 'recurring' : 'one_time',
          duration: cronJob ? duration : null,
          donation_category_id: donation_category_id,
          org_id: org_id,
          user_id: req.user.userId,
          kiosk_id: kiosk_id || null,
        },
      });
      //add data from the request to object
      const data = {
        merchid: process.env.MERCHID,
        account: token,
        amount: amount,
        expiry: expiry,
        orderid: donation.donation_id,
      };

      const paymentRes = await this.cardpointeapi.post('/auth', data);
      console.log(paymentRes.data);
      // check if the payment is success
      if (paymentRes.data.respstat !== 'A') {
        await this.prismService.donation.update({
          where: {
            donation_id: donation.donation_id,
          },
          data: {
            status: 'failed',
            transaction_id: paymentRes.data.retref,
          },
        });
      } else {
        // if sucess update the status in the database
        await this.prismService.donation.update({
          where: {
            donation_id: donation.donation_id,
          },
          data: {
            status: 'success',
            transaction_id: paymentRes.data.retref,
          },
        });
      }

      return res.status(400).send({ status: paymentRes.data.respstat });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating paymnet' });
    }
  }
}
//cron job
