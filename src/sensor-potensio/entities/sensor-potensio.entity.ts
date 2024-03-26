import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sensor-potensio")
export class SensorPotensio {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    category: string

    @Column()
    value: string

    @Column({ name: "user_id" })
    userid: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
