import { Group } from "src/groups/entities/group.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TripMonitoring } from "./trip_monitoring.entity";

export enum ProsesPerjalananEnum {
    BELUM_DIMULAI = 'Belum Dimulai',
    DALAM_PERJALANAN = 'Dalam Perjalanan',
    SELESAI = "Selesai"
}

@Entity({ name: "trips" })
export class Trip {
    @PrimaryGeneratedColumn({ name: "trip_id" })
    id: number;

    @Column({ name: 'jadwal_perjalanan' })
    jadwalPerjalanan: Date;

    @Column({ name: 'alamat_awal' })
    alamatAwal: string;

    @Column({ name: 'latitude_awal' })
    latitudeAwal: string;

    @Column({ name: 'longitude_awal' })
    longitudeAwal: string;

    @Column({ name: 'alamat_tujuan' })
    alamatTujuan: string;

    @Column({ name: 'latitude_tujuan' })
    latitudeTujuan: string;

    @Column({ name: 'longitude_tujuan' })
    longitudeTujuan: string;

    @Column({ name: 'nama_kendaraan' })
    namaKendaraan: string;

    @Column({ name: 'no_polisi' })
    noPolisi: string;

    @Column()
    status: ProsesPerjalananEnum;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @ManyToOne(() => Group, group => group.trips, { eager: true })
    group: Group;

    @ManyToOne(() => User, { nullable: true, eager: true },)
    driver: User;

    @CreateDateColumn({ name: "dimulai_pada", nullable: true })
    dimulaiPada: Date | null;

    @CreateDateColumn({ name: "diakhiri_pada", nullable: true })
    diakhiriPada: Date | null;

    @Column({ name: "durasi_perjalanan", nullable: true })
    durasiPerjalanan: string;

    @Column({ name: "tinggi_badan_driver", nullable: true })
    tingiBadanDriver: string;

    @Column({ name: "berat_badan_driver", nullable: true })
    beratBadanDriver: string;

    @Column({ name: "tekanan_darah_driver", nullable: true })
    tekananDarahDriver: string;

    @Column({ name: "riwayat_penyakit_driver", nullable: true })
    riwayatPenyakitDriver: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
