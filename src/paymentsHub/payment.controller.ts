import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  async initializeSdk(@Body() payload: { mid: string; gatewayPublicKey: string }) {
    return this.paymentService.initializeSdk(payload.mid, payload.gatewayPublicKey);
  }

}
