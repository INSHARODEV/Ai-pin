import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWTAuthService } from '../../../modules/utils/jwt.service';
 
@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly JWTAuthService:JWTAuthService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req:Request = context.switchToHttp().getRequest();
    const authToken=req.headers.authorization as string

     if(authToken && this.JWTAuthService.VerifyToken({secret:process.env.AUTH_SECRET as string,token:authToken})){
      return false
    }
    
     const {refreshToken}=req.cookies;
    const decoded=this.JWTAuthService.VerifyToken({secret:process.env.REFRESH_SECRET as string,token:refreshToken})
     if (!refreshToken&&!decoded ) {
      return false;
    }
    req['user'] = decoded.payload;
      return true;
  }
}
