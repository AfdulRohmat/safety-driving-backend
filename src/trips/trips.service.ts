import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProsesPerjalananEnum, Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { AddTripRequestDTO } from './dto/request/add-trip-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { GetTravelRequestDTO } from './dto/request/get-travel-request.dto';
import { TripMonitoring } from './entities/trip_monitoring.entity';
import { AddTripMonitoringRequestDTO } from './dto/request/add-trip-monitoring-request.dto';
import { AddFaceMonitoringRequestDTO } from './dto/request/add-face-monitoring-request.dto';
import { FaceMonitoring } from './entities/face_monitoring.entity';
import * as ExcelJS from 'exceljs';
import { formatDate } from 'src/utils/format-date';
import { formatDuration } from 'src/utils/format-duration';

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

    trip.dimulaiPada = null
    trip.diakhiriPada = null

    trip.tingiBadanDriver = addTripRequestDTO.tinggiBadan
    trip.beratBadanDriver = addTripRequestDTO.beratBadan
    trip.tekananDarahDriver = addTripRequestDTO.tekananDarah
    trip.riwayatPenyakitDriver = addTripRequestDTO.riwayatPenyakit

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

    if (dataTrip.status === 'Belum Dimulai' && status === 'Dalam Perjalanan') {
      dataTrip.dimulaiPada = new Date();
    }

    if (dataTrip.status === 'Dalam Perjalanan' && status === 'Selesai') {
      dataTrip.diakhiriPada = new Date();
    }

    dataTrip.status = status

    // kalkulasi durasi
    if (dataTrip.dimulaiPada !== null && dataTrip.diakhiriPada !== null) {
      const differenceInMs = dataTrip.diakhiriPada.getTime() - dataTrip.dimulaiPada.getTime();
      const differenceInMinutes = differenceInMs / 1000 / 60;
      dataTrip.durasiPerjalanan = differenceInMinutes.toString();
    }

    this.tripRepository.save(dataTrip)

    return dataTrip;
  }

  // Delete Trip
  async deleteTrip(tripToken: string,) {
    const dataTrip = await this.tripRepository.findOne({
      where: {
        tripToken: tripToken
      }
    })
    if (!dataTrip) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Data trip tidak valid' })

    await this.tripRepository.delete({ tripToken })
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

    // MENGHITUNG RATA-RATA KECEPATAN
    const totalSpeed = tripsMonitoring.reduce((sum, data) => sum + parseFloat(data.kecepatan), 0);
    const averageSpeed = totalSpeed / tripsMonitoring.length;

    // MENGHITUNG RATA-RATA HEART RATE
    const totalHeartRate = tripsMonitoring.reduce((sum, data) => sum + parseFloat(data.heartRate), 0);
    const averageHeartRate = totalHeartRate / tripsMonitoring.length;

    // DEFINE WORKBOOK
    const workbook = new ExcelJS.Workbook();

    const worksheetInformasiUmum = workbook.addWorksheet(`Informasi Umum Perjalanan `);
    const worksheetTripsMonitoring = workbook.addWorksheet(`Data Monitoring Perjalanan `);
    const worksheetFacesMonitoring = workbook.addWorksheet(`Data Deteksi Muka `);
    const worksheetRingkasanPerjalanan = workbook.addWorksheet(`Data Rangkuman Perjalanan `);

    // Define columns
    worksheetRingkasanPerjalanan.columns = [
      { header: 'Rata Rata Kecepatan Kendaraan (KM / Jam)', key: 'averageSpeed', width: 40 },
      { header: 'Rata Rata Data Heart Rate Pengemudi', key: 'averageHeartRate', width: 40 },
      { header: 'Durasi Perjalanan', key: 'durasi', width: 40 },
    ]

    worksheetInformasiUmum.columns = [
      { header: 'Nama Group', key: 'namaGroup', width: 20 },
      { header: 'Nama Driver', key: 'namaDriver', width: 20 },
      { header: 'Email Driver', key: 'emailDriver', width: 20 },
      { header: 'Email Driver', key: 'emailDriver', width: 20 },
      { header: 'Tinggi Badan Driver (cm)', key: 'tinggiBadan', width: 20 },
      { header: 'Berat Badan Driver (kg)', key: 'beratBadan', width: 20 },
      { header: 'Tekanan Darah Driver (mm Hg)', key: 'tekananDarah', width: 20 },
      { header: 'Riwayat Penyakit Driver', key: 'riwayatPenyakit', width: 20 },
      { header: 'Jadwal Perjalanan', key: 'jadwalPerjalanan', width: 20 },
      { header: 'Alamat Awal', key: 'alamatAwal', width: 20 },
      { header: 'Alamat Tujuan', key: 'alamatTujuan', width: 20 },
      { header: 'Nama Kendaraan', key: 'namaKendaraan', width: 20 },
      { header: 'Nomor Polisi', key: 'noPolisi', width: 20 },

    ]

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
      { header: 'Diambil Pada', key: 'createdAt', width: 20 },
    ];

    // Add rows
    worksheetRingkasanPerjalanan.addRow({
      averageSpeed: averageSpeed,
      averageHeartRate: averageHeartRate,
      durasi: formatDuration(parseFloat(dataTrip.durasiPerjalanan)),
    })

    worksheetInformasiUmum.addRow({
      namaGroup: dataTrip.group.name,
      namaDriver: dataTrip.driver.username,
      emailDriver: dataTrip.driver.email,
      tinggiBadan: parseFloat(dataTrip.tingiBadanDriver),
      beratBadan: parseFloat(dataTrip.beratBadanDriver),
      tekananDarah: dataTrip.tekananDarahDriver,
      riwayatPenyakit: dataTrip.riwayatPenyakitDriver,
      jadwalPerjalanan: formatDate(dataTrip.jadwalPerjalanan),
      alamatAwal: dataTrip.alamatAwal,
      alamatTujuan: dataTrip.alamatTujuan,
      namaKendaraan: dataTrip.namaKendaraan,
      noPolisi: dataTrip.noPolisi,
    })

    tripsMonitoring.forEach((trip, index) => {
      worksheetTripsMonitoring.addRow({
        no: index + 1,
        id: trip.id,
        heartRate: parseFloat(trip.heartRate),
        latitude: parseFloat(trip.latitude),
        longitude: parseFloat(trip.longitude),
        status: trip.status,
        kecepatan: parseFloat(trip.kecepatan),
        rpm: parseFloat(trip.rpm),
        thurttle: parseFloat(trip.thurttle),
        sudutPostural: parseFloat(trip.sudutPostural),
        kecepatanPostural: parseFloat(trip.kecepatanPostural),
        durasiPostural: parseFloat(trip.durasiPostural),
        createdAt: trip.createdAt.toISOString()
      });
    });

    facesMonitoring.forEach((face, index) => {
      worksheetFacesMonitoring.addRow({
        no: index + 1,
        id: face.id,
        perclos: parseFloat(face.perclos),
        createdAt: face.createdAt.toISOString()
      });
    });

    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer);
  }


}
