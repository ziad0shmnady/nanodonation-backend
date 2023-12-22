import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { UserDTO } from './user.dto';
@Injectable()
export class UserService {
  private transporter;
  constructor(private prismService: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'zeiadmohamed331@gmail.com',
        pass: 'olor uuud bkov zhna',
      },
    });
  }

  // create a new user
  async createUser(req, res, userDTO): Promise<UserDTO> {
    try {
      // Generate a salt for password hashing
      const salt = await bcrypt.genSalt();

      // Check if the user already exists based on the email
      const existingUser = await this.prismService.user.findUnique({
        where: { email: req.body.email },
      });

      if (existingUser) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'User with this email already exists' });
      }

      // Hash the password
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      // Create user
      const user = await this.prismService.user.create({
        data: {
          ...userDTO,
          password: hashPassword,
          phone: {
            create: {
              ...userDTO.phone,
            },
          },
        },
        include: {
          phone: true, // Include the phone data in the response
        },
      });

      return res.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error creating user' });
    }
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
  async getAllUsers(req, res, filter_name, sort_type): Promise<UserDTO> {
    try {
      const users = await this.prismService.user.findMany({
        where: {
          first_name: {
            contains: filter_name,
            mode: 'insensitive',
          },
        },
        orderBy: {
          created_at: sort_type,
        },
      });

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
  async updateUser(id, req, res, UpdateUserDto): Promise<UserDTO> {
    try {
      //check if user exists
      const userExists = await this.prismService.user.findUnique({
        where: {
          user_id: req.user.userId,
        },
      });
      if (!userExists) {
        var userId = id;
      } else {
        var userId = req.user.userId;
      }
      const user = await this.prismService.user.update({
        where: {
          user_id: userId,
        },
        data: {
          ...UpdateUserDto,
          phone: {
            update: {
              ...UpdateUserDto.phone,
            },
          },
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

  //get current user
  async getCurrentUser(req, res): Promise<UserDTO> {
    try {
      const user = await this.prismService.user.findUnique({
        where: {
          user_id: req.user.userId,
        },
      });
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async forgotPassword(req, res): Promise<UserDTO> {
    try {
      const { email } = req.body;
      const user = await this.prismService.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).send('User not found');
      }
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      //check if email already exists into token table
      const token = await this.prismService.token.findFirst({
        where: {
          email: email,
        },
      });
      if (token) {
        //delete otp from db
        await this.prismService.token.delete({
          where: {
            email: email,
          },
        });
      }
      await this.prismService.token.create({
        data: {
          email: email,
          otp: OTP,
        },
      });
      const mailOptions = {
        from: 'zeiadmohamed@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Your OTP is ${OTP}`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return res.status(HttpStatus.OK).send('Email sent: ' + info.response);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyToken(req, res): Promise<any> {
    try {
      const { OTP, email } = req.body;
    //get token from db
    const OTPDB = await this.prismService.token.findUnique({
      where: {
        email: email,
      },
    });

    var verify = false;
    if (OTP == OTPDB.otp) {
      verify = true;
    }
    //update user stepper to stripe

    if (verify) {
      return res
        .status(HttpStatus.ACCEPTED)
        .send({ message: 'OTP verified successfully' });
    } else {
      throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
    }

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      

    }
  }

  async resetPassword(req,res): Promise<any> {
    try {
      const { password, email } = req.body;
      //check if email is valid
      const OTPDB = await this.prismService.token.findUnique({
        where: {
          email: email,
        },
      });
      if (!OTPDB) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      var verify = false;

      // update the user as verified
      await this.prismService.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      //delete otp from db
      await this.prismService.token.delete({
        where: {
          email: email,
        },
      });
      return res.status(HttpStatus.ACCEPTED).send ({ message: 'Password reset successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
 async changePassword(req, res): Promise<UserDTO> {
    try {
      const {currentPassword, newPassword} = req.body;
      //check if current password is correct
      const user = await this.prismService.user.findUnique({
        where: {
          user_id: req.user.userId,
        },
      });
      const validPassword = bcrypt.compareSync(
        currentPassword,
        user.password,
      );
      if (!validPassword) {
        throw new HttpException('Invalid current password', HttpStatus.BAD_REQUEST);
      }
      //hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      const updateuser =await this.prismService.user.update({
        where: {
          user_id: req.user.userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.status(HttpStatus.OK).send("Password changed successfully");
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
