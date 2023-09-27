import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAdminById(id: string) {
    return await this.prisma.admin.findUnique({
      where: {
        admin_id: id,
      },
    });
  
  }

}
