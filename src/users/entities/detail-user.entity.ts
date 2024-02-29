import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum JenisKelaminEnum {
    LAKI_LAKI = 'Laki-Laki',
    PEREMPUAN = 'Perempuan',
}

@Entity('detail-users')
export class DetailUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nama_depan' })
    namaDepan: string;

    @Column({ name: 'nama_belakang' })
    namaBelakang: string;

    @Column({ name: 'jenis_kelamin' })
    jenisKelamin: JenisKelaminEnum;

    @Column({ name: 'tempat_lahir' })
    tempatLahir: string;

    @Column({ name: 'tanggal_lahir' })
    tanggalLahir: Date;

    @OneToOne(() => User, (user) => user.detailUser)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}