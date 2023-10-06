// src/common/pipes/zod-validation.pipe.ts
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  // Import your DTO
  import { z } from 'zod';
  
  import { AdminService } from './admin.service';
  
  @Injectable()
  export class ZodValidationEmail implements PipeTransform {
    constructor(private adminService: AdminService) {}
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
      // const parsedValue = CreateUserDto.safeParse(value);
      const admin = await this.adminService.getAdminByEmail(value.email);
      if (admin) {
        throw new BadRequestException('Email already exists');
      }
      return value;
    }
  }
  