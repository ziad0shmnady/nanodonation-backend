import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { updateAdminDto, adminDTO } from './admin.dto';
import { UserDTO } from 'src/user/user.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AdminService {
  private transporter;
  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'zeiadmohamed331@gmail.com',
        pass: 'olor uuud bkov zhna',
      },
    });
  }

  async getAdminById(id: string) {
    return await this.prisma.admin.findUnique({
      where: {
        admin_id: id,
      },
    });
  }

  async getAllAdmins(req, res, filter_name, sort_type): Promise<adminDTO> {
    try {
      const org = await this.prisma.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      let orgId: any;
      if (!org) {
        orgId = req.body.org_id;
      } else {
        orgId = org.org_id;
      }
      const admin = await this.prisma.admin.findMany({
        where: {
          name: {
            contains: filter_name,
            mode: 'insensitive',
          },
          org_id: orgId,
        },
        orderBy: {
          created_at: sort_type,
        },
      });
      //check if user returm empty array
      if (admin.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  catch(error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }

  async createAdmin(req, res, adminDTO): Promise<adminDTO> {
    const salt = await bcrypt.genSalt();
    //check if user already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: {
        email: adminDTO.email,
      },
    });
    if (existingAdmin) {
      return res
        .status(HttpStatus.CONFLICT)
        .send({ message: 'Admin with this email already exists' });
    }

    //get org id from admin
    const org = await this.prisma.admin.findUnique({
      where: {
        admin_id: req.user.userId,
      },
      select: {
        org_id: true,
      },
    });
    if (!org) {
      var orgId = adminDTO.org_id;
    } else {
      orgId = org.org_id;
    }

    const admin = await this.prisma.admin.create({
      data: {
        ...adminDTO,

        org_id: orgId,
      },
    });
    return res.status(HttpStatus.CREATED).send(admin);
  }

  async updateAdmin(
    req,
    res,
    updateAdminDto,
    admin_id,
  ): Promise<updateAdminDto> {
    try {
      if (
        req.user.userId &&
        (req.user.role == 'owner' || req.user.role == 'employee')
      ) {
        var adminId = req.user.userId;
      } else {
        adminId = admin_id;
      }

      const admin = await this.prisma.admin.update({
        where: {
          admin_id: adminId,
        },
        data: {
          ...updateAdminDto,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteAdmin(req, res, admin_id) {
    try {
      const admin = await this.prisma.admin.delete({
        where: {
          admin_id: admin_id,
        },
      });
      return res.status(HttpStatus.OK).send('admin deleted');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // get admin by id
  async getAdminnById(req, res, admin_id): Promise<adminDTO> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: {
          admin_id: admin_id,
        },
      });
      return res.status(HttpStatus.OK).send(admin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAdminByEmail(email: string) {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      return admin;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async forgotPassword(req, res): Promise<UserDTO> {
    try {
      const { email } = req.body;
      const admin = await this.prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      if (!admin) {
        return res.status(HttpStatus.NOT_FOUND).send('admin not found');
      }
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      //check if email already exists into token table
      const token = await this.prisma.token.findFirst({
        where: {
          email: email,
        },
      });
      if (token) {
        //delete otp from db
        await this.prisma.token.delete({
          where: {
            email: email,
          },
        });
      }
      await this.prisma.token.create({
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
    const OTPDB = await this.prisma.token.findUnique({
      where: {
        email: email,
      },
    });

    var verify = false;
    if (OTP == OTPDB.otp) {
      verify = true;
    }
    //update admin stepper to stripe

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
      const OTPDB = await this.prisma.token.findUnique({
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

      // update the admin as verified
      await this.prisma.admin.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      //delete otp from db
      await this.prisma.token.delete({
        where: {
          email: email,
        },
      });
      return res.status(HttpStatus.ACCEPTED).send ({ message: 'Password reset successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
 async changePassword(req, res): Promise<adminDTO> {
    try {
      const {currentPassword, newPassword} = req.body;
      //check if current password is correct
      const admin = await this.prisma.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
      });
      const validPassword = bcrypt.compareSync(
        currentPassword,
        admin.password,
      );
      if (!validPassword) {
        throw new HttpException('Invalid current password', HttpStatus.BAD_REQUEST);
      }
      //hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      const updateadmin =await this.prisma.admin.update({
        where: {
          admin_id: req.user.userId,
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
