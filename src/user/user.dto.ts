import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { z } from 'zod';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
export class UserDTO {
 @IsOptional()
  @IsString()
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()

  // @Validate(IsUniqueEmailValidator)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  //   @IsDate()
  DOB: Date;

  createdAt: Date;

  updatedAt: Date;
 
}

export class UpdateUserDto implements Prisma.UserUpdateInput {

  
  @IsOptional()
  @IsString()
  user_id?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  @IsOptional()
  @IsString()
  first_name?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  last_name?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | Prisma.StringFieldUpdateOperationsInput;
  @IsOptional()
  @IsString()
  DOB?: string | Prisma.StringFieldUpdateOperationsInput;
}
