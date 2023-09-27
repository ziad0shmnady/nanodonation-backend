import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
@Module({
  imports: [],
  controllers: [OrgController],
  providers: [OrgService],
  exports: [],
})
export class OrgModule {}
