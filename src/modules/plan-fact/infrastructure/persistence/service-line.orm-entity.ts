import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { CustomerOrmEntity } from '../../../customers/infrastructure/persistence/customer.orm-entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { PlanFactEntryOrmEntity } from './plan-fact-entry.orm-entity';
import { WorkOrderOrmEntity } from './work-order.orm-entity';

@Entity({ name: 'service_lines' })
export class ServiceLineOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  customerId: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({ nullable: true, example: '100000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  plannedAmountYear?: string | null;

  @ApiProperty({ nullable: true, example: '15000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  receivedAdvance?: string | null;

  @ApiProperty({ nullable: true, example: '32000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  unclosedVolumeAmount?: string | null;

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.serviceLines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerOrmEntity;

  @ManyToOne(() => ProjectOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectOrmEntity | null;

  @OneToMany(() => WorkOrderOrmEntity, (workOrder) => workOrder.serviceLine)
  workOrders?: WorkOrderOrmEntity[];

  @OneToMany(() => PlanFactEntryOrmEntity, (entry) => entry.serviceLine)
  planFactEntries?: PlanFactEntryOrmEntity[];
}
