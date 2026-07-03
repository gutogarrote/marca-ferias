import { describe, expect, it } from "vitest";
import { buildCalendar, fillVacationDates } from "./calendar";
import { getBaseHolidays } from "./holidays";
import { createScenario, defaultConfig } from "./scenarios";
import { calculateTotals } from "./totals";

describe("calculateTotals", () => {
  it("extends the continuous break through weekends, holidays, and leaves", () => {
    const config = { ...defaultConfig(2026), vacationDays: 5, freePaidLeaves: 1 };
    const calendar = buildCalendar(config, getBaseHolidays(2026));
    const vacationDates = fillVacationDates("2026-10-09", 5, calendar);
    const scenario = {
      ...createScenario(config),
      vacationStartDate: "2026-10-09",
      vacationDates,
      monthlyLeaveDates: ["2026-10-08"],
      freeLeaveDates: ["2026-10-16"],
    };

    const totals = calculateTotals(scenario, calendar);

    expect(totals.totalBreakStart).toBe("2026-10-08");
    expect(totals.totalBreakEnd).toBe("2026-10-18");
    expect(totals.totalContinuousDaysAway).toBe(11);
    expect(totals.holidaysIncluded).toContain("2026-10-12 - Nossa Senhora Aparecida");
  });
});
