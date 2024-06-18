import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "face_monitoring" })
export class FaceMonitoring {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    perclos: string;

    @Column()
    pebr: string;

    @Column({ name: 'n-yawn' })
    nYawn: string;

    @Column({ name: 'kondisi_kantuk' })
    kondisiKantuk: string;

    @Column({ name: 'trip_token' })
    tripToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}