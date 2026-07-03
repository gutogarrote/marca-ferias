export type PlanningConfig = {
  year: number;
  location: {
    country: "BR";
    state: "SP";
    city: "São Paulo";
  };
  vacationDays: number;
  monthlyPaidLeaves: number;
  freePaidLeaves: number;
  carryMonthlyLeaves: false;
  weekendDays: number[];
};

export type Holiday = {
  date: string;
  name: string;
  scope: "nacional" | "estadual" | "municipal" | "personalizado";
};

export type HolidayOverrides = {
  added: Holiday[];
  removedDates: string[];
};

export type CalendarDay = {
  date: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isEligibleWorkday: boolean;
};

export type Scenario = {
  id: string;
  name: string;
  config: PlanningConfig;
  vacationStartDate?: string;
  vacationDates: string[];
  monthlyLeaveDates: string[];
  freeLeaveDates: string[];
  holidayOverrides?: HolidayOverrides;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ScenarioTotals = {
  officialVacationStart?: string;
  officialVacationEnd?: string;
  vacationDaysUsed: number;
  monthlyLeavesUsed: number;
  monthlyLeavesByMonth: Record<string, number>;
  freeLeavesUsed: number;
  freeLeavesRemaining: number;
  holidaysIncluded: string[];
  weekendsIncluded: string[];
  totalBreakStart?: string;
  totalBreakEnd?: string;
  totalContinuousDaysAway: number;
  longestBreakStart?: string;
  longestBreakEnd?: string;
  longestContinuousDaysAway: number;
  unusedMonthlyLeaves: Record<string, number>;
  warnings: string[];
};

export type EditMode = "vacation" | "monthly" | "free";

export type Suggestion = {
  date: string;
  vacationEnd?: string;
  totalBreakStart?: string;
  totalBreakEnd?: string;
  totalContinuousDaysAway: number;
};
