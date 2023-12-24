import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { request } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import * as passwordGenerator from 'password-generator';
import { randomUUID } from 'crypto';
import { OrgDTO } from './org.dto';
@Injectable()
export class OrgService {
  constructor(private prismService: PrismaService) {}

  async createOrg(req, res, createOrgDto): Promise<OrgDTO> {
    try {
      //check if org with this email already exists
      const existingOrg = await this.prismService.organization.findUnique({
        where: {
          email: createOrgDto.email,
        },
      });
      if (existingOrg) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'Org with this email already exists' });
      }
      // check if org with this merchant_id already exists
      const existingOrgMerchantId = await this.prismService.organization.findUnique(
        {
          where: {
            merchant_id: createOrgDto.merchant_id,
          },
        },
      );
      if (existingOrgMerchantId) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'Org with this merchant_id already exists' });
      }
      // check if org with this request_id already exists
      const existingOrgRequestId = await this.prismService.organization.findUnique(
        {
          where: {
            request_id: createOrgDto.request_id,
          },
        },
      );
      if (existingOrgRequestId) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'Org with this request_id already exists' });
      }

      //create org
      const org = await this.prismService.organization.create({
        data: {
          ...createOrgDto,
        },
      });
      //create admin
      const admin = await this.prismService.admin.create({
        data: {
          name: `${org.name}` + ' admin',
          admin_id: randomUUID(),
          org_id: org.org_id,
          email: createOrgDto.email,
          password: passwordGenerator(12, false),
          role: 'owner',
        },
      });
      return res.status(HttpStatus.OK).send({ org });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //get all orgs
  async getAllOrgs(req, res,filter_name,sort_type): Promise<OrgDTO> {
    try {
      const orgs = await this.prismService.organization.findMany(
        {
          where: {
            name: {
              contains: filter_name,
              mode: 'insensitive',
            },
          },
          orderBy: {
            created_at: sort_type,
          },
        },
      );
      //check if user returm empty array
      if (orgs.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send(orgs);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //update organization to add the rest of the attributes if it is in body
  async updateOrganization(req: any, res: any, updateOrgDto: any,org_id): Promise<OrgDTO> {
    try {
      //get org id from req.user
      const org = await this.prismService.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      let orgId: any;
      if (!org) {
        orgId = org_id;
      } else {
        orgId = org.org_id;
      }
      const neworg = await this.prismService.organization.update({
        where: {
          org_id: orgId,
        },
        data: {
          ...updateOrgDto,
        },
      });
      return res.status(HttpStatus.OK).send(neworg);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

 
  //get org by id
  async getOrgById(req, res, id): Promise<OrgDTO> {
    try {
      //check if org with this id exists
      const existingOrg = await this.prismService.organization.findUnique({
        where: {
          org_id: id,
        },
      });
      if (!existingOrg) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'Org with this id does not exist' });
      }
      const org = await this.prismService.organization.findUnique({
        where: {
          org_id: id,
        },
      });
      return res.status(HttpStatus.OK).send(org);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
 
  //delete org
  async deleteOrg(req, res, id): Promise<OrgDTO> {
    try {
      //delete admins who has this org id
      const admins = await this.prismService.admin.deleteMany({
        where: {
          org_id: id,
        },
      });

      const org = await this.prismService.organization.delete({
        where: {
          org_id: id,
        },
      });
      return res
        .status(HttpStatus.OK)
        .send('org and admins who has this org deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get current org for admin
  async getCurrentOrg(req, res): Promise<OrgDTO> {
    try {
      //get org id from req.user
      const org = await this.prismService.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
      const currentOrg = await this.prismService.organization.findUnique({
        where: {
          org_id: org.org_id,
        },
      });
      return res.status(HttpStatus.OK).send(currentOrg);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
