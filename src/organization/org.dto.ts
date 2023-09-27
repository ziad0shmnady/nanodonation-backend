import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export class ReqDTO {
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  company_registeration;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class approvedDTO {
  @IsNotEmpty()
  merchant_id;
  @IsNotEmpty()
  payment_processor;
  @IsNotEmpty()
  request_id;
}

export class UpdateOrgDto implements Prisma.OrganizationUpdateInput {
  @IsOptional()
  @IsString()
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  email?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  phone?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  company_registeration?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  merchant_id?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  payment_processor?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  logo?: string;
  @IsString()
  primary_color?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  secondary_color?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  facebook?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  twitter?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  instagram?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  linkedin?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  tiktok?: string | Prisma.NullableStringFieldUpdateOperationsInput;
}
