import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { SensorPotensioService } from './sensor-potensio.service';
import { CreateSensorPotensioDto } from './dto/create-sensor-potensio.dto';
import { UpdateSensorPotensioDto } from './dto/update-sensor-potensio.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('sensor-potensio')
export class SensorPotensioController {
  constructor(private readonly sensorPotensioService: SensorPotensioService) { }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createSensorPotensioDto: CreateSensorPotensioDto) {
    return this.sensorPotensioService.create(createSensorPotensioDto);
  }

  @Get()
  findAll() {
    return this.sensorPotensioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorPotensioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSensorPotensioDto: UpdateSensorPotensioDto) {
    return this.sensorPotensioService.update(+id, updateSensorPotensioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorPotensioService.remove(+id);
  }
}
