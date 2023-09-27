import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
