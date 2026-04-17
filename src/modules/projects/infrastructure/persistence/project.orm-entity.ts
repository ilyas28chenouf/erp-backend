import { ApiProperty } from '@nestjs/swagger';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { DocumentFolderOrmEntity } from '../../../documents/infrastructure/persistence/document-folder.orm-entity';
import { DocumentOrmEntity } from '../../../documents/infrastructure/persistence/document.orm-entity';
import { BudgetPlanOrmEntity } from '../../../finance/infrastructure/persistence/budget-plan.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../../../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { TaskOrmEntity } from '../../../tasks/infrastructure/persistence/task.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectMemberOrmEntity } from './project-member.orm-entity';

@Entity({ name: 'projects' })
export class ProjectOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @ApiProperty()
  @Column({ type: 'date' })
  startDate: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'date', nullable: true })
  deadline?: string | null;

  @ApiProperty({ enum: ProjectStatus, enumName: 'ProjectStatus' })
  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNED })
  status: ProjectStatus;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  responsibleUserId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.responsibleProjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'responsibleUserId' })
  responsibleUser?: UserOrmEntity | null;

  @OneToMany(() => ProjectMemberOrmEntity, (projectMember) => projectMember.project)
  members?: ProjectMemberOrmEntity[];

  @OneToMany(() => PaymentRegistryEntryOrmEntity, (entry) => entry.project)
  paymentRegistryEntries?: PaymentRegistryEntryOrmEntity[];

  @OneToMany(() => BudgetPlanOrmEntity, (budgetPlan) => budgetPlan.project)
  budgetPlans?: BudgetPlanOrmEntity[];

  @OneToMany(() => DocumentFolderOrmEntity, (folder) => folder.project)
  documentFolders?: DocumentFolderOrmEntity[];

  @OneToMany(() => DocumentOrmEntity, (document) => document.project)
  documents?: DocumentOrmEntity[];

  @OneToMany(() => TaskOrmEntity, (task) => task.project)
  tasks?: TaskOrmEntity[];
}
