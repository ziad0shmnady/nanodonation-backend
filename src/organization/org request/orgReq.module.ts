import { Module } from '@nestjs/common';
import { AnnouncementModule } from '../announcement/announcement.module';
import { OrgService } from '../org.service';
import { AdminService } from 'src/admin/admin.service';
import { OrgReqService } from './orgReq.service';
import { OrgReqController } from './orgReq.controller';

@Module({
  imports: [AnnouncementModule],
  controllers: [OrgReqController],
  providers: [OrgService, AdminService, OrgReqService],
  exports: [OrgReqService],
})
export class OrgReqModule {}
