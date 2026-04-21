import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { CounterpartyOrmEntity } from './counterparty.orm-entity';
import { FinanceSubcategoryOrmEntity } from './finance-subcategory.orm-entity';

@Entity({ name: 'payment_registry_entries' })
export class PaymentRegistryEntryOrmEntity extends BaseUuidEntity {
  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  counterpartyId?: string | null;

  @ApiProperty({ example: '349000.00' })
  @Column({ type: 'uuid' })
  subcategoryId: string;

  @ApiProperty({ example: '349000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  planAmount: string;

  @ApiProperty({ example: '349000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  factAmount: string;

  @ApiProperty({ example: 2026 })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ example: 'с 26.01.2026 по 01.02.2026' })
  @Column({ type: 'varchar', length: 255 })
  weekLabel: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.paymentRegistryEntries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectOrmEntity | null;

  @ManyToOne(
    () => CounterpartyOrmEntity,
    (counterparty) => counterparty.paymentRegistryEntries,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'counterpartyId' })
  counterparty?: CounterpartyOrmEntity | null;

  @ManyToOne(() => FinanceSubcategoryOrmEntity, (subcategory) => subcategory.paymentRegistryEntries, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: FinanceSubcategoryOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.paymentRegistryEntries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser?: UserOrmEntity | null;
}
