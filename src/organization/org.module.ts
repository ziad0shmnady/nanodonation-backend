import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { AnnouncementModule } from './announcement/announcement.module';
@Module({
  imports: [AnnouncementModule],
  controllers: [OrgController],
  providers: [OrgService,AdminService],
  exports: [],
})
export class OrgModule {}
