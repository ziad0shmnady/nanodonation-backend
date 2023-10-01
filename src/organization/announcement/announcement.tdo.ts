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

export class AnnouncementDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  type: string;
}
export class UpdateAnnouncementDto implements Prisma.AnnouncementUpdateInput {
  @IsOptional()
  @IsString()
  message?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  type?: string | Prisma.StringFieldUpdateOperationsInput;
}
