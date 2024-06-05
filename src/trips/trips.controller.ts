import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Res, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddTripRequestDTO } from './dto/request/add-travel-note-request.dto';
import { Trip } from './entities/trip.entity';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { Response, query } from 'express';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';
import { AddTripMonitoringRequestDTO } from './dto/request/add-trip-monitoring-request.dto';
import { TripMonitoring } from './entities/trip_monitoring';
import { interval, Observable, switchMap } from 'rxjs';

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

  @UseGuards(JwtGuard)
  @Post("/detail")
  @UseInterceptors(NoFilesInterceptor())
  async getTripByToken(@Query('tripToken') tripToken: string, @Res() response: Response) {
    const responseData: Trip = await this.tripsService.getTripByToken(tripToken)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // addTripMonitoring
  @UseGuards(JwtGuard)
  @Get("/add-trip-monitoring")
  @UseInterceptors(NoFilesInterceptor())
  async addTripMonitoring(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('kecepatan') kecepatan: string,
    @Query('levelKantuk') levelKantuk: string,
    @Query('tripToken') tripToken: string,
    @Res() response: Response) {

    const addTripMonitoringRequestDTO = new AddTripMonitoringRequestDTO()
    addTripMonitoringRequestDTO.latitude = lat
    addTripMonitoringRequestDTO.longitude = lng
    addTripMonitoringRequestDTO.kecepatan = kecepatan
    addTripMonitoringRequestDTO.levelKantuk = levelKantuk
    addTripMonitoringRequestDTO.tripToken = tripToken

    const responseData: TripMonitoring | void = await this.tripsService.addTripMonitoring(addTripMonitoringRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Get Monitoring by tripId
  @Get('monitoring-trip')
  async streamData(
    @Query('tripToken') tripToken: string,
    @Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const dataStream$: Observable<TripMonitoring[]> = interval(5000).pipe(
      switchMap(() => this.tripsService.getTripMonitoring(tripToken))
    );

    const subscription = dataStream$.subscribe({
      next: async (data: TripMonitoring[]) => {
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
}
