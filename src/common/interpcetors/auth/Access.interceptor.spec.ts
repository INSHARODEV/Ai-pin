import { ConfigService } from '@nestjs/config';
import { AccessInterceptor } from './Access.interceptor';
import { JWTAuthService } from 'src/modules/utils/jwt.service';

describe('AuthInterceptor', () => {
  it('should be defined', () => {
    const mockConfigService = {} as ConfigService;
    const mockJWTAuthService = {} as JWTAuthService;
    expect(new AccessInterceptor(mockConfigService, mockJWTAuthService)).toBeDefined();
  });
});
