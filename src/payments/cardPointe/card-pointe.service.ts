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
      const body = req.body;
      // add data from the request to donation database
      const donation = await this.prismService.donation.create({
        data: {
          amount: body.amount,
          status: 'pending',
          source: body.source,
          type: body.type,
          ...( body.type === "recurring" && {duration: `${body.frquency} ${body.duration}s`}),
          donation_category_id: body.donation_category_id,
          org_id: body.org_id,
          kiosk_id: body.kiosk_id || null,
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

      return res.status(200).send(paymentRes.data);
    } catch (error) {
      console.log(error)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating paymnet' });
    }
  }
}
//cron job
