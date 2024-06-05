import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProsesPerjalananEnum, Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { AddTripRequestDTO } from './dto/request/add-travel-note-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';
import { TripMonitoring } from './entities/trip_monitoring';
import { AddTripMonitoringRequestDTO } from './dto/request/add-trip-monitoring-request.dto';


@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,

    @InjectRepository(TripMonitoring)
    private readonly tripMonitoringRepository: Repository<TripMonitoring>,

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

    // generate 6 digit random number then convert to string
    const generatedToken: number = Math.floor(100000 + Math.random() * 900000)
    trip.tripToken = generatedToken.toString()

    return await this.tripRepository.save(trip)
  }

  // Get All 
  async getAllTrips(getTravelRequestDTO: GetTravelRequestDTO): Promise<Trip[]> {
    const data = await this.tripRepository
      .createQueryBuilder('tr')
      .leftJoinAndSelect('tr.driver', 'u', 'tr.driverId = u.id')
      .where('tr.groupId = :groupId', { groupId: getTravelRequestDTO.groupId })
      .getMany();

    return data
  }

  // Get By Trip Token
  async getTripByToken(tripToken: string): Promise<Trip> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken: tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    return dataTrip;

  }

  // Add Trip Monitoring
  async addTripMonitoring(addTripMonitoringRequestDTO: AddTripMonitoringRequestDTO): Promise<TripMonitoring | void> {

    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken: addTripMonitoringRequestDTO.tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    const tripMonitoring = new TripMonitoring()
    tripMonitoring.latitude = addTripMonitoringRequestDTO.latitude
    tripMonitoring.longitude = addTripMonitoringRequestDTO.longitude
    tripMonitoring.kecepatan = addTripMonitoringRequestDTO.kecepatan
    tripMonitoring.levelKantuk = addTripMonitoringRequestDTO.levelKantuk
    tripMonitoring.tripToken = addTripMonitoringRequestDTO.tripToken

    return await this.tripMonitoringRepository.save(tripMonitoring);
  }

  // Get TripMonitoring
  async getTripMonitoring(tripToken: string): Promise<TripMonitoring[]> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    const data = await this.tripMonitoringRepository
      .createQueryBuilder('trm')
      .where('trm.tripToken = :tripToken', { tripToken })
      .getMany();

    return data
  }

}
