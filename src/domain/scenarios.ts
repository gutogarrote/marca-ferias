import { fillVacationDates } from "./calendar";
import { monthKey } from "./date";
import { createId } from "./id";
import type { CalendarDay, PlanningConfig, Scenario } from "./types";

export const defaultConfig = (year = new Date().getFullYear()): PlanningConfig => ({
  year,
  location: { country: "BR", state: "SP", city: "São Paulo" },
  vacationDays: 20,
  monthlyPaidLeaves: 1,
  freePaidLeaves: 2,
  carryMonthlyLeaves: false,
  weekendDays: [0, 6],
});

export function createScenario(config = defaultConfig(), name = "Cenário A"): Scenario {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name,
    config,
    vacationDates: [],
    monthlyLeaveDates: [],
    freeLeaveDates: [],
    holidayOverrides: { added: [], removedDates: [] },
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function refreshVacation(scenario: Scenario, calendar: CalendarDay[]): Scenario {
  return {
    ...scenario,
    vacationDates: fillVacationDates(scenario.vacationStartDate, scenario.config.vacationDays, calendar),
    updatedAt: new Date().toISOString(),
  };
}

export function validateMonthlyLeave(date: string, scenario: Scenario, calendar: CalendarDay[]) {
  const day = calendar.find((item) => item.date === date);
  if (!day?.isEligibleWorkday) return "Folgas mensais só podem ser aplicadas em dias úteis.";
  if (scenario.vacationDates.includes(date)) return "Não é possível marcar folga mensal durante as férias.";
  if (scenario.freeLeaveDates.includes(date)) return "Este dia já tem uma folga livre.";
  const usedInMonth = scenario.monthlyLeaveDates.filter((leave) => monthKey(leave) === monthKey(date)).length;
  if (!scenario.monthlyLeaveDates.includes(date) && usedInMonth >= scenario.config.monthlyPaidLeaves) {
    return "Limite de folgas mensais atingido para este mês.";
  }
  return undefined;
}

export function validateFreeLeave(date: string, scenario: Scenario, calendar: CalendarDay[]) {
  const day = calendar.find((item) => item.date === date);
  if (!day?.isEligibleWorkday) return "Folgas livres só podem ser aplicadas em dias úteis.";
  if (scenario.vacationDates.includes(date)) return "Não é possível marcar folga livre durante as férias.";
  if (scenario.monthlyLeaveDates.includes(date)) return "Este dia já tem uma folga mensal.";
  if (!scenario.freeLeaveDates.includes(date) && scenario.freeLeaveDates.length >= scenario.config.freePaidLeaves) {
    return "Você já usou todas as folgas livres.";
  }
  return undefined;
}
