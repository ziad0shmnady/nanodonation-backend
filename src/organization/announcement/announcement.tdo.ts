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
  @IsString()
  message: string;
  @IsString()
  type: string;
}
