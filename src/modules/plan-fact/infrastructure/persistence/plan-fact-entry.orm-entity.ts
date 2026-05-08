import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { DocumentOrmEntity } from '../../../documents/infrastructure/persistence/document.orm-entity';
import { ServiceLineOrmEntity } from './service-line.orm-entity';
import { WorkOrderOrmEntity } from './work-order.orm-entity';

@Entity({ name: 'plan_fact_entries' })
export class PlanFactEntryOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  serviceLineId: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  documentId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  documentActId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  documentNaradId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  documentOtherId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  workOrderId?: string | null;

  @ApiProperty()
  @Column({ type: 'int' })
  year: number;

  @ApiProperty()
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  weekLabel?: string | null;

  @ApiProperty({ example: '0.00', default: '0.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  naradPlan: string;

  @ApiProperty({ example: '0.00', default: '0.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  naradFact: string;

  @ApiProperty({ example: '0.00', default: '0.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  advancePlan: string;

  @ApiProperty({ example: '0.00', default: '0.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  advanceFact: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ManyToOne(() => ServiceLineOrmEntity, (serviceLine) => serviceLine.planFactEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceLineId' })
  serviceLine: ServiceLineOrmEntity;

  @ManyToOne(() => DocumentOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'documentId' })
  document?: DocumentOrmEntity | null;

  @ManyToOne(() => DocumentOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'documentActId' })
  documentAct?: DocumentOrmEntity | null;

  @ManyToOne(() => DocumentOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'documentNaradId' })
  documentNarad?: DocumentOrmEntity | null;

  @ManyToOne(() => DocumentOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'documentOtherId' })
  documentOther?: DocumentOrmEntity | null;

  @ManyToOne(() => WorkOrderOrmEntity, (workOrder) => workOrder.planFactEntries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'workOrderId' })
  workOrder?: WorkOrderOrmEntity | null;
}
