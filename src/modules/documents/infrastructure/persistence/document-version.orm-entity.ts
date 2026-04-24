import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CreatedAtOnlyEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DocumentVersionCommentOrmEntity } from './document-version-comment.orm-entity';
import { DocumentOrmEntity } from './document.orm-entity';

@Entity({ name: 'document_versions' })
export class DocumentVersionOrmEntity extends CreatedAtOnlyEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  documentId: string;

  @ApiProperty()
  @Column({ type: 'int' })
  versionNumber: number;

  @ApiProperty({ example: 'contract-v2.pdf' })
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @ApiProperty({ example: '/documents/contracts/contract-v2.pdf' })
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

  @ApiProperty({
    nullable: true,
    example: 'Updated after customer corrections',
  })
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

  @OneToMany(
    () => DocumentVersionCommentOrmEntity,
    (documentVersionComment) => documentVersionComment.documentVersion,
  )
  comments?: DocumentVersionCommentOrmEntity[];
}
