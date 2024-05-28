import { Module } from '@nestjs/common';
import { SensorPotensioService } from './sensor-potensio.service';
import { SensorPotensioController } from './sensor-potensio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorPotensio } from './entities/sensor-potensio.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      SensorPotensio
    ])
  ],
  controllers: [SensorPotensioController],
  providers: [SensorPotensioService],
})
export class SensorPotensioModule { }
