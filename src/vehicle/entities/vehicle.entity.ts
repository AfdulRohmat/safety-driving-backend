import { GroupMember } from "src/groups/entities/group-member.entity";
import { Group } from "src/groups/entities/group.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "vehicles" })
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nama: string;

    @Column({ name: 'no_polisi' })
    noPolisi: string;

    @Column({ type: 'text' })
    detail: string;

    @ManyToOne(() => Group, group => group.vehicles)
    group: Group;

    @ManyToOne(() => User, { nullable: true })
    driver: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
