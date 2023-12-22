import { Module } from '@nestjs/common';
import { CardPointeController } from './card-pointe.controller';
import { CardPointeService } from './card-pointe.service';


@Module({
    imports: [],
    controllers: [CardPointeController],
    providers: [CardPointeService],
})
export class CardPointeModule {}
