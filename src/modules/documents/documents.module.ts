import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOCUMENTS_REPOSITORY } from './domain/interfaces/documents.repository.interface';
import { DocumentsService } from './application/services/documents.service';
import { DocumentFolderOrmEntity } from './infrastructure/persistence/document-folder.orm-entity';
import { DocumentOrmEntity } from './infrastructure/persistence/document.orm-entity';
import { DocumentVersionOrmEntity } from './infrastructure/persistence/document-version.orm-entity';
import { DocumentsRepository } from './infrastructure/repositories/documents.repository';
import { DocumentFoldersController } from './presentation/controllers/document-folders.controller';
import { DocumentsController } from './presentation/controllers/documents.controller';
import { DocumentVersionsController } from './presentation/controllers/document-versions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentFolderOrmEntity,
      DocumentOrmEntity,
      DocumentVersionOrmEntity,
    ]),
  ],
  controllers: [
    DocumentFoldersController,
    DocumentsController,
    DocumentVersionsController,
  ],
  providers: [
    DocumentsService,
    DocumentsRepository,
    { provide: DOCUMENTS_REPOSITORY, useExisting: DocumentsRepository },
  ],
  exports: [DocumentsService, TypeOrmModule],
})
export class DocumentsModule {}
