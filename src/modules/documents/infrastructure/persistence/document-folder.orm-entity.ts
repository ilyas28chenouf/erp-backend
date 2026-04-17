import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { DocumentFolderType } from '../../domain/enums/document-folder-type.enum';
import { DocumentOrmEntity } from './document.orm-entity';

@Entity({ name: 'document_folders' })
export class DocumentFolderOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ enum: DocumentFolderType, enumName: 'DocumentFolderType' })
  @Column({ type: 'enum', enum: DocumentFolderType })
  type: DocumentFolderType;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.documentFolders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: ProjectOrmEntity;

  @OneToMany(() => DocumentOrmEntity, (document) => document.folder)
  documents?: DocumentOrmEntity[];
}
