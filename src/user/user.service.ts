import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './user.dto';
@Injectable()
export class UserService {
  constructor(private prismService: PrismaService) {}

  // create a new user
  async createUser(req, res, UserDTO): Promise<UserDTO> {
    const salt = await bcrypt.genSalt();
    //check if user already exists

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await this.prismService.user.create({
      data: {
        ...UserDTO,
        password: hashPassword,
      },
    });
    return res.status(HttpStatus.CREATED).send(user);
  }

  // get user by email
  async getUserByEmail(email: string): Promise<any> {
    const user = await this.prismService.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  // get all users
  async getAllUsers(req, res): Promise<UserDTO> {
    try {
      const users = await this.prismService.user.findMany();

      //check if user returm empty array
      if (users.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send(users);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getUserById(req, res, id): Promise<UserDTO> {
    try {
      const user = await this.prismService.user.findUnique({
        where: {
          user_id: id,
        },
      });
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateUser(req, res, UpdateUserDto): Promise<UserDTO> {
    try {
      const user = await this.prismService.user.update({
        where: {
          user_id: req.user.userId,
        },
        data: {
          ...UpdateUserDto,
        },
      });
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteUser(req, res, id): Promise<UserDTO> {
    try {
      const user = await this.prismService.user.delete({
        where: {
          user_id: id,
        },
      });
      return res.status(HttpStatus.OK).send('user deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getUserrById(id: string) {
    return await this.prismService.user.findUnique({
      where: {
        user_id: id,
      },
    });
  }

  //sort users by created at
  async sortUsersByCreatedAt(req, res, sort_type): Promise<UserDTO[]> {
    try {
      const users = await this.prismService.user.findMany({
        orderBy: {
          created_at: sort_type,
        },
      });
      return res.status(HttpStatus.OK).send(users);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // search user by name
  async getUserByName(req, res, name): Promise<UserDTO> {
    try {
      const user = await this.prismService.user.findMany({
        where: {
          //use contains to search for a substring
          first_name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
