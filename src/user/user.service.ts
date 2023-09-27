import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prismService: PrismaService) {}

  // create a new user
  async createUser(req, res) {
    const salt = await bcrypt.genSalt();
    //check if user already exists
    const userExists = await this.getUserByEmail(req.body.email);
    if (userExists) {
      return res.status(HttpStatus.BAD_REQUEST).send('user already exists');
    }
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await this.prismService.user.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        DOB: req.body.DOB,
        email: req.body.email,
        password: hashPassword,
      },
    });
    return res.status(HttpStatus.CREATED).send(user);
  }

  // get user by email
  async getUserByEmail(email: string) {
    return this.prismService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
