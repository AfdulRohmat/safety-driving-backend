import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProsesPerjalananEnum, Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { AddTripRequestDTO } from './dto/request/add-travel-note-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';


@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) { }

  async addTrip(addTripRequestDTO: AddTripRequestDTO): Promise<Trip> {
    const userDriver = await this.userRepository.findOne({
      where: {
        id: addTripRequestDTO.driverId
      }
    })
    if (!userDriver) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })

    const group = await this.groupRepository.findOne({
      where: {
        id: addTripRequestDTO.groupId
      }
    })
    if (!group) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Group tidak ditemukan / tidak valid' })

    const trip = new Trip()
    trip.alamatAwal = addTripRequestDTO.alamatAwal
    trip.latitudeAwal = addTripRequestDTO.latitudeAwal
    trip.longitudeAwal = addTripRequestDTO.longitudeAwal

    trip.alamatTujuan = addTripRequestDTO.alamatTujuan
    trip.latitudeTujuan = addTripRequestDTO.latitudeTujuan
    trip.longitudeTujuan = addTripRequestDTO.longitudeTujuan

    trip.namaKendaraan = addTripRequestDTO.namaKendaraan
    trip.noPolisi = addTripRequestDTO.noPolisi

    trip.status = ProsesPerjalananEnum.BELUM_DIMULAI

    trip.driver = userDriver
    trip.group = group

    return await this.tripRepository.save(trip)
  }

  // // Get All 
  async getAllTrips(getTravelRequestDTO: GetTravelRequestDTO): Promise<Trip[]> {
    const data = await this.tripRepository
      .createQueryBuilder('tr')
      .leftJoinAndSelect('tr.driver', 'u', 'tr.driverId = u.id')
      .where('tr.groupId = :groupId', { groupId: getTravelRequestDTO.groupId })
      .getMany();

    return data
  }

}
