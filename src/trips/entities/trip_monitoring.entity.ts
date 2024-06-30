import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "./trip.entity";

@Entity({ name: "trip_monitoring" })
export class TripMonitoring {
    @PrimaryGeneratedColumn({ name: "trip_monitoring_id" })
    id: number;

    @Column({ name: 'heart_rate' })
    heartRate: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    kecepatan: string;

    @Column()
    rpm: string;

    @Column()
    thurttle: string;

    @Column({ name: 'sudut_postural' })
    sudutPostural: string;

    @Column({ name: 'kecepatan_postural' })
    kecepatanPostural: string;

    @Column({ name: 'durasi_postural' })
    durasiPostural: string;

    @Column({ name: 'status' })
    status: string;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}