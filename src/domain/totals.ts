import { addDays, countInclusiveDays, monthKey } from "./date";
import type { CalendarDay, Scenario, ScenarioTotals } from "./types";

function groupSequences(dates: Set<string>) {
  const sorted = Array.from(dates).sort();
  const sequences: Array<{ start: string; end: string; dates: string[] }> = [];
  let current: string[] = [];

  for (const date of sorted) {
    const previous = current[current.length - 1];
    if (!previous || addDays(previous, 1) === date) {
      current.push(date);
    } else {
      sequences.push({ start: current[0], end: current[current.length - 1], dates: current });
      current = [date];
    }
  }
  if (current.length) sequences.push({ start: current[0], end: current[current.length - 1], dates: current });
  return sequences;
}

export function calculateTotals(scenario: Scenario, calendar: CalendarDay[]): ScenarioTotals {
  const vacationSet = new Set(scenario.vacationDates);
  const monthlySet = new Set(scenario.monthlyLeaveDates);
  const freeSet = new Set(scenario.freeLeaveDates);
  const daysAway = new Set<string>();
  const warnings: string[] = [];

  for (const day of calendar) {
    if (day.isWeekend || day.isHoliday || vacationSet.has(day.date) || monthlySet.has(day.date) || freeSet.has(day.date)) {
      daysAway.add(day.date);
    }
  }

  if (scenario.vacationStartDate && scenario.vacationDates.length < scenario.config.vacationDays) {
    warnings.push("As férias não completaram todos os dias corridos configurados no calendário carregado.");
  }
  if (scenario.vacationDates.some((date) => !date.startsWith(String(scenario.config.year)))) {
    warnings.push("O período de férias atravessa o ano selecionado.");
  }

  const monthlyLeavesByMonth = scenario.monthlyLeaveDates.reduce<Record<string, number>>((acc, date) => {
    const key = monthKey(date);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const unusedMonthlyLeaves: Record<string, number> = {};
  for (let month = 1; month <= 12; month += 1) {
    const key = `${scenario.config.year}-${String(month).padStart(2, "0")}`;
    unusedMonthlyLeaves[key] = Math.max(0, scenario.config.monthlyPaidLeaves - (monthlyLeavesByMonth[key] ?? 0));
  }

  const sequences = groupSequences(daysAway);
  const byLongest = [...sequences].sort((a, b) => countInclusiveDays(b.start, b.end) - countInclusiveDays(a.start, a.end));
  const mainSequence =
    scenario.vacationDates.length > 0
      ? sequences.find((sequence) => sequence.dates.some((date) => vacationSet.has(date)))
      : byLongest[0];
  const longest = byLongest[0];

  const mainDates = new Set(mainSequence?.dates ?? []);
  const holidaysIncluded = calendar
    .filter((day) => mainDates.has(day.date) && day.isHoliday)
    .map((day) => `${day.date} - ${day.holidayName}`);
  const weekendsIncluded = calendar.filter((day) => mainDates.has(day.date) && day.isWeekend).map((day) => day.date);

  return {
    officialVacationStart: scenario.vacationDates[0],
    officialVacationEnd: scenario.vacationDates.at(-1),
    vacationDaysUsed: scenario.vacationDates.length,
    monthlyLeavesUsed: scenario.monthlyLeaveDates.length,
    monthlyLeavesByMonth,
    freeLeavesUsed: scenario.freeLeaveDates.length,
    freeLeavesRemaining: Math.max(0, scenario.config.freePaidLeaves - scenario.freeLeaveDates.length),
    holidaysIncluded,
    weekendsIncluded,
    totalBreakStart: mainSequence?.start,
    totalBreakEnd: mainSequence?.end,
    totalContinuousDaysAway: countInclusiveDays(mainSequence?.start, mainSequence?.end),
    longestBreakStart: longest?.start,
    longestBreakEnd: longest?.end,
    longestContinuousDaysAway: countInclusiveDays(longest?.start, longest?.end),
    unusedMonthlyLeaves,
    warnings,
  };
}
