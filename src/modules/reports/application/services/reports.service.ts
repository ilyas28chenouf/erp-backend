import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ExcelJS from 'exceljs';
import { Repository } from 'typeorm';
import { AuditLogOrmEntity } from '../../../audit/infrastructure/persistence/audit-log.orm-entity';
import { DocumentOrmEntity } from '../../../documents/infrastructure/persistence/document.orm-entity';
import { BudgetPlanOrmEntity } from '../../../finance/infrastructure/persistence/budget-plan.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../../../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { PlanFactEntryOrmEntity } from '../../../plan-fact/infrastructure/persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from '../../../plan-fact/infrastructure/persistence/service-line.orm-entity';
import { ProjectOrmEntity } from '../../../projects/infrastructure/persistence/project.orm-entity';
import { TaskOrmEntity } from '../../../tasks/infrastructure/persistence/task.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import {
  PlanFactReportModel,
  PlanFactReportMonthSection,
  PlanFactReportWeekRow,
} from '../models/plan-fact-report.model';

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
    @InjectRepository(ServiceLineOrmEntity)
    private readonly serviceLinesRepository: Repository<ServiceLineOrmEntity>,
    @InjectRepository(PlanFactEntryOrmEntity)
    private readonly planFactEntriesRepository: Repository<PlanFactEntryOrmEntity>,
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

  async buildPlanFactServiceLineReport(
    serviceLineId: string,
  ): Promise<PlanFactReportModel> {
    const serviceLine = await this.serviceLinesRepository.findOne({
      where: { id: serviceLineId },
      relations: { customer: true, project: true },
    });

    if (!serviceLine) {
      throw new NotFoundException(
        `Service line with id "${serviceLineId}" was not found.`,
      );
    }

    const entries = await this.planFactEntriesRepository.find({
      where: { serviceLineId },
      relations: {
        document: true,
        documentAct: true,
        documentNarad: true,
        documentOther: true,
      },
      order: {
        year: 'ASC',
        month: 'ASC',
        createdAt: 'ASC',
      },
    });

    const monthMap = new Map<string, PlanFactReportMonthSection>();
    let overallNaradPlan = 0;
    let overallNaradFact = 0;
    let overallAdvancePlan = 0;
    let overallAdvanceFact = 0;

    const sortedEntries = [...entries].sort((left, right) => {
      if (left.year !== right.year) {
        return left.year - right.year;
      }
      if (left.month !== right.month) {
        return left.month - right.month;
      }

      const leftWeekSort = this.getWeekSortValue(left.weekLabel);
      const rightWeekSort = this.getWeekSortValue(right.weekLabel);

      if (leftWeekSort !== rightWeekSort) {
        return leftWeekSort - rightWeekSort;
      }

      return left.createdAt.getTime() - right.createdAt.getTime();
    });

    for (const entry of sortedEntries) {
      const monthKey = `${entry.year}-${String(entry.month).padStart(2, '0')}`;
      const monthSection =
        monthMap.get(monthKey) ??
        {
          year: entry.year,
          month: entry.month,
          label: this.formatMonthLabel(entry.year, entry.month),
          weeks: [],
          totals: {
            naradPlan: '0.00',
            naradFact: '0.00',
            advancePlan: '0.00',
            advanceFact: '0.00',
          },
        };

      const row: PlanFactReportWeekRow = {
        id: entry.id,
        weekLabel: entry.weekLabel ?? `Неделя ${monthSection.weeks.length + 1}`,
        naradPlan: this.formatDecimal(entry.naradPlan),
        naradFact: this.formatDecimal(entry.naradFact),
        advancePlan: this.formatDecimal(entry.advancePlan),
        advanceFact: this.formatDecimal(entry.advanceFact),
        comment: entry.comment ?? null,
        documentTitle: this.getCombinedDocumentTitles(entry),
      };

      monthSection.weeks.push(row);
      monthSection.totals.naradPlan = this.sumDecimalStrings(
        monthSection.totals.naradPlan,
        row.naradPlan,
      );
      monthSection.totals.naradFact = this.sumDecimalStrings(
        monthSection.totals.naradFact,
        row.naradFact,
      );
      monthSection.totals.advancePlan = this.sumDecimalStrings(
        monthSection.totals.advancePlan,
        row.advancePlan,
      );
      monthSection.totals.advanceFact = this.sumDecimalStrings(
        monthSection.totals.advanceFact,
        row.advanceFact,
      );

      overallNaradPlan += this.toMinorUnits(row.naradPlan);
      overallNaradFact += this.toMinorUnits(row.naradFact);
      overallAdvancePlan += this.toMinorUnits(row.advancePlan);
      overallAdvanceFact += this.toMinorUnits(row.advanceFact);

      monthMap.set(monthKey, monthSection);
    }

    return {
      serviceLineId: serviceLine.id,
      serviceLineTitle: serviceLine.title,
      customerName: serviceLine.customer?.name ?? null,
      projectName: serviceLine.project?.name ?? null,
      generatedAt: new Date().toISOString(),
      months: Array.from(monthMap.values()),
      overallTotals: {
        naradPlan: this.fromMinorUnits(overallNaradPlan),
        naradFact: this.fromMinorUnits(overallNaradFact),
        advancePlan: this.fromMinorUnits(overallAdvancePlan),
        advanceFact: this.fromMinorUnits(overallAdvanceFact),
      },
    };
  }

  async exportPlanFactServiceLineExcel(serviceLineId: string) {
    const report = await this.buildPlanFactServiceLineReport(serviceLineId);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ERP Backend';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Plan Fact');
    worksheet.columns = [
      { header: 'Week', key: 'week', width: 28 },
      { header: 'Narad plan', key: 'naradPlan', width: 16 },
      { header: 'Narad fact', key: 'naradFact', width: 16 },
      { header: 'Advance plan', key: 'advancePlan', width: 16 },
      { header: 'Advance fact', key: 'advanceFact', width: 16 },
      { header: 'Documents', key: 'documents', width: 36 },
      { header: 'Comment', key: 'comment', width: 48 },
    ];

    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = 'Monthly Weekly Plan/Fact Table';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.getCell('A3').value = 'Customer';
    worksheet.getCell('B3').value = report.customerName ?? '-';
    worksheet.getCell('A4').value = 'Service line';
    worksheet.getCell('B4').value = report.serviceLineTitle;
    worksheet.getCell('A5').value = 'Project';
    worksheet.getCell('B5').value = report.projectName ?? '-';
    worksheet.getCell('A6').value = 'Generated at';
    worksheet.getCell('B6').value = report.generatedAt;

    for (const cellAddress of ['A3', 'A4', 'A5', 'A6']) {
      worksheet.getCell(cellAddress).font = { bold: true };
    }

    let currentRowIndex = 8;

    for (const monthSection of report.months) {
      worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
      const monthCell = worksheet.getCell(`A${currentRowIndex}`);
      monthCell.value = monthSection.label;
      monthCell.font = { bold: true, size: 13 };
      monthCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9EAF7' },
      };
      currentRowIndex += 1;

      const headerRow = worksheet.getRow(currentRowIndex);
      headerRow.values = [
        'Week',
        'Narad plan',
        'Narad fact',
        'Advance plan',
        'Advance fact',
        'Documents',
        'Comment',
      ];
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' },
      };
      currentRowIndex += 1;

      for (const weekRow of monthSection.weeks) {
        worksheet.addRow([
          weekRow.weekLabel,
          this.toExcelNumber(weekRow.naradPlan),
          this.toExcelNumber(weekRow.naradFact),
          this.toExcelNumber(weekRow.advancePlan),
          this.toExcelNumber(weekRow.advanceFact),
          weekRow.documentTitle ?? '',
          weekRow.comment ?? '',
        ]);
        currentRowIndex += 1;
      }

      const totalsRow = worksheet.getRow(currentRowIndex);
      totalsRow.values = [
        `Totals for ${monthSection.label}`,
        this.toExcelNumber(monthSection.totals.naradPlan),
        this.toExcelNumber(monthSection.totals.naradFact),
        this.toExcelNumber(monthSection.totals.advancePlan),
        this.toExcelNumber(monthSection.totals.advanceFact),
        '',
        '',
      ];
      totalsRow.font = { bold: true };
      totalsRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF2CC' },
      };
      currentRowIndex += 2;
    }

    worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
    worksheet.getCell(`A${currentRowIndex}`).value = 'Overall Totals';
    worksheet.getCell(`A${currentRowIndex}`).font = { bold: true, size: 13 };
    worksheet.getCell(`A${currentRowIndex}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9EAD3' },
    };
    currentRowIndex += 1;

    const overallHeaderRow = worksheet.getRow(currentRowIndex);
    overallHeaderRow.values = [
      'Narad plan',
      'Narad fact',
      'Advance plan',
      'Advance fact',
    ];
    overallHeaderRow.font = { bold: true };
    currentRowIndex += 1;

    worksheet.getRow(currentRowIndex).values = [
      this.toExcelNumber(report.overallTotals.naradPlan),
      this.toExcelNumber(report.overallTotals.naradFact),
      this.toExcelNumber(report.overallTotals.advancePlan),
      this.toExcelNumber(report.overallTotals.advanceFact),
    ];

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, columnNumber) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        };

        if (rowNumber >= 9 && rowNumber <= worksheet.rowCount && columnNumber >= 2 && columnNumber <= 5) {
          cell.numFmt = '#,##0.00';
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      filename: `plan-fact-${this.slugify(report.customerName ?? 'service-line')}-${this.slugify(report.serviceLineTitle)}.xlsx`,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from(buffer),
      report,
    };
  }

  async exportPlanFactServiceLinePdf(_serviceLineId: string) {
    return null;
  }

  private getCombinedDocumentTitles(entry: PlanFactEntryOrmEntity) {
    const titles = [
      entry.document?.title,
      entry.documentAct?.title,
      entry.documentNarad?.title,
      entry.documentOther?.title,
    ].filter((title): title is string => Boolean(title));

    if (titles.length === 0) {
      return null;
    }

    return Array.from(new Set(titles)).join(', ');
  }

  private formatMonthLabel(year: number, month: number) {
    const date = new Date(Date.UTC(year, month - 1, 1));

    return date.toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  private getWeekSortValue(weekLabel?: string | null) {
    if (!weekLabel) {
      return Number.MAX_SAFE_INTEGER;
    }

    const match = weekLabel.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }

    const [, day, month, year] = match;
    return Number(`${year}${month}${day}`);
  }

  private sumDecimalStrings(left: string, right: string) {
    return this.fromMinorUnits(
      this.toMinorUnits(left) + this.toMinorUnits(right),
    );
  }

  private formatDecimal(value?: string | null) {
    return this.fromMinorUnits(this.toMinorUnits(value ?? '0'));
  }

  private toMinorUnits(value: string) {
    const normalized = value.replace(',', '.').trim();
    const negative = normalized.startsWith('-');
    const [wholePartRaw, fractionPartRaw = ''] = normalized.replace('-', '').split('.');
    const wholePart = Number.parseInt(wholePartRaw || '0', 10);
    const fractionPart = Number.parseInt(
      `${fractionPartRaw}00`.slice(0, 2),
      10,
    );
    const result = wholePart * 100 + fractionPart;

    return negative ? -result : result;
  }

  private fromMinorUnits(value: number) {
    const sign = value < 0 ? '-' : '';
    const absoluteValue = Math.abs(value);
    const wholePart = Math.floor(absoluteValue / 100);
    const fractionPart = absoluteValue % 100;

    return `${sign}${wholePart}.${String(fractionPart).padStart(2, '0')}`;
  }

  private toExcelNumber(value: string) {
    return Number.parseFloat(this.formatDecimal(value));
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'report';
  }
}
