import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { Role } from 'src/users/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Group,
      GroupMember
    ])
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
