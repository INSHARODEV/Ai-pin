import { Test, TestingModule } from '@nestjs/testing';
import { TrasncriptionService } from './trasncription.service';

describe('TrasncriptionService', () => {
  let service: TrasncriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrasncriptionService],
    }).compile();

    service = module.get<TrasncriptionService>(TrasncriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
