import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UseGuards, UseInterceptors, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddDetailUserRequestDTO } from './dto/request/add-detail-user-request.dto';
import { EditDetailUserRequestDTO } from './dto/request/edit-detail-user-request.dto';
import { GetDetailUserRequestDTO } from './dto/request/get-detail-user-request.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtGuard)
  @Get('info')
  @UseInterceptors(NoFilesInterceptor())
  async getUser(@Request() request: any, @Res() response: Response) {
    const responseData: UserDetailResponseDTO = await this.usersService.getUser(request.user.username);
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @UseGuards(JwtGuard)
  @Post('detail-user')
  @UseInterceptors(NoFilesInterceptor())
  async addDetailUserInfo(@Body() addDetailUserRequestDTO: AddDetailUserRequestDTO, @Res() response: Response) {
    const responseData = await this.usersService.addOrUpdateDetailUserInfo(addDetailUserRequestDTO);
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }

  @Post('get-detail-user')
  @UseInterceptors(NoFilesInterceptor())
  async getDetailUser(@Body() getDetailUserRequestDTO: GetDetailUserRequestDTO, @Res() response: Response) {
    const responseData = await this.usersService.getDetailUser(getDetailUserRequestDTO);
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }

  @UseGuards(JwtGuard)
  @Get('all-users')
  async getAllUsers(@Request() request: any, @Res() response: Response, @Query('search') searchTerm?: string,) {
    const responseData = await this.usersService.getAllUsers(searchTerm);
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }

  @UseGuards(JwtGuard)
  @Get('hello-service')
  async getHello(@Request() request: any, @Res() response: Response) {
    const responseData = await this.usersService.getHello();
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }
}
