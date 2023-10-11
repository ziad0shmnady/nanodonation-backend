import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMailDto {
    @IsOptional()
    @IsString()
    from: string;
    @IsNotEmpty()
    @IsString()
    to: string;
    @IsNotEmpty()
    @IsString()
    subject: string;
    @IsNotEmpty()
    @IsString()
    text: string;
}