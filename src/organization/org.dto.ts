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

export class OrgDTO {
  org_id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  category
  @IsOptional()
  @IsString()
  description
  @IsNotEmpty()
  @IsString()
  company_registeration: string;

  @IsNotEmpty()
  @IsString()
  merchant_id: string;

  @IsNotEmpty()
  @IsString()
  payment_processor: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  primary_color: string;

  @IsOptional()
  @IsString()
  secondary_color: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  twitter: string;

  @IsOptional()
  @IsString()
  instagram: string;

  @IsOptional()
  @IsString()
  linkedin: string;

  @IsOptional()
  @IsString()
  tiktok: string;
  @IsOptional()
  @IsString()
  websiteLink
 
}



export class UpdateOrgDto implements Prisma.OrganizationUpdateInput {
  
  @IsOptional()
  @IsString()
  org_id?: string | Prisma.StringFieldUpdateOperationsInput;
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
  category
  @IsOptional()
  @IsString()
  description
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
  @IsOptional()
  @IsString()
  websiteLink?: string | Prisma.NullableStringFieldUpdateOperationsInput;
}
