import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { TripMonitoring } from './entities/trip_monitoring';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      User,
      Group,
      TripMonitoring
    ])
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule { }
