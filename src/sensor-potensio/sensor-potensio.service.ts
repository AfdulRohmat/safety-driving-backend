import { Injectable } from '@nestjs/common';
import { CreateSensorPotensioDto } from './dto/create-sensor-potensio.dto';
import { UpdateSensorPotensioDto } from './dto/update-sensor-potensio.dto';
import { SensorPotensio } from './entities/sensor-potensio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SensorPotensioService {

  constructor(
    @InjectRepository(SensorPotensio)
    private readonly sensorPotensioRepository: Repository<SensorPotensio>,
  ) { }

  async create(createSensorPotensioDto: CreateSensorPotensioDto) {
    const totalData: number = await this.sensorPotensioRepository.count();

    if (totalData === 0) {
      const potensioSensor = new SensorPotensio();
      potensioSensor.category = createSensorPotensioDto.category;
      potensioSensor.value = createSensorPotensioDto.value;
      potensioSensor.userid = "123";
      await this.sensorPotensioRepository.save(potensioSensor);

      return 'data sensor saved in very firt time'
      // 
    } else {
      const latestSensorData: SensorPotensio = await this.sensorPotensioRepository.findOneOrFail({
        where: { userid: "123" },
        order: { createdAt: 'DESC' },
      });

      if (createSensorPotensioDto.category !== latestSensorData.category) {
        const potensioSensor = new SensorPotensio();
        potensioSensor.category = createSensorPotensioDto.category;
        potensioSensor.value = createSensorPotensioDto.value;
        potensioSensor.userid = "123";
        await this.sensorPotensioRepository.save(potensioSensor);

        return 'data sensor saved to db'
      }

      return 'data skip, incoming category request have same value with recent category';
    }
  }


  async findAll(): Promise<SensorPotensio[]> {
    const data: SensorPotensio[] = await this.sensorPotensioRepository.find({
      order: { createdAt: 'DESC' },
    });

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensorPotensio`;
  }

  update(id: number, updateSensorPotensioDto: UpdateSensorPotensioDto) {
    return `This action updates a #${id} sensorPotensio`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensorPotensio`;
  }
}
