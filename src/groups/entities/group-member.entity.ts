import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Group } from "./group.entity";

export enum GroupRole {
    DRIVER = 'ROLE_DRIVER',
    COMPANY = 'ROLE_COMPANY',
    FAMILY = 'ROLE_FAMILY',
    MEDIC = 'ROLE_MEDIC',
    KNKT = 'ROLE_KNKT',
    USER_GROUP = 'ROLE_USER_GROUP',
    ADMIN_GROUP = 'ROLE_ADMIN_GROUP'
}

@Entity({ name: "group-members" })
export class GroupMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.groupMembers)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: GroupRole })
    role: GroupRole;

    @ManyToOne(() => Group, group => group.members)
    @JoinColumn({ name: 'groupId' })
    group: Group;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}