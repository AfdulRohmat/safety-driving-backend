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
import { AddFaceMonitoringRequestDTO } from './dto/request/add-face-monitoring-request.dto';
import { FaceMonitoring } from './entities/face_monitoring';
import * as ExcelJS from 'exceljs';
import { formatDate } from 'src/utils/format-date';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,

    @InjectRepository(TripMonitoring)
    private readonly tripMonitoringRepository: Repository<TripMonitoring>,

    @InjectRepository(FaceMonitoring)
    private readonly faceMonitoringRepository: Repository<FaceMonitoring>,

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
    trip.jadwalPerjalanan = addTripRequestDTO.jadwalPerjalanan
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
    const query = this.tripRepository
      .createQueryBuilder('tr')
      .leftJoinAndSelect('tr.driver', 'u', 'tr.driverId = u.id')
      .where('tr.groupId = :groupId', { groupId: getTravelRequestDTO.groupId })

    if (getTravelRequestDTO.status) {
      query.andWhere('tr.status = :status', { status: getTravelRequestDTO.status });
    }

    query.orderBy('tr.createdAt', 'DESC');

    const data = await query.getMany();

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

  // Change Trip Status
  async changeTripStatus(tripToken: string, status: ProsesPerjalananEnum): Promise<Trip> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken: tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    dataTrip.status = status
    this.tripRepository.save(dataTrip)

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
    tripMonitoring.heartRate = addTripMonitoringRequestDTO.heartRate
    tripMonitoring.latitude = addTripMonitoringRequestDTO.latitude
    tripMonitoring.longitude = addTripMonitoringRequestDTO.longitude
    tripMonitoring.kecepatan = addTripMonitoringRequestDTO.kecepatan
    tripMonitoring.rpm = addTripMonitoringRequestDTO.rpm
    tripMonitoring.thurttle = addTripMonitoringRequestDTO.thurttle
    tripMonitoring.thurttle = addTripMonitoringRequestDTO.thurttle
    tripMonitoring.sudutPostural = addTripMonitoringRequestDTO.sudutPostural
    tripMonitoring.kecepatanPostural = addTripMonitoringRequestDTO.kecepatanPostural
    tripMonitoring.durasiPostural = addTripMonitoringRequestDTO.durasiPostural
    tripMonitoring.status = addTripMonitoringRequestDTO.status
    tripMonitoring.tripToken = addTripMonitoringRequestDTO.tripToken

    return await this.tripMonitoringRepository.save(tripMonitoring);
  }

  // Add Face Monitoring 
  async addFaceMonitoring(addFaceMonitoringRequestDTO: AddFaceMonitoringRequestDTO): Promise<FaceMonitoring> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken: addFaceMonitoringRequestDTO.tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    const faceMonitoring = new FaceMonitoring()

    faceMonitoring.perclos = addFaceMonitoringRequestDTO.perclos
    faceMonitoring.pebr = addFaceMonitoringRequestDTO.pebr
    faceMonitoring.nYawn = addFaceMonitoringRequestDTO.nYawn
    faceMonitoring.kondisiKantuk = addFaceMonitoringRequestDTO.kondisiKantuk
    faceMonitoring.tripToken = addFaceMonitoringRequestDTO.tripToken

    return await this.faceMonitoringRepository.save(faceMonitoring);
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

  // Get Face Monitoring
  async getFaceMonitoring(tripToken: string): Promise<FaceMonitoring[]> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    const data = await this.faceMonitoringRepository
      .createQueryBuilder('fm')
      .where('fm.tripToken = :tripToken', { tripToken })
      .getMany();

    return data
  }

  // Export / Download Trip Data
  async exportTripsToExcel(tripToken: string): Promise<Buffer> {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    const jadwalPerjalananFormattedDate = formatDate(dataTrip.jadwalPerjalanan);

    // QUERY TRIP MONITORING
    const queryTripMonitoring = this.tripMonitoringRepository
      .createQueryBuilder('trm')
      .where('trm.tripToken = :tripToken', { tripToken })
    queryTripMonitoring.orderBy('trm.createdAt', 'DESC');
    const tripsMonitoring = await queryTripMonitoring.getMany();

    // QUERY FACE MONITORING
    const queryFacepMonitoring = this.faceMonitoringRepository
      .createQueryBuilder('fm')
      .where('fm.tripToken = :tripToken', { tripToken })
    queryFacepMonitoring.orderBy('fm.createdAt', 'DESC');
    const facesMonitoring = await queryFacepMonitoring.getMany();

    // DEFINE WORKBOOK
    const workbook = new ExcelJS.Workbook();

    const worksheetTripsMonitoring = workbook.addWorksheet(`Data Perjalanan Tanggal ${jadwalPerjalananFormattedDate}`);
    const worksheetFacesMonitoring = workbook.addWorksheet(`Data Deteksi Muka Tanggal ${jadwalPerjalananFormattedDate}`);

    // Define columns
    worksheetTripsMonitoring.columns = [
      { header: 'No', key: 'no', width: 10 },
      { header: 'Heart Rate', key: 'heartRate', width: 20 },
      { header: 'Latitude', key: 'latitude', width: 20 },
      { header: 'Longitude', key: 'longitude', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Kecepatan', key: 'kecepatan', width: 10 },
      { header: 'Rpm', key: 'rpm', width: 20 },
      { header: 'Thurttle', key: 'thurttle', width: 20 },
      { header: 'Sudut Postural', key: 'sudutPostural', width: 20 },
      { header: 'Kecepatan Postural', key: 'kecepatanPostural', width: 20 },
      { header: 'Durasi Postural', key: 'durasiPostural', width: 20 },
      { header: 'Diambil Pada', key: 'createdAt', width: 20 },
    ];

    worksheetFacesMonitoring.columns = [
      { header: 'No', key: 'no', width: 10 },
      { header: 'PERCLOS', key: 'perclos', width: 20 },
      { header: 'PEBR', key: 'pebr', width: 10 },
      { header: 'N-Yawn', key: 'nYawn', width: 20 },
      { header: 'Kondisi Kantuk', key: 'kondisiKantuk', width: 20 },
      { header: 'Diambil Pada', key: 'createdAt', width: 20 },
    ];

    // Add rows
    tripsMonitoring.forEach((trip, index) => {
      worksheetTripsMonitoring.addRow({
        no: index + 1,
        id: trip.id,
        heartRate: trip.heartRate,
        latitude: parseFloat(trip.latitude),
        longitude: parseFloat(trip.longitude),
        status: trip.status,
        kecepatan: trip.kecepatan,
        rpm: trip.rpm,
        thurttle: trip.thurttle,
        sudutPostural: trip.sudutPostural,
        kecepatanPostural: trip.kecepatanPostural,
        durasiPostural: trip.durasiPostural,
        createdAt: trip.createdAt.toISOString()
      });
    });

    facesMonitoring.forEach((face, index) => {
      worksheetFacesMonitoring.addRow({
        no: index + 1,
        id: face.id,
        perclos: parseFloat(face.perclos),
        pebr: parseFloat(face.pebr),
        nYawn: parseFloat(face.nYawn),
        kondisiKantuk: face.kondisiKantuk,
        createdAt: face.createdAt.toISOString()
      });
    });

    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer);
  }


}
