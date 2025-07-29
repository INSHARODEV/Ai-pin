import { JWTAuthService } from 'src/modules/utils/jwt.service';
import { RefreshGuard } from './refresh.guard';
  let mockJWTAuthService:  JWTAuthService =  {} as JWTAuthService ;

describe('RefreshGuard', () => {
  it('should be defined', () => {
    expect(new RefreshGuard(mockJWTAuthService)).toBeDefined();
  });
});
