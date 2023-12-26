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
  constructor(private prismService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,) {}
  // cron job to every 10 second
  // @Cron('*/10 * * * * *', { name: 'notifications' })
  // async testCronJob() {
  //   console.log('cron job is running');
  //   const job = this.schedulerRegistry.getCronJob('notifications');

  //   job.stop();
  //   console.log(job.lastDate());
  // }
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
        account: body.token,
        amount: body.amount * 100,
        expiry: body.expiry,
        cvv2: body.cvv,
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
