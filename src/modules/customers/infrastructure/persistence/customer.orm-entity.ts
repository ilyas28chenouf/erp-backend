import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ServiceLineOrmEntity } from '../../../plan-fact/infrastructure/persistence/service-line.orm-entity';

@Entity({ name: 'customers' })
export class CustomerOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  contractNumber?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @OneToMany(() => ServiceLineOrmEntity, (serviceLine) => serviceLine.customer)
  serviceLines?: ServiceLineOrmEntity[];
}
