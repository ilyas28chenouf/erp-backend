import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USERS_REPOSITORY,
} from './domain/interfaces/users.repository.interface';
import { UsersService } from './application/services/users.service';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: USERS_REPOSITORY,
      useExisting: UsersRepository,
    },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
