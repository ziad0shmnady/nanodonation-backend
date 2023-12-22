import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CardPointeModule } from './cardPointe/card-pointe.module';


@Module({
    imports: [CardPointeModule],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
