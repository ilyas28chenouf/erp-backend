import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

@Entity({ name: 'tasks' })
export class TaskOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  assigneeUserId?: string | null;

  @ApiProperty({ nullable: true, type: String, format: 'date' })
  @Column({ type: 'date', nullable: true })
  dueDate?: string | null;

  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, enumName: 'TaskPriority' })
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: ProjectOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assigneeUserId' })
  assigneeUser?: UserOrmEntity | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.createdTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser?: UserOrmEntity | null;
}
