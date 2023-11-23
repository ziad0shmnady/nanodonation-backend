// admin.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local'; // You can use 'passport-jwt' for JWT-based admin authentication if needed
import { AuthService } from './auth.service';

@Injectable()
export class KioskStrategy extends PassportStrategy(Strategy, 'kiosk') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    // Implement admin validation logic here
    // You can use the same `validateUser` method from `AuthService` or create a separate method for admin validation
    const isKiosk = await this.authService.validateKiosk(email, password);

    if (!isKiosk) {
      throw new UnauthorizedException();
    }

    return isKiosk;
  }
}
