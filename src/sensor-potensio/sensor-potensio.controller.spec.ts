import { Test, TestingModule } from '@nestjs/testing';
import { SensorPotensioController } from './sensor-potensio.controller';
import { SensorPotensioService } from './sensor-potensio.service';

describe('SensorPotensioController', () => {
  let controller: SensorPotensioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorPotensioController],
      providers: [SensorPotensioService],
    }).compile();

    controller = module.get<SensorPotensioController>(SensorPotensioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
