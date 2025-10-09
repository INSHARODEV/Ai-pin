import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JWTAuthService } from "src/modules/utils/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly JWTAuthService: JWTAuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
 
    const {authorization} = req.headers as any;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = this.JWTAuthService.VerifyToken({
        token,
        secret: process.env.AUTH_SECRET as string,
      });

      if (!decoded) throw new UnauthorizedException('Invalid token');
        req['user'] = decoded.payload.user;
console.log( 'uusrs',decoded.payload.user)
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}