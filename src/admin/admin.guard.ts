// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminService } from './admin.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private adminService: AdminService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    // console.log(data);
    // Check if the userID is an admin
    const admin = await this.adminService.getAdminById(user.userId);

    if (admin.role == 'onwer') {
      return true; // User is an admin
    }

    return false; // User is not an admin
  }
}
