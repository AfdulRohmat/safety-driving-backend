import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle } from './entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GroupMember } from 'src/groups/entities/group-member.entity';
import { Group } from 'src/groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      User,
      Group,
      GroupMember
    ])
  ],

  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule { }
