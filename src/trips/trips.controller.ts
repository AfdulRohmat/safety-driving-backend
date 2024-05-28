import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddTripRequestDTO } from './dto/request/add-travel-note-request.dto';
import { Trip } from './entities/trip.entity';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { Response, query } from 'express';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @UseGuards(JwtGuard)
  @Post("/add-trip")
  @UseInterceptors(NoFilesInterceptor())
  async addTripRecord(@Body() addTripRequestDTO: AddTripRequestDTO, @Res() response: Response) {
    const responseData: Trip = await this.tripsService.addTrip(addTripRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @UseGuards(JwtGuard)
  @Post("/")
  @UseInterceptors(NoFilesInterceptor())
  async getAllTrips(@Body() getTravelRequestDTO: GetTravelRequestDTO, @Res() response: Response) {
    const responseData: Trip[] = await this.tripsService.getAllTrips(getTravelRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

}
