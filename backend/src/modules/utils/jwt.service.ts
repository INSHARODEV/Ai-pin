import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenData } from '../../common/types/jwt.types';
import { Secrets } from '../../common/types/jwt.types';
 
@Injectable()
export class JWTAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(tokens: Token[]) {
    const generatedTokens = tokens.map((token) =>
      this.jwtService.sign(
        { payload: token.payload },
        {
          secret: token.secret,
          expiresIn: token.expiresIn,
        },
      ),
    );
    return generatedTokens;
  }

  VerifyToken({ token, secret }: TokenData) {
    const decoade = this.jwtService.verify(token, {
      secret,
    });
    return decoade;
  }
 
//   determineTokenSecret(userType: string): Secrets|null {
//     let authSecret = '';
//     let refreshSecret = '';
// console.log(userType==='vealge_admin')
//     switch (userType) {
//       case 'talent_seeker':
//         authSecret = this.configService.get<string>('TALENT_SEEKER_AUTH_SECRET')!;
//         refreshSecret = this.configService.get<string>('TALENT_SEEKER_REFRESH_SECRET')!;
//         break;
//       case 'court_admin':
//         authSecret = this.configService.get<string>('COURT_ADMIN_AUTH_SECRET')!;
//         refreshSecret = this.configService.get<string>('COURT_ADMIN_REFRESH_SECRET')!;
//         break;
//       case 'vealge_admin' :
//         authSecret = this.configService.get<string>('VEALGE_ADMIN_AUTH_SECRET')!;
//         refreshSecret = this.configService.get<string>('VEALGE_ADMIN_REFRESH_SECRET')!;
//         break;
//       case 'generic_user':
//         authSecret = this.configService.get<string>('GENERIC_USER_AUTH_SECRET')!;
//         refreshSecret = this.configService.get<string>('GENERIC_USER_REFRESH_SECRET')!;
//         break;
//       default:
//         return null;
//     }

//     return { authSecret, refreshSecret } ;
//   }

}