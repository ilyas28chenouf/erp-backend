import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogOrmEntity } from '../../../audit/infrastructure/persistence/audit-log.orm-entity';
import { DocumentOrmEntity } from '../../../documents/infrastructure/persistence/document.orm-entity';
import { BudgetPlanOrmEntity } from '../../../finance/infrastructure/persistence/budget-plan.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../../../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { TaskOrmEntity } from '../../../tasks/infrastructure/persistence/task.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly usersRepository: Repository<UserOrmEntity>,
    @InjectRepository(ProjectOrmEntity)
    private readonly projectsRepository: Repository<ProjectOrmEntity>,
    @InjectRepository(TaskOrmEntity)
    private readonly tasksRepository: Repository<TaskOrmEntity>,
    @InjectRepository(DocumentOrmEntity)
    private readonly documentsRepository: Repository<DocumentOrmEntity>,
    @InjectRepository(PaymentRegistryEntryOrmEntity)
    private readonly paymentRegistryEntriesRepository: Repository<PaymentRegistryEntryOrmEntity>,
    @InjectRepository(BudgetPlanOrmEntity)
    private readonly budgetPlansRepository: Repository<BudgetPlanOrmEntity>,
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogsRepository: Repository<AuditLogOrmEntity>,
  ) {}

  async getOverview() {
    const [users, projects, tasks, documents, financeEntries, budgetPlans, auditLogs] =
      await Promise.all([
        this.usersRepository.count(),
        this.projectsRepository.count(),
        this.tasksRepository.count(),
        this.documentsRepository.count(),
        this.paymentRegistryEntriesRepository.count(),
        this.budgetPlansRepository.count(),
        this.auditLogsRepository.count(),
      ]);

    return {
      users,
      projects,
      tasks,
      documents,
      financeEntries,
      budgetPlans,
      auditLogs,
      generatedAt: new Date().toISOString(),
    };
  }

  async getProjectWorkload() {
    const projects = await this.projectsRepository.find({
      relations: { tasks: true, documents: true, members: true },
      order: { createdAt: 'DESC' },
    });

    return projects.map((project) => ({
      projectId: project.id,
      name: project.name,
      status: project.status,
      tasksCount: project.tasks?.length ?? 0,
      documentsCount: project.documents?.length ?? 0,
      membersCount: project.members?.length ?? 0,
    }));
  }
}
