import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Sse, Res } from '@nestjs/common';
import { SensorPotensioService } from './sensor-potensio.service';
import { CreateSensorPotensioDto } from './dto/create-sensor-potensio.dto';
import { UpdateSensorPotensioDto } from './dto/update-sensor-potensio.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { interval, map, Observable, switchMap } from 'rxjs';
import { Response } from 'express';
import { Interval } from '@nestjs/schedule';
import { SensorPotensio } from './entities/sensor-potensio.entity';

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

  @Get('sse')
  async streamData(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const dataStream$: Observable<SensorPotensio[]> = interval(5000).pipe(
      switchMap(() => this.sensorPotensioService.findAll())
    );

    const subscription = dataStream$.subscribe({
      next: async (data: SensorPotensio[]) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Optional delay to control the stream rate

      },
      error: (error) => {
        console.error('Error streaming data:', error);
      },
      complete: () => {
        console.log('Data streaming completed');
      }
    });

    res.on('close', () => {
      subscription.unsubscribe();
    });
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
