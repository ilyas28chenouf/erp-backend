import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { FinanceCategoryOrmEntity } from './finance-category.orm-entity';

@Entity({ name: 'budget_plans' })
export class BudgetPlanOrmEntity extends BaseUuidEntity {
  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty()
  @Column({ type: 'uuid' })
  categoryId: string;

  @ApiProperty()
  @Column({ type: 'int' })
  periodYear: number;

  @ApiProperty()
  @Column({ type: 'int' })
  periodMonth: number;

  @ApiProperty({ example: '10000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  plannedAmount: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.budgetPlans, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectOrmEntity | null;

  @ManyToOne(() => FinanceCategoryOrmEntity, (category) => category.budgetPlans, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: FinanceCategoryOrmEntity;
}
