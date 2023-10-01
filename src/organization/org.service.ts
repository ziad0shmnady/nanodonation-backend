import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { request } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import * as passwordGenerator from 'password-generator';
import { randomUUID } from 'crypto';
import { OrgDTO } from './org.dto';
@Injectable()
export class OrgService {
  constructor(private prismService: PrismaService) {}
 //get all orgs
  async getAllOrgs(req, res): Promise<OrgDTO> {
    try {
      const orgs = await this.prismService.organization.findMany();
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
  async updateOrganization(req, res, updateOrgDto): Promise<OrgDTO> {
    try {
      //get org id from req.user
      const {org_id} =await this.prismService.admin.findUnique({
        where: {
          admin_id: req.user.userId,
        },
        select: {
          org_id: true,
        },
      });
    
      const org = await this.prismService.organization.update({
        where: {
          org_id: org_id,
        },
        data: {
          ...updateOrgDto,
        },
      });
      return res.status(HttpStatus.OK).send(org);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // sort orgReq by created At

  async sortOrgReqByCreatedAt(req, res,sort_type): Promise<OrgDTO> {
    try {
      const requests = await this.prismService.orgRequest.findMany({
        orderBy: {
          created_at: sort_type,
        },
      });
      return res.status(HttpStatus.OK).send(requests);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get org by id
  async getOrgById(req, res, id): Promise<OrgDTO> {
    try {
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
  //get org by name
  async getOrgByName(req, res, name): Promise<OrgDTO> {
    try {
      const org = await this.prismService.organization.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
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
      return res.status(HttpStatus.OK).send('org and admins who has this org deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
}
