import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { DocumentFolderOrmEntity } from './document-folder.orm-entity';
import { DocumentVersionOrmEntity } from './document-version.orm-entity';

@Entity({ name: 'documents' })
export class DocumentOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  folderId?: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ enum: DocumentType, enumName: 'DocumentType' })
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({ default: 1 })
  @Column({ type: 'int', default: 1 })
  currentVersionNumber: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: ProjectOrmEntity;

  @ManyToOne(() => DocumentFolderOrmEntity, (folder) => folder.documents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'folderId' })
  folder?: DocumentFolderOrmEntity | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.createdDocuments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser?: UserOrmEntity | null;

  @OneToMany(() => DocumentVersionOrmEntity, (version) => version.document)
  versions?: DocumentVersionOrmEntity[];
}
