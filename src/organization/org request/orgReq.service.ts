import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { request } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import * as passwordGenerator from 'password-generator';
import { randomUUID } from 'crypto';
import { ReqDTO } from './orgReq.dto';
@Injectable()
export class OrgReqService {
  constructor(private prismService: PrismaService) {}
  async createOrgRequest(req, res, reqDTO): Promise<ReqDTO> {
    try {
      //check if org request with this email already exists
      const existingOrgRequest = await this.prismService.orgRequest.findUnique({
        where: {
          email: reqDTO.email,
        },
      });
      if (existingOrgRequest) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'Org request with this email already exists' });
      }
      const request = await this.prismService.orgRequest.create({
        data: {
          ...reqDTO,
        },
      });
      return res.status(HttpStatus.CREATED).send(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  
  async changeOrgRequestStatus(req, res): Promise<ReqDTO> {
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
  async getAllOrgRequests(req, res, filter_name,sort_type): Promise<ReqDTO> {
    try {
      const requests = await this.prismService.orgRequest.findMany(
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
      return res.status(HttpStatus.OK).send(requests);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //get org request by id
  async getOrgRequestById(req, res): Promise<ReqDTO> {
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
  async getOrgRequestByName(req: any, res: any, query: any): Promise<ReqDTO> {
    try {
      const { name } = query;
      const request = await this.prismService.orgRequest.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
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
          email: orgRequest.email,
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
}
