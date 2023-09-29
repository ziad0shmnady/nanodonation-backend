// src/common/pipes/zod-validation.pipe.ts
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  // Import your DTO
  import { z } from 'zod';
import { OrgService } from './org.service';
import { PrismaService } from 'src/prisma/prisma.service';
  
  
  
  @Injectable()
  export class ZodValidationReqEmail implements PipeTransform {
    constructor(private prisma:PrismaService) {}
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
      // const parsedValue = CreateUserDto.safeParse(value);
 
      const user = await this.prisma.orgRequest.findUnique({
        where: {
            email: value.email,
        },
      })
      
      if (user) {
        throw new BadRequestException('Email already exists');
      }
      return value;
    }
  }

  
  