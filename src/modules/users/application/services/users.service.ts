import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  USERS_REPOSITORY,
} from '../../domain/interfaces/users.repository.interface';
import type { UsersRepositoryInterface } from '../../domain/interfaces/users.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryUsersDto } from '../dto/query-users.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserOrmEntity } from '../../infrastructure/persistence/user.orm-entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserOrmEntity> {
    const existing = await this.usersRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existing) {
      throw new ConflictException('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email.toLowerCase(),
      passwordHash,
      role: createUserDto.role,
      isActive: createUserDto.isActive ?? true,
    });
  }

  findAll(query: QueryUsersDto): Promise<UserOrmEntity[]> {
    return this.usersRepository.findAll(query as Record<string, unknown>);
  }

  async findOne(id: string): Promise<UserOrmEntity> {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id "${id}" was not found.`);
    }

    return user;
  }

  findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserOrmEntity> {
    const payload: Partial<UserOrmEntity> = {
      fullName: updateUserDto.fullName,
      email: updateUserDto.email?.toLowerCase(),
      role: updateUserDto.role,
      isActive: updateUserDto.isActive,
    };

    if (updateUserDto.email) {
      const existing = await this.usersRepository.findOneByEmail(
        updateUserDto.email,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException('User with this email already exists.');
      }
    }

    if (updateUserDto.password) {
      payload.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.usersRepository.update(id, payload);

    if (!updated) {
      throw new NotFoundException(`User with id "${id}" was not found.`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.remove(id);
  }
}
