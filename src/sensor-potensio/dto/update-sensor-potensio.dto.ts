import { PartialType } from '@nestjs/mapped-types';
import { CreateSensorPotensioDto } from './create-sensor-potensio.dto';

export class UpdateSensorPotensioDto extends PartialType(CreateSensorPotensioDto) {}
