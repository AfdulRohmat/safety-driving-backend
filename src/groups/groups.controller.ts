import { Body, Controller, Get, Post, Query, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateGroupRequestDTO } from './dto/request/create-group-request.dto';
import { Response, query } from 'express';
import { Group } from './entities/group.entity';
import { CommonResponseDto } from 'src/utils/common-response.dto';

import { GroupMember } from './entities/group-member.entity';
import { GetDetailGroupRequestDTO } from './dto/request/get-detail-group.dto';
import { AddingUserToGroupMemberRequestDTO } from './dto/request/adding-user-to-group-member-request.dto';
import { RemoveUserFromGroupMemberRequestDTO } from './dto/request/remove-user-from-group-member-request.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @UseGuards(JwtGuard)
  @Post("/")
  @UseInterceptors(NoFilesInterceptor())
  async createGroup(@Request() request: any, @Body() createGroupRequestDTO: CreateGroupRequestDTO, @Res() response: Response) {
    const responseData: Group = await this.groupsService.createGroup(request.user.username, createGroupRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }

  @UseGuards(JwtGuard)
  @Get("/")
  @UseInterceptors(NoFilesInterceptor())
  async getGroupsByUserLogin(@Request() request: any, @Res() response: Response) {
    const responseData: GroupMember[] = await this.groupsService.getGroupsByUserLogin(request.user.username)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }

  @UseGuards(JwtGuard)
  @Post("/adding-user")
  @UseInterceptors(NoFilesInterceptor())
  async addUserToGroupMemberByUsername(@Body() addingUserToGroupMemberRequestDTO: AddingUserToGroupMemberRequestDTO, @Res() response: Response) {
    const responseData: GroupMember = await this.groupsService.addUserToGroupMemberByUsername(addingUserToGroupMemberRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @UseGuards(JwtGuard)
  @Post("/remove-user")
  @UseInterceptors(NoFilesInterceptor())
  async removeUserFromGroupMember(@Body() RemoveUserFromGroupMemberRequestDTO: RemoveUserFromGroupMemberRequestDTO, @Res() response: Response) {
    const responseData: any = await this.groupsService.removeUserFromGroupMember(RemoveUserFromGroupMemberRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @UseGuards(JwtGuard)
  @Post("/detail")
  @UseInterceptors(NoFilesInterceptor())
  async getDetailGroup(@Body() getDetailGroupRequestDTO: GetDetailGroupRequestDTO, @Res() response: Response) {
    const responseData: Group = await this.groupsService.getDetailGroup(getDetailGroupRequestDTO)
    const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);

  }
}
