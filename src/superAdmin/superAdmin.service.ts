import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuperAdminDto, SuperAdminUpdateDto } from './superAdmin.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SuperAdminService {
  private transporter;
  constructor(private prismaService: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'zeiadmohamed331@gmail.com',
        pass: 'olor uuud bkov zhna',
      },
    });
  }

  async getSuperAdminById(id: UUID) {
    return await this.prismaService.superAdmin.findUnique({
      where: {
        super_admin_id: id,
      },
    });
  }

  async createSuperAdmin(superAdminDto, req, res): Promise<SuperAdminDto> {
    try {
      //check if superAdmin with this email already exists
      const existingSuperAdmin = await this.prismaService.superAdmin.findUnique(
        {
          where: {
            email: superAdminDto.email,
          },
        },
      );
      if (existingSuperAdmin) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'SuperAdmin with this email already exists' });
      }
      const admin = await this.prismaService.superAdmin.create({
        data: {
          ...superAdminDto,
        },
      });
      return res.status(HttpStatus.CREATED).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllSuperAdmins(
    req,
    res,
    filter_name,
    sort_type,
  ): Promise<SuperAdminDto> {
    try {
      const admins = await this.prismaService.superAdmin.findMany({
        where: {
          name: {
            contains: filter_name,
            mode: 'insensitive',
          },
        },
        orderBy: {
          created_at: sort_type,
        },
      });

      return res.status(HttpStatus.OK).send(admins);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSuperAdmin(
    superAdminDto,
    req,
    res,
  ): Promise<SuperAdminUpdateDto> {
    try {
      const super_admin_id = req.user;
      const admin = await this.prismaService.superAdmin.update({
        where: {
          super_admin_id: super_admin_id.userId,
        },
        data: {
          ...superAdminDto,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteSuperAdmin(res, req): Promise<SuperAdminDto> {
    try {
      const admin = await this.prismaService.superAdmin.delete({
        where: {
          super_admin_id: req.user.userId,
        },
      });
      return res.status(HttpStatus.OK).send('admin deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //get current super admin
  async getCurrentSuperAdmin(req, res): Promise<SuperAdminDto> {
    try {
      const admin = await this.prismaService.superAdmin.findUnique({
        where: {
          super_admin_id: req.user.userId,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(req, res): Promise<SuperAdminDto> {
    try {
      const { email } = req.body;
      const superAdmin = await this.prismaService.superAdmin.findUnique({
        where: {
          email: email,
        },
      });
      if (!superAdmin) {
        return res.status(HttpStatus.NOT_FOUND).send('superAdmin not found');
      }
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      //check if email already exists into token table
      const token = await this.prismaService.token.findFirst({
        where: {
          email: email,
        },
      });
      if (token) {
        //delete otp from db
        await this.prismaService.token.delete({
          where: {
            email: email,
          },
        });
      }
      await this.prismaService.token.create({
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
      const OTPDB = await this.prismaService.token.findUnique({
        where: {
          email: email,
        },
      });

      var verify = false;
      if (OTP == OTPDB.otp) {
        verify = true;
      }
      //update superAdmin stepper to stripe

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

  async resetPassword(req, res): Promise<any> {
    try {
      const { password, email } = req.body;
      //check if email is valid
      const OTPDB = await this.prismaService.token.findUnique({
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

      // update the superAdmin as verified
      await this.prismaService.superAdmin.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      //delete otp from db
      await this.prismaService.token.delete({
        where: {
          email: email,
        },
      });
      return res
        .status(HttpStatus.ACCEPTED)
        .send({ message: 'Password reset successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async changePassword(req, res): Promise<SuperAdminDto> {
    try {
      const { currentPassword, newPassword } = req.body;
      //check if current password is correct
      const superAdmin = await this.prismaService.superAdmin.findUnique({
        where: {
          super_admin_id: req.user.userId,
        },
      });
      const validPassword = bcrypt.compareSync(
        currentPassword,
        superAdmin.password,
      );
      if (!validPassword) {
        throw new HttpException(
          'Invalid current password',
          HttpStatus.BAD_REQUEST,
        );
      }
      //hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      const updatesuperAdmin = await this.prismaService.superAdmin.update({
        where: {
          super_admin_id: req.user.userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.status(HttpStatus.OK).send('Password changed successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
