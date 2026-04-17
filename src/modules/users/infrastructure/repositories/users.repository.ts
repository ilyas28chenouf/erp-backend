import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { UsersRepositoryInterface } from '../../domain/interfaces/users.repository.interface';
import { QueryUsersDto } from '../../application/dto/query-users.dto';
import { UserOrmEntity } from '../persistence/user.orm-entity';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(entity: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const created = this.repository.create(entity);
    return this.repository.save(created);
  }

  async findAll(filters?: QueryUsersDto): Promise<UserOrmEntity[]> {
    const where: FindOptionsWhere<UserOrmEntity> = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (typeof filters?.isActive === 'boolean') {
      where.isActive = filters.isActive;
    }

    if (filters?.email) {
      where.email = ILike(`%${filters.email}%`);
    }

    return this.repository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  findOneById(id: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  findOneByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async update(
    id: string,
    payload: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity | null> {
    const existing = await this.findOneById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.repository.save(existing);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
