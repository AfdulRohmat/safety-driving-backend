import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupRequestDTO } from './dto/request/create-group-request.dto';
import { User } from 'src/users/entities/user.entity';
import { GroupMember, GroupRole } from './entities/group-member.entity';
import { AddingUserToGroupMemberRequestDTO } from './dto/request/adding-user-to-group-member-request.dto';
import { GetDetailGroupRequestDTO } from './dto/request/get-detail-group.dto';


@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,

        @InjectRepository(GroupMember)
        private readonly groupMemberRepository: Repository<GroupMember>
    ) { }

    async createGroup(email: string, createGroupRequestDTO: CreateGroupRequestDTO): Promise<Group> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        })
        if (!user) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })

        const group = new Group();
        group.name = createGroupRequestDTO.nama_group;
        group.createdBy = user
        const groupData = await this.groupRepository.save(group)

        const groupMember = new GroupMember();
        groupMember.group = group;
        groupMember.user = user;
        groupMember.role = [GroupRole.ADMIN_GROUP]
        await this.groupMemberRepository.save(groupMember)

        return groupData;
    }

    async addUserToGroupMemberByUsername(addingUserToGroupMemberRequestDTO: AddingUserToGroupMemberRequestDTO): Promise<GroupMember> {
        const user = await this.userRepository.findOne({
            where: {
                id: addingUserToGroupMemberRequestDTO.user_id
            }
        })
        if (!user) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid' })

        const group = await this.groupRepository.findOne({
            where: {
                id: addingUserToGroupMemberRequestDTO.group_id
            }
        })
        if (!group) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Group tidak valid' })

        const userAlreadyInGroup = await this.groupMemberRepository.findOne({
            where: {
                user: {
                    id: user.id
                }
            }
        })

        if (userAlreadyInGroup) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'User sudah terdaftar dalam grup yang dipilih' })

        const groupMember = new GroupMember();
        groupMember.user = user;
        groupMember.group = group

        // Adding Role
        switch (addingUserToGroupMemberRequestDTO.role) {
            case 'DRIVER':
                groupMember.role = [GroupRole.DRIVER]
                break;
            case 'COMPANY':
                groupMember.role = [GroupRole.COMPANY]
                break;
            case 'FAMILY':
                groupMember.role = [GroupRole.FAMILY]
                break;
            case 'MEDIC':
                groupMember.role = [GroupRole.MEDIC]
                break;
            default:
                break;
        }

        return await this.groupMemberRepository.save(groupMember);
    }

    async getGroupsByUserLogin(email: string): Promise<GroupMember[]> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        })
        if (!user) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })

        const data = await this.groupMemberRepository
            .createQueryBuilder('gm')
            .leftJoinAndSelect('gm.group', 'g', 'gm.groupId = g.id')
            .where('gm.userId = :userId', { userId: user.id })
            .getMany();

        return data
    }

    async getDetailGroup(getDetailGroupRequestDTO: GetDetailGroupRequestDTO): Promise<Group> {
        const group = await this.groupRepository
            .createQueryBuilder('g')
            .leftJoinAndSelect('g.members', 'groupMember')
            .leftJoin('groupMember.user', 'user')
            .where('g.id = :groupId', { groupId: getDetailGroupRequestDTO.group_id })
            .addSelect(['user.id', 'user.username', 'user.email'])
            .getOne();

        if (!group) throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Group tidak ditemukan' })

        return group;
    }

}
