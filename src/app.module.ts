import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IsUniqueConstraint } from './utils/validation/is-unique-constraint';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { DetailUser } from './users/entities/detail-user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forFeature([User, Role, DetailUser]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule { }
