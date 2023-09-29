import {
  Controller,
  Req,
  Res,
  Post,
  ValidationPipe,
  Body,
  UsePipes,
  Get,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UpdateUserDto, UserDTO } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard } from 'src/admin/admin.guard';
import { UUID } from 'crypto';

import { ZodValidationEmail } from './zod-validation.pipe';
import { UpdateOrgDto } from 'src/organization/org.dto';
import { guardIsUser } from './user.guard';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // create a new user
  @Post('/create')
  //add validation pipe
  @UsePipes(ValidationPipe, ZodValidationEmail)
  async createUser(
    @Body() userDTO: UserDTO, // Use a different variable name to avoid conflict with the class name
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.createUser(req, res, userDTO); // Pass userDTO instead of UserDTO
  }

  // get all users
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get('/getAllUsers')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    return this.userService.getAllUsers(req, res);
  }

  // get user by id
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get('/getUserById/:id')
  async getUserById(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.getUserById(req, res, id);
  }

  // update user
  @UseGuards(JwtAuthGuard,guardIsUser)
  @Put('/updateUser')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.updateUser(req, res, updateUserDto);
  }
}
