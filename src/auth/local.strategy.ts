import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(name: string, password: string): Promise<any> {
//     // Implement admin validation logic here
//     // You can use the same `validateUser` method from `AuthService` or create a separate method for admin validation
//     const isAdmin = await this.authService.validateAdmin(name, password);

//     if (!isAdmin) {
//       throw new UnauthorizedException();
//     }

//     return isAdmin;
//   }
// }
