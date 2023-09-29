// src/common/pipes/zod-validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
// Import your DTO
import { z } from 'zod';

import { UserService } from './user.service';

@Injectable()
export class ZodValidationEmail implements PipeTransform {
  constructor(private userService: UserService) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // const parsedValue = CreateUserDto.safeParse(value);
    const user = await this.userService.getUserByEmail(value.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    return value;
  }
}
