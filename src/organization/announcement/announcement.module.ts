import { Module } from "@nestjs/common";
import { AnnouncementController } from "./announcement.controller";
import { AnnouncementService } from "./announcement.service";
import { AdminService } from "src/admin/admin.service";

@Module({
    imports: [],
    controllers: [AnnouncementController],
    providers: [AnnouncementService,AdminService],
    exports: [AnnouncementService],
})

export class AnnouncementModule {}