import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { AuditLogOrmEntity } from '../../../audit/infrastructure/persistence/audit-log.orm-entity';
import { DocumentOrmEntity } from '../../../documents/infrastructure/persistence/document.orm-entity';
import { DocumentVersionOrmEntity } from '../../../documents/infrastructure/persistence/document-version.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../../../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { ProjectMemberOrmEntity } from '../../../projects/infrastructure/persistence/project-member.orm-entity';
import { TaskOrmEntity } from '../../../tasks/infrastructure/persistence/task.orm-entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ProjectOrmEntity, (project) => project.responsibleUser)
  responsibleProjects?: ProjectOrmEntity[];

  @OneToMany(() => ProjectMemberOrmEntity, (projectMember) => projectMember.user)
  memberships?: ProjectMemberOrmEntity[];

  @OneToMany(
    () => PaymentRegistryEntryOrmEntity,
    (entry) => entry.createdByUser,
  )
  paymentRegistryEntries?: PaymentRegistryEntryOrmEntity[];

  @OneToMany(() => DocumentOrmEntity, (document) => document.createdByUser)
  createdDocuments?: DocumentOrmEntity[];

  @OneToMany(
    () => DocumentVersionOrmEntity,
    (documentVersion) => documentVersion.uploadedByUser,
  )
  uploadedDocumentVersions?: DocumentVersionOrmEntity[];

  @OneToMany(() => TaskOrmEntity, (task) => task.assigneeUser)
  assignedTasks?: TaskOrmEntity[];

  @OneToMany(() => TaskOrmEntity, (task) => task.createdByUser)
  createdTasks?: TaskOrmEntity[];

  @OneToMany(() => AuditLogOrmEntity, (auditLog) => auditLog.actorUser)
  auditLogs?: AuditLogOrmEntity[];
}
