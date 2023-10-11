import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'zeiadmohamed331@gmail.com',
        pass: 'olor uuud bkov zhna',
      },
    });
  }

  async sendMail(data, res) {
    try {
      const mailOptions = {
        from: 'zeiadmohamed@gmail.com',
        to: data.to,
        subject: data.subject,
        text: data.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return res.status(HttpStatus.OK).send('Email sent: ' + info.response);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
