import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { FinanceCategoryType } from '../../domain/enums/finance-category-type.enum';
import { FinanceCategoryOrmEntity } from './finance-category.orm-entity';
import { PaymentRegistryEntryOrmEntity } from './payment-registry-entry.orm-entity';

@Entity({ name: 'finance_subcategories' })
export class FinanceSubcategoryOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  categoryId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ enum: FinanceCategoryType, enumName: 'FinanceCategoryType' })
  @Column({ type: 'enum', enum: FinanceCategoryType })
  type: FinanceCategoryType;

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => FinanceCategoryOrmEntity, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: FinanceCategoryOrmEntity;

  @OneToMany(() => PaymentRegistryEntryOrmEntity, (entry) => entry.subcategory)
  paymentRegistryEntries?: PaymentRegistryEntryOrmEntity[];
}
