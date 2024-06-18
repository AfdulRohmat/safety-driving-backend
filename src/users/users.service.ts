import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { RegisterRequestDTO } from '../auth/dto/request/register-request.dto';
import { Role } from './entities/role.entity';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';
import { DetailUser, JenisKelaminEnum } from './entities/detail-user.entity';
import { AddDetailUserRequestDTO } from './dto/request/add-detail-user-request.dto';
import { EditDetailUserRequestDTO } from './dto/request/edit-detail-user-request.dto';
import { GetAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { GetDetailUserRequestDTO } from './dto/request/get-detail-user-request.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(DetailUser)
        private readonly detailUserRepository: Repository<DetailUser>,

    ) { }


    async getUser(email: string): Promise<User> {
        const user = await this.userRepository.findOneOrFail({
            where: {
                email: email
            }, relations: ['detailUser']
        })

        if (!user) {
            // throw new HttpException('', HttpStatus.BAD_REQUEST);
            throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })
        }

        return user
    }

    async addOrUpdateDetailUserInfo(addDetailUserRequestDTO: AddDetailUserRequestDTO): Promise<User | any> {
        // Get User Data
        const user = await this.userRepository.findOne({
            where: {
                email: addDetailUserRequestDTO.email
            }
        })
        if (!user) {
            // throw new HttpException('', HttpStatus.BAD_REQUEST);
            throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun tidak valid, silahkan login ulang' })
        }


        // Create Detail user
        const detailUser = new DetailUser();
        detailUser.namaDepan = addDetailUserRequestDTO.nama_depan;
        detailUser.namaBelakang = addDetailUserRequestDTO.nama_belakang;
        detailUser.noTelepon = addDetailUserRequestDTO.no_telepon;
        detailUser.tempatLahir = addDetailUserRequestDTO.tempat_lahir;
        detailUser.tanggalLahir = addDetailUserRequestDTO.tanggal_lahir;
        detailUser.user = user

        switch (addDetailUserRequestDTO.jenis_kelamin) {
            case 'Laki-Laki':
                detailUser.jenisKelamin = JenisKelaminEnum.LAKI_LAKI
                break;
            case 'Perempuan':
                detailUser.jenisKelamin = JenisKelaminEnum.PEREMPUAN
                break;
            default:
                break;
        }

        await this.detailUserRepository.upsert([detailUser], {
            conflictPaths: ['user.id'], // assuming 'userId' is the unique identifier or primary key
        });

        // await this.detailUserRepository.save(detailUser)

        // Update the user's detailUser relationship
        user.detailUser = detailUser;

        // Save the updated User entity
        await this.userRepository.save(user)

        return this.userRepository.findOneOrFail({
            where: { email: addDetailUserRequestDTO.email }, relations: ['detailUser']
        })
    }

    async getDetailUser(getDetailUserRequestDTO: GetDetailUserRequestDTO): Promise<User | any> {
        return this.userRepository.findOne({
            where: { email: getDetailUserRequestDTO.email }, relations: ['detailUser']
        })
    }


    async getAllUsers(searchTerm?: string): Promise<GetAllUsersResponseDTO[]> {
        let query = {};

        if (searchTerm) {
            query = {
                where: [
                    { email: Like(`%${searchTerm}%`) },
                    { username: Like(`%${searchTerm}%`) },
                ],
            };
        }
        const users = await this.userRepository.find(query);

        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
        }))
    }

    async getHello() {
        return 'Hello User Service!';
    }
}
