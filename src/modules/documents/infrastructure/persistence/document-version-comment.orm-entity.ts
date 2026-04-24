import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DocumentVersionOrmEntity } from './document-version.orm-entity';

@Entity({ name: 'document_version_comments' })
export class DocumentVersionCommentOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  documentVersionId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  authorUserId: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(
    () => DocumentVersionOrmEntity,
    (documentVersion) => documentVersion.comments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'documentVersionId' })
  documentVersion: DocumentVersionOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.documentVersionComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorUserId' })
  authorUser: UserOrmEntity;
}
