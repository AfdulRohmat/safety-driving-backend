import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { RegisterResponseDTO } from './dto/response/register-response.dto';
import * as bcrypt from 'bcrypt';
import { Role, UserRole } from 'src/users/entities/role.entity';
import { EmailService } from 'src/email/email.service';
import { ActivateAccountRequestDTO } from './dto/request/activate-account-request.dto';
import { ActivateAccountResponseDTO } from './dto/response/activate-account-response.dto';
import { JwtService } from '@nestjs/jwt';
import { ResendTokenRequestDTO } from './dto/request/resend-token-request.dto';
import { ResendTokenResponseDTO } from './dto/response/resend-token-response.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private emailService: EmailService,
    private jwtService: JwtService,
  ) { }

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // bcrypt password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // generate random activation code
    const activationCode: number = Math.floor(100000 + Math.random() * 900000)

    // adding role
    const userRole = new Role();
    userRole.name = UserRole.USER
    await this.roleRepository.save(userRole)

    // adding user
    const user = new User();
    user.username = request.username
    user.email = request.email
    user.password = hashedPassword
    user.isVerified = false
    user.activationCode = activationCode
    user.roles = [userRole]

    await this.userRepository.save(user);

    // send to email
    this.emailService.sendUserConfirmation(user)

    return new RegisterResponseDTO(user.email, "Registrasi berhasil Mohon check email anda")
  }

  async activateAccount(request: ActivateAccountRequestDTO): Promise<RegisterResponseDTO> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: request.email
      }
    })

    console.log(request)


    if (user.isVerified) {
      throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun sudah terverifikasi. Silahkan login' })
    }

    if (user.activationCode == request.activationCode) {
      user.isVerified = true;
      await this.userRepository.save(user);
      return new ActivateAccountResponseDTO(user.email, "Aktivasi akun berhasil, silahkan login")
    } else {
      throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Kode aktivasi tidak valid' })
    }
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      sub: {
        username: user.username,
      }
    }
    const { username, email } = user
    const jwtSign = this.jwtService.sign(payload)

    return {
      username,
      email,
      accessToken: jwtSign
    }
  }

  async validateUser(username: string, password: string) {

    const user = await this.userRepository.findOneOrFail({
      where: {
        email: username
      }
    })

    if (user.isVerified == false) {
      throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun belum terverifikasi. Silahkan verifikasi terlebih dahulu' })
    }

    const actualPassword = await bcrypt.compare(password, user.password)

    if (user && actualPassword) {
      const { password, ...rest } = user

      return rest;
    }

    return null;
  }

  async resendActivationCode(resenTokenRequestDTO: ResendTokenRequestDTO): Promise<ResendTokenResponseDTO> {
    const user = await this.userRepository.findOne({
      where: {
        email: resenTokenRequestDTO.email
      }
    })

    if (!user) {
      throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun belum terdaftar. Silahkan register' })
    }

    if (user.isVerified == true) {
      throw new BadRequestException('Proses gagal', { cause: new Error(), description: 'Akun sudah terverifikasi. Silahkan login' })
    }



    // generate random activation code
    const activationCode: number = Math.floor(100000 + Math.random() * 900000)

    // re assigned actionCode
    user.activationCode = activationCode
    this.userRepository.save(user);

    // send to email
    this.emailService.sendUserConfirmation(user)

    return new ResendTokenResponseDTO(user.email, "Activation Code berhasil dikirim ulang, Mohon check email anda")
  }


  async logout(): Promise<void> { }

}
