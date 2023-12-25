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
        frquency,
        donation_category_id,
        org_id,
        kiosk_id,
        token,
        expiry,
        cvv
      } = req.body;
      // add data from the request to donation database
      const donation = await this.prismService.donation.create({
        data: {
          amount: parseFloat(amount),
          status: 'pending',
          source: source,
          type: type,
          duration: `${frquency} ${duration}s`,
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
        amount: amount * 100,
        expiry: expiry,
        cvv2: cvv,
        orderid: donation.donation_id,
      };

      const paymentRes = await this.cardpointeapi.post('/auth', data);
      console.log(paymentRes.data);
      // check if the payment is success
      const paymentStatus = paymentRes.data.respstat === 'A' ? 'success' : 'failed';
      await this.prismService.donation.update({
        where: {
          donation_id: donation.donation_id,
        },
        data: {
          status:paymentStatus,
          transaction_id: paymentRes.data.retref,
        },
      });

      return res.status(200).send({ status: paymentRes.data.respstat });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating paymnet' });
    }
  }
}
//cron job
