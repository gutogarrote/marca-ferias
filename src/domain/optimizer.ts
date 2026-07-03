import { fillVacationDates } from "./calendar";
import { calculateTotals } from "./totals";
import type { CalendarDay, Scenario, Suggestion } from "./types";

export function suggestVacationStarts(scenario: Scenario, calendar: CalendarDay[], limit = 8): Suggestion[] {
  return calendar
    .filter((day) => day.isEligibleWorkday)
    .map((day) => {
      const vacationDates = fillVacationDates(day.date, scenario.config.vacationDays, calendar);
      const simulated = { ...scenario, vacationStartDate: day.date, vacationDates };
      const totals = calculateTotals(simulated, calendar);
      return {
        date: day.date,
        vacationEnd: totals.officialVacationEnd,
        totalBreakStart: totals.totalBreakStart,
        totalBreakEnd: totals.totalBreakEnd,
        totalContinuousDaysAway: totals.totalContinuousDaysAway,
      };
    })
    .sort((a, b) => {
      const totalDiff = b.totalContinuousDaysAway - a.totalContinuousDaysAway;
      if (totalDiff !== 0) return totalDiff;
      return a.date.localeCompare(b.date);
    })
    .slice(0, limit);
}
