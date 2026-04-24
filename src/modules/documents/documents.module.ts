import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOCUMENTS_REPOSITORY } from './domain/interfaces/documents.repository.interface';
import { UsersModule } from '../users/users.module';
import { DocumentsService } from './application/services/documents.service';
import { DocumentFolderOrmEntity } from './infrastructure/persistence/document-folder.orm-entity';
import { DocumentVersionCommentOrmEntity } from './infrastructure/persistence/document-version-comment.orm-entity';
import { DocumentOrmEntity } from './infrastructure/persistence/document.orm-entity';
import { DocumentVersionOrmEntity } from './infrastructure/persistence/document-version.orm-entity';
import { DocumentsRepository } from './infrastructure/repositories/documents.repository';
import { DocumentFoldersController } from './presentation/controllers/document-folders.controller';
import { DocumentVersionCommentsController } from './presentation/controllers/document-version-comments.controller';
import { DocumentsController } from './presentation/controllers/documents.controller';
import { DocumentVersionsController } from './presentation/controllers/document-versions.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      DocumentFolderOrmEntity,
      DocumentOrmEntity,
      DocumentVersionOrmEntity,
      DocumentVersionCommentOrmEntity,
    ]),
  ],
  controllers: [
    DocumentFoldersController,
    DocumentVersionsController,
    DocumentVersionCommentsController,
    DocumentsController,
  ],
  providers: [
    DocumentsService,
    DocumentsRepository,
    { provide: DOCUMENTS_REPOSITORY, useExisting: DocumentsRepository },
  ],
  exports: [DocumentsService, TypeOrmModule],
})
export class DocumentsModule {}
