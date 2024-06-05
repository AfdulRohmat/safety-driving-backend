import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "./trip.entity";

@Entity({ name: "trip_monitoring" })
export class TripMonitoring {
    @PrimaryGeneratedColumn({ name: "trip_monitoring_id" })
    id: number;

    @Column({ name: 'latitude' })
    latitude: string;

    @Column({ name: 'longitude' })
    longitude: string;

    @Column()
    kecepatan: string;

    @Column({ name: 'level_kantuk' })
    levelKantuk: string;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}