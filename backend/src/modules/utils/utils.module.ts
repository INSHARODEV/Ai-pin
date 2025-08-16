import { Module,DynamicModule } from '@nestjs/common';
 import { JWTAuthService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';
  
@Module({
 })
export class UtilsModule {
    static forRoot(): DynamicModule {
        return {
            module: UtilsModule,
            providers: [JWTAuthService,JwtService],
            exports: [JWTAuthService],
            global: true,
        };
    }
}
