// admin.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local'; // You can use 'passport-jwt' for JWT-based admin authentication if needed
import { AuthService } from './auth.service';

@Injectable()
export class SuperAdminStrategy extends PassportStrategy(Strategy, 'super-admin') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    // Implement admin validation logic here
    // You can use the same `validateUser` method from `AuthService` or create a separate method for admin validation
    const isAdmin = await this.authService.validateSuperAdmin(email, password);
    
    if (!isAdmin) {
        throw new UnauthorizedException();
    }

    return isAdmin;
  }
}
