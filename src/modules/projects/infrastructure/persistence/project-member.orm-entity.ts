import { ApiProperty } from '@nestjs/swagger';
import { CreatedAtOnlyEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProjectOrmEntity } from './project.orm-entity';

@Entity({ name: 'project_members' })
export class ProjectMemberOrmEntity extends CreatedAtOnlyEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  assignmentRole: string;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: ProjectOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;
}
