import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AddDetailUserRequestDTO } from './dto/request/add-detail-user-request.dto';
import { EditDetailUserRequestDTO } from './dto/request/edit-detail-user-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtGuard)
  @Get('info')
  @UseInterceptors(NoFilesInterceptor())
  async getUser(@Request() request: any, @Res() response: Response) {
    try {
      console.log("request.user :", request.user)
      const responseData: UserDetailResponseDTO = await this.usersService.getUser(request.user.username);
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      console.log(error)
      response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @Post('detail-user')
  @UseInterceptors(NoFilesInterceptor())
  async addDetailUserInfo(@Request() request: any, @Body() addDetailUserRequestDTO: AddDetailUserRequestDTO, @Res() response: Response) {
    try {
      const responseData = await this.usersService.addDetailUserInfo(request.user.username, addDetailUserRequestDTO);
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      // response.status(error.status).json(error.response);
      response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @Put('detail-user')
  @UseInterceptors(NoFilesInterceptor())
  async editDetailUserInfo(@Request() request: any, @Body() editDetailUserRequestDTO: EditDetailUserRequestDTO, @Res() response: Response) {
    try {
      const responseData = await this.usersService.editDetailUserInfo(request.user.username, editDetailUserRequestDTO);
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      throw response.status(error.status).json(error.response);
      // throw response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('hello-service')
  async getHello(@Request() request: any, @Res() response: Response) {
    try {
      console.log(request.user)
      const responseData = await this.usersService.getHello();
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }
}
