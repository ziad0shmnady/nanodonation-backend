// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class guardIsUser implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { user } = context.switchToHttp().getRequest();
      // console.log(data);
      // Check if the userID is an admin
      const admin = await this.userService.getAdminById(user.userId);

      if (admin) {
        return true; // User is an admin
      }

      return false; // User is not an admin
    } catch (error) {
      return false;
    }
  }
}
