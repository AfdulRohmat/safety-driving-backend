import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { TripMonitoring } from './entities/trip_monitoring.entity';
import { FaceMonitoring } from './entities/face_monitoring.entity';
import { TripMonitoringGateway } from './gateway/trip_monitoring.gateway';
// import { FaceMonitoringGateway } from './gateway/face_monitoring.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      User,
      Group,
      TripMonitoring,
      FaceMonitoring
    ])
  ],
  controllers: [TripsController],
  providers: [TripsService, TripMonitoringGateway],
})
export class TripsModule { }
