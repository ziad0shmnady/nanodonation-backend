import { Module } from "@nestjs/common";
import { SuperAdminController } from "./superAdmin.controller";
import { SuperAdminService } from "./superAdmin.service";

@Module({
    controllers: [SuperAdminController],
    providers: [SuperAdminService],
    exports: []
})
export class SuperAdminModule {}