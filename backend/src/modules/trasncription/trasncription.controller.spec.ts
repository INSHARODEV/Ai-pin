import { Test, TestingModule } from '@nestjs/testing';
import { TrasncriptionController } from './trasncription.controller';
import { TrasncriptionService } from './trasncription.service';

describe('TrasncriptionController', () => {
  let controller: TrasncriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrasncriptionController],
      providers: [TrasncriptionService],
    }).compile();

    controller = module.get<TrasncriptionController>(TrasncriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
