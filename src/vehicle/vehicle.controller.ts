import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response, query } from 'express';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddingVehicleDataRequestDTO } from './dto/request/adding-vehicle-request.dto';
import { Vehicle } from './entities/vehicle.entity';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { GetVehicleDataRequestDTO } from './dto/request/get-vehicle-data.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @UseGuards(JwtGuard)
  @Post("/")
  @UseInterceptors(NoFilesInterceptor())
  async addingVehicleData(@Body() addingVehicleDataRequestDTO: AddingVehicleDataRequestDTO, @Res() response: Response) {
    try {
      const responseData: Vehicle = await this.vehicleService.addingVehicleData(addingVehicleDataRequestDTO)
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @Post("/data")
  @UseInterceptors(NoFilesInterceptor())
  async getVehicleDataOnGroup(@Body() getVehicleDataRequestDTO: GetVehicleDataRequestDTO, @Res() response: Response) {
    try {
      const responseData: Vehicle[] = await this.vehicleService.getVehicleDataOnGroup(getVehicleDataRequestDTO)
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.json(error);
    }
  }


}
