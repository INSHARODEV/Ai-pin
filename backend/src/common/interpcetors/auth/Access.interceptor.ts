import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
 import { JWTAuthService } from 'src/modules/utils/jwt.service';
import { Response } from 'express';

@Injectable()
export class AccessInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService,
    private readonly JWTAuthService:JWTAuthService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res:Response = context.switchToHttp().getResponse();
 
    return next.handle().pipe(
      tap((data) => {
        
         const { refreshToken } = data;
        
 delete data.refreshToken;

      

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7*4,  
        });
      }),
    );
  }
}
