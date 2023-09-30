import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SuperAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SuperAdminUpdateDto implements Prisma.superAdminUpdateInput {
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
}
