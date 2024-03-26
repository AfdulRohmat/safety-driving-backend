import { Test, TestingModule } from '@nestjs/testing';
import { SensorPotensioService } from './sensor-potensio.service';

describe('SensorPotensioService', () => {
  let service: SensorPotensioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorPotensioService],
    }).compile();

    service = module.get<SensorPotensioService>(SensorPotensioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
