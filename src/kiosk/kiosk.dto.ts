import { $Enums, Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class KioskDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;
  @IsString()
  @IsOptional()
  location?: string;
  @IsString()
  @IsNotEmpty()
  username?: string;
  @IsString()
  @IsNotEmpty()
  password?: string;
  @IsOptional()
  @IsString()
  status?: string;
  @IsUUID()
  @IsNotEmpty()
  org_id?: string;
  @IsString()
  @IsOptional()
  ip_address?: string;
}

export class UpdateKioskDto implements Prisma.KioskUpdateInput {
  @IsString()
  @IsNotEmpty()
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsNotEmpty()
  location?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsNotEmpty()
  username?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsString()
  @IsNotEmpty()
  status?: $Enums.statusKiosk; // Update the type to statusKiosk
  @IsString()
  @IsNotEmpty()
  ip_address?: string | Prisma.StringFieldUpdateOperationsInput;
}
