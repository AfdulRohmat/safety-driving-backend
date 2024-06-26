import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "./trip.entity";

@Entity({ name: "trip_monitoring" })
export class TripMonitoring {
    @PrimaryGeneratedColumn({ name: "trip_monitoring_id" })
    id: number;

    @Column({ name: 'heart_rate' })
    heartRate: number;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    kecepatan: number;

    @Column()
    rpm: number;

    @Column()
    thurttle: number;

    @Column({ name: 'sudut_postural' })
    sudutPostural: number;

    @Column({ name: 'kecepatan_postural' })
    kecepatanPostural: number;

    @Column({ name: 'durasi_postural' })
    durasiPostural: number;

    @Column({ name: 'status' })
    status: string;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}