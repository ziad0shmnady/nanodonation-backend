import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { request } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import * as passwordGenerator from 'password-generator';
import { randomUUID } from 'crypto';
@Injectable()
export class OrgService {
  constructor(private prismService: PrismaService) {}
  //send request to create org
  async createOrgRequest(req, res) {
    try {
      const { name, email, phone, company_registeration } = req.body;
      const request = await this.prismService.orgRequest.create({
        data: {
          name: name,
          email: email,
          phone: phone,
          company_registeration: company_registeration,
        },
      });
      return res.status(HttpStatus.CREATED).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async changeOrgRequestStatus(req, res) {
    try {
      const { request_id, status } = req.body;
      const request = await this.prismService.orgRequest.update({
        where: {
          request_id: request_id,
        },
        data: {
          status: status,
        },
      });
      return res.status(HttpStatus.OK).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get all org requests
  async getAllOrgRequests(req, res) {
    try {
      const requests = await this.prismService.orgRequest.findMany();
      return res.status(HttpStatus.OK).send(requests);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get org request by id
  async getOrgRequestById(req, res) {
    try {
      const { request_id } = req.params;
      const request = await this.prismService.orgRequest.findUnique({
        where: {
          request_id: request_id,
        },
      });
      return res.status(HttpStatus.OK).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get org request by name using query
  async getOrgRequestByName(req, res, query) {
    try {
      console.log(query);
      const request = await this.prismService.orgRequest.findMany({
        where: {
          name: query,
        },
      });
      return res.status(HttpStatus.OK).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //change org request status to approved
  async approveOrgRequest(req, res) {
    try {
      const { merchant_id, payment_processor, request_id } = req.body;
      //get org request by id
      const orgRequest = await this.prismService.orgRequest.findUnique({
        where: {
          request_id: request_id,
        },
      });

      const org = await this.prismService.organization.create({
        data: {
          name: orgRequest.name,
          email: orgRequest.email,
          company_registeration: orgRequest.company_registeration,
          merchant_id: merchant_id,
          phone: orgRequest.phone,
          payment_processor: payment_processor,
          request_id: orgRequest.request_id,
        },
      });
      const admin = await this.prismService.admin.create({
        data: {
          name: `${orgRequest.name}` + ' admin',
          password: passwordGenerator(8, false),
          org_id: org.org_id,
        },
      });
      const request = await this.prismService.orgRequest.update({
        where: {
          request_id: request_id,
        },
        data: {
          status: 'approved',
        },
      });
      return res.status(HttpStatus.OK).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //update organization to add the rest of the attributes if it is in body
  async updateOrganization(req, res, updateOrgDto) {
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

  async sortOrgReqByCreatedAt(req, res) {
    try {
      const requests = await this.prismService.orgRequest.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
      return res.status(HttpStatus.OK).send(requests);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
