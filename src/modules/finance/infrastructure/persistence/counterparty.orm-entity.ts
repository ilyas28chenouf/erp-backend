import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { PaymentRegistryEntryOrmEntity } from './payment-registry-entry.orm-entity';

@Entity({ name: 'counterparties' })
export class CounterpartyOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 32, nullable: true })
  inn?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @OneToMany(() => PaymentRegistryEntryOrmEntity, (entry) => entry.counterparty)
  paymentRegistryEntries?: PaymentRegistryEntryOrmEntity[];
}
