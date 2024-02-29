import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { DetailUser } from "./detail-user.entity";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column({ unique: true })
    @IsEmail({}, { message: "Invalid Email" })
    email: string

    @Column({ select: false })
    password: string

    @Column({ name: "is_verified", default: false })
    isVerified: boolean

    @Column({
        name: "activation_code",
        default: null,
        select: false
    })
    activationCode: number

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];

    @OneToOne(() => DetailUser, (detailUser) => detailUser.user, { cascade: true })
    @JoinColumn({ name: 'detail_user_id' })
    detailUser: DetailUser;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
