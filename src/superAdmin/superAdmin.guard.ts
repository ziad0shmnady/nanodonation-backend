// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SuperAdminService } from './superAdmin.service';


@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private superAdminService: SuperAdminService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { user } = context.switchToHttp().getRequest();
      // console.log(data);

      const admin = await this.superAdminService.getSuperAdminById(user.userId);

      if (admin) {
        return true; // User is an admin
      }

      return false; // User is not an admin
    } catch (error) {
      return false;
    }
  }
}
