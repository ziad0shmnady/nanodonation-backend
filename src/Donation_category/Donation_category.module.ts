import { Module } from '@nestjs/common';
import { Donation_categoryController } from './Donation_category.controller';
import { DonationService } from 'src/donation/donation.service';
import { Donation_categoryService } from './Donation_category.service';
@Module({
  controllers: [Donation_categoryController],
  providers: [Donation_categoryService],
  imports: [],
  exports: [],
})
export class Donation_categoryModule {}
