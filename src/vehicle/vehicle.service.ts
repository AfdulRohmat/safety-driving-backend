import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AddingVehicleDataRequestDTO } from './dto/request/adding-vehicle-request.dto';
import { Group } from 'src/groups/entities/group.entity';
import { GroupMember } from 'src/groups/entities/group-member.entity';
import { GetVehicleDataRequestDTO } from './dto/request/get-vehicle-data.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) { }


  async addingVehicleData(addingVehicleDataRequestDTO: AddingVehicleDataRequestDTO): Promise<Vehicle> {
    const userDriver = await this.userRepository.findOne({
      where: {
        id: addingVehicleDataRequestDTO.driver_id
      }
    })
    if (!userDriver) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })

    console.log("userDriver", userDriver)

    const group = await this.groupRepository.findOne({
      where: {
        id: addingVehicleDataRequestDTO.group_id
      }
    })
    if (!group) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Group tidak ditemukan / tidak valid' })

    // const groupmember = await this.groupMemberRepository.findOne({
    //   where: {
    //     user: userDriver
    //   }
    // })
    // if (!groupmember) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak terdaftar di dalam group' })

    const vehicle = new Vehicle()
    vehicle.nama = addingVehicleDataRequestDTO.nama;
    vehicle.noPolisi = addingVehicleDataRequestDTO.no_polisi;
    vehicle.detail = addingVehicleDataRequestDTO.detail;
    vehicle.driver = userDriver
    vehicle.group = group

    const vehicleData = await this.vehicleRepository.save(vehicle)

    return vehicleData;
  }

  async getVehicleDataOnGroup(getVehicleDataRequestDTO: GetVehicleDataRequestDTO): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vh')
      .where('vh.group = :groupId', { groupId: getVehicleDataRequestDTO.group_id })
      .getMany();

    if (!vehicles) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Id tidak valid' })

    return vehicles
  }


}
