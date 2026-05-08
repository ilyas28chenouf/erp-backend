export interface PlanFactReportWeekRow {
  id: string;
  weekLabel: string;
  naradPlan: string;
  naradFact: string;
  advancePlan: string;
  advanceFact: string;
  comment: string | null;
  documentTitle: string | null;
}

export interface PlanFactReportMonthSection {
  year: number;
  month: number;
  label: string;
  weeks: PlanFactReportWeekRow[];
  totals: {
    naradPlan: string;
    naradFact: string;
    advancePlan: string;
    advanceFact: string;
  };
}

export interface PlanFactReportModel {
  serviceLineId: string;
  serviceLineTitle: string;
  customerName: string | null;
  projectName: string | null;
  generatedAt: string;
  months: PlanFactReportMonthSection[];
  overallTotals: {
    naradPlan: string;
    naradFact: string;
    advancePlan: string;
    advanceFact: string;
  };
}
