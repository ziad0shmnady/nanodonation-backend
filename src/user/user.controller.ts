import { Controller, Req, Res, Post, ValidationPipe ,Body} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UserDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // create a new user
  @Post('/create')
  //add validation pipe
  async createUser(
    @Body(ValidationPipe) UserDTO: UserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.createUser(req, res);
  }
}
