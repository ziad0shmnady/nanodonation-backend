import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './mail.dto';
import { Response } from 'express';
@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailService) {}
  @Post('sendEmail')
  async sendEmail(@Body() data: CreateMailDto, @Res() res: Response) {
    const to = 'zeiadmohamed331@gmail.com';
    const subject = 'Test Email';
    const text = 'This is a test email sent from NestJS using Nodemailer';

    this.mailerService.sendMail(data,res);
  }
}
