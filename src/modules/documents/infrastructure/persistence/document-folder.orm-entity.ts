import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { DocumentFolderType } from '../../domain/enums/document-folder-type.enum';
import { DocumentOrmEntity } from './document.orm-entity';

@Entity({ name: 'document_folders' })
export class DocumentFolderOrmEntity extends BaseUuidEntity {
  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  parentFolderId?: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ enum: DocumentFolderType, enumName: 'DocumentFolderType' })
  @Column({ type: 'enum', enum: DocumentFolderType })
  type: DocumentFolderType;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.documentFolders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectOrmEntity | null;

  @ManyToOne(
    () => DocumentFolderOrmEntity,
    (documentFolder) => documentFolder.childFolders,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'parentFolderId' })
  parentFolder?: DocumentFolderOrmEntity | null;

  @OneToMany(
    () => DocumentFolderOrmEntity,
    (documentFolder) => documentFolder.parentFolder,
  )
  childFolders?: DocumentFolderOrmEntity[];

  @OneToMany(() => DocumentOrmEntity, (document) => document.folder)
  documents?: DocumentOrmEntity[];
}
