import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMember } from "./group-member.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";

@Entity({ name: "groups" })
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User)
    createdBy: User;

    @OneToMany(() => GroupMember, groupMember => groupMember.group)
    members: GroupMember[];

    @OneToMany(() => Vehicle, vehicle => vehicle.group)
    vehicles: Vehicle[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}