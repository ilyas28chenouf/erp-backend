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
import { PaymentRegistryEntryType } from '../../domain/enums/payment-registry-entry-type.enum';
import { CounterpartyOrmEntity } from './counterparty.orm-entity';
import { FinanceCategoryOrmEntity } from './finance-category.orm-entity';

@Entity({ name: 'payment_registry_entries' })
export class PaymentRegistryEntryOrmEntity extends BaseUuidEntity {
  @ApiProperty({ enum: PaymentRegistryEntryType, enumName: 'PaymentRegistryEntryType' })
  @Column({ type: 'enum', enum: PaymentRegistryEntryType })
  type: PaymentRegistryEntryType;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  counterpartyId?: string | null;

  @ApiProperty({ example: '1000.00' })
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: string;

  @ApiProperty({ type: String, format: 'date' })
  @Column({ type: 'date' })
  operationDate: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  categoryId: string;

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

  @ManyToOne(
    () => FinanceCategoryOrmEntity,
    (category) => category.paymentRegistryEntries,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'categoryId' })
  category: FinanceCategoryOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.paymentRegistryEntries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser?: UserOrmEntity | null;
}
