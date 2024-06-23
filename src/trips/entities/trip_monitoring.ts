import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "./trip.entity";

@Entity({ name: "trip_monitoring" })
export class TripMonitoring {
    @PrimaryGeneratedColumn({ name: "trip_monitoring_id" })
    id: number;

    @Column({ name: 'heart_rate' })
    heartRate: string;

    @Column({ name: 'posisi_pedal_gas' })
    posisiPedalGas: string;

    @Column()
    rpm: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column({ name: 'kondisi_kantuk' })
    kondisiKantuk: string;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}