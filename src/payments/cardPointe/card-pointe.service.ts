import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class CardPointeService {
  cardpointeapi = axios.create({
    baseURL: 'https://boltgw-uat.cardconnect.com/cardconnect/rest',
    headers: { 'Content-Type': 'application/json' },
    auth: {
      username: 'testing',
      password: 'testing123',
    },
  });
  constructor(private prismService: PrismaService) {}

  async donate(req, res) {
    const {
      amount,
      token,
      expiry,
      crolljob = false,
      merchid = 890000000117,
    } = req.body;
    //add data from the request to object
    const data = {
      merchid: merchid,
      amount: amount,
      account: token,
      expiry: expiry,
    };
    const paymentRes = await this.cardpointeapi.post('/auth', data);
    return res.status(200).send(paymentRes.status);
  }
}
//cron job
