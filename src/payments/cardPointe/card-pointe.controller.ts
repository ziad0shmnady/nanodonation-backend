import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CardPointeService } from './card-pointe.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
@Controller('card-pointe')
export class CardPointeController {
  constructor(private CardPointeService: CardPointeService) {}
  // donate endpoint
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User)
  @Post('donate')
  async donate(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.CardPointeService.donate(req,res);
  }
}
