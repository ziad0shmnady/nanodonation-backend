import { AuthGuard } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard('local'){

    
}
export class AdminAuthGuard extends AuthGuard('admin') {
    
}
export class SuperAdminAuthGuard extends AuthGuard('super-admin') {
    
}
export class kioskGuard extends AuthGuard('kiosk') {
    
}
