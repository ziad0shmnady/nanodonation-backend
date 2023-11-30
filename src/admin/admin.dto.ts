import { $Enums, Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class adminDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: $Enums.Role;
  @IsOptional()
  @IsString()
  org_id?: string;
}

export class updateAdminDto implements Prisma.AdminUpdateInput {
  @IsOptional()
  @IsString()
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  password?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  status?:
    | Prisma.EnumstatusKioskFieldUpdateOperationsInput
    | $Enums.statusKiosk;
}
