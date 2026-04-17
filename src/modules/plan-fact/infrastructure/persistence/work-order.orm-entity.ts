import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { PlanFactEntryOrmEntity } from './plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from './service-line.orm-entity';

@Entity({ name: 'work_orders' })
export class WorkOrderOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  serviceLineId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  number: string;

  @ApiProperty()
  @Column({ type: 'int' })
  year: number;

  @ApiProperty()
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  weekLabel?: string | null;

  @ManyToOne(() => ServiceLineOrmEntity, (serviceLine) => serviceLine.workOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceLineId' })
  serviceLine: ServiceLineOrmEntity;

  @OneToMany(() => PlanFactEntryOrmEntity, (entry) => entry.workOrder)
  planFactEntries?: PlanFactEntryOrmEntity[];
}
