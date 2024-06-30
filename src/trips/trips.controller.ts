import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Res, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddTripRequestDTO } from './dto/request/add-trip-request.dto';
import { ProsesPerjalananEnum, Trip } from './entities/trip.entity';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { Response, query } from 'express';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';
import { AddTripMonitoringRequestDTO } from './dto/request/add-trip-monitoring-request.dto';
import { TripMonitoring } from './entities/trip_monitoring.entity';
import { interval, Observable, switchMap } from 'rxjs';
import { AddFaceMonitoringRequestDTO } from './dto/request/add-face-monitoring-request.dto';
import { FaceMonitoring } from './entities/face_monitoring.entity';
import { formatDate } from 'src/utils/format-date';

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

  @UseGuards(JwtGuard)
  @Post("/change-status")
  @UseInterceptors(NoFilesInterceptor())
  async changeTripStatus(@Body('tripToken') tripToken: string, @Body('status') status: ProsesPerjalananEnum, @Res() response: Response) {
    const responseData: Trip = await this.tripsService.changeTripStatus(tripToken, status)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @UseGuards(JwtGuard)
  @Post("/delete-trip")
  @UseInterceptors(NoFilesInterceptor())
  async deleteTrip(@Body('tripToken') tripToken: string, @Res() response: Response) {
    const responseData = await this.tripsService.deleteTrip(tripToken)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }



  // addTripMonitoring
  // @UseGuards(JwtGuard)
  @Post("/add-trip-monitoring")
  @UseInterceptors(NoFilesInterceptor())
  async addTripMonitoring(@Body() addTripMonitoringRequestDTO: AddTripMonitoringRequestDTO, @Res() response: Response) {

    const responseData: TripMonitoring | void = await this.tripsService.addTripMonitoring(addTripMonitoringRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Add Face Monitoring
  // @UseGuards(JwtGuard)
  @Post("/add-face-monitoring")
  @UseInterceptors(NoFilesInterceptor())
  async addFaceMonitoring(
    @Body() addFaceMonitoringRequestDTO: AddFaceMonitoringRequestDTO,
    @Res() response: Response) {

    const responseData: FaceMonitoring | void = await this.tripsService.addFaceMonitoring(addFaceMonitoringRequestDTO)
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

    const dataStream$: Observable<TripMonitoring[]> = interval(1000).pipe(
      switchMap(() => this.tripsService.getTripMonitoring(tripToken))
    );

    const subscription = dataStream$.subscribe({
      next: async (data: TripMonitoring[]) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Optional delay to control the stream rate
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

  @Get('monitoring-face')
  async getFaceMonitoring(
    @Query('tripToken') tripToken: string,
    @Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const dataStream$: Observable<FaceMonitoring[]> = interval(10000).pipe(
      switchMap(() => this.tripsService.getFaceMonitoring(tripToken))
    );

    const subscription = dataStream$.subscribe({
      next: async (data: FaceMonitoring[]) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Optional delay to control the stream rate
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

  // Export Trips To Excel
  // @UseGuards(JwtGuard)
  @Get('export-data-trip')
  async exportTripsToExcel(
    @Query('tripToken') tripToken: string,
    @Res() res: Response,
  ) {
    const getTripByToken: Trip = await this.tripsService.getTripByToken(tripToken);

    const buffer = await this.tripsService.exportTripsToExcel(tripToken);

    const filename = "laporan-perjalanan-" + formatDate(getTripByToken.jadwalPerjalanan) + ".xlsx"

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    res.send(buffer);
  }
}
