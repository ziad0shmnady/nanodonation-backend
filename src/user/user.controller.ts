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
  Delete,
  Query,
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
import { SuperAdminGuard } from 'src/superAdmin/superAdmin.guard';

import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/role.guard';
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
  // @UseGuards(JwtAuthGuard, OwnerGuard,SuperAdminGuard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAllUsers')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    return this.userService.getAllUsers(req, res);
  }

  // get user by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getUserById/:id')
  async getUserById(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.getUserById(req, res, id);
  }

  // update user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Put('/updateUser')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.updateUser(req, res, updateUserDto);
  }

  // delete user by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('/deleteUser/:id')
  async deleteUser(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.deleteUser(req, res, id);
  }

  //sort user by created at
  @Get('/sortUserByCreatedAt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async sortUserByCreatedAt(

    @Query('sort_type') sort_type: string, //dsec or asc
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.sortUsersByCreatedAt(req, res, sort_type);
  }

  //get user by name
  @Get('/getUserByName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  
  @Roles(Role.SuperAdmin, Role.User)
  async getUserByName(
    @Query('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.getUserByName(req, res, name);
  }
}
