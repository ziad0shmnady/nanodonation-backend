import { $Enums, Prisma } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDonationDto implements Prisma.DonationCreateInput {
  @IsOptional()
  @IsString()
  donation_id?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  @IsOptional()
  @IsString()
  transaction?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  org_id?: string;
  @IsOptional()
  @IsString()
  source?: string;
  @IsOptional()
  @IsEnum($Enums.statusDonation)
  status?: $Enums.statusDonation;
  @IsOptional()
  duration?: string;
  @IsOptional()
  @IsEnum($Enums.typeDonation)
  type?: $Enums.typeDonation;
}
