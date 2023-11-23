import { Module } from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { KioskController } from './kiosk.controller';

@Module({
  providers: [KioskService],
  controllers: [KioskController]
})
export class KioskModule {}
