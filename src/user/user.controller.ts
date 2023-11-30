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
    // @Body() userDTO: UserDTO, // Use a different variable name to avoid conflict with the class name
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.createUser(req, res); // Pass userDTO instead of UserDTO
  }

  // get all users
  // @UseGuards(JwtAuthGuard, OwnerGuard,SuperAdminGuard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('/getAllUsers')
  async getAllUsers(
    @Query('filter_name') filter_name: String,
    @Query('sort_type') sort_type: String,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.getAllUsers(req, res, filter_name, sort_type);
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
  @Roles(Role.User, Role.SuperAdmin)
  @Put('/updateUser/:id')
  async updateUser(
    @Param('id')id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.updateUser(id,req, res,updateUserDto);
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
  // get current user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/getCurrentUser')
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    return this.userService.getCurrentUser(req, res);
  }
}
