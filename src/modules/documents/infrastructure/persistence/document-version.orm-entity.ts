import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CreatedAtOnlyEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DocumentOrmEntity } from './document.orm-entity';

@Entity({ name: 'document_versions' })
export class DocumentVersionOrmEntity extends CreatedAtOnlyEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  documentId: string;

  @ApiProperty()
  @Column({ type: 'int' })
  versionNumber: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  mimeType: string;

  @ApiProperty()
  @Column({ type: 'int' })
  sizeBytes: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  uploadedByUserId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ManyToOne(() => DocumentOrmEntity, (document) => document.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'documentId' })
  document: DocumentOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.uploadedDocumentVersions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedByUser?: UserOrmEntity | null;
}
