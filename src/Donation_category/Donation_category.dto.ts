import { $Enums, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createDonation_categoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsOptional()
  parent_id?: string;
  @IsString()
  @IsOptional()
  org_id?: string;
  created_at: Date;
  updated_at: Date;
}

export class updateDonation_categoryDto
  implements Prisma.Donation_CategoryUpdateInput
{
  @IsString()
  @IsOptional()
  name: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsOptional()
  description: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsOptional()
  parent_id?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsOptional()
  org_id?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: $Enums.statusKiosk;
  updated_at: Date;
}
