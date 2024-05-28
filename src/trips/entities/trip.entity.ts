import { Group } from "src/groups/entities/group.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ProsesPerjalananEnum {
    BELUM_DIMULAI = 'Belum Dimulai',
    DALAM_PERJALANAN = 'Dalam Perjalanan',
    SELESAI = "Selesai"
}


@Entity({ name: "trips" })
export class Trip {
    @PrimaryGeneratedColumn({ name: "trip_id" })
    tripId: number;

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
    status: string;

    @ManyToOne(() => Group, group => group.trips)
    group: Group;

    @ManyToOne(() => User, { nullable: true })
    driver: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
