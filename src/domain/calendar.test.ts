import { describe, expect, it } from "vitest";
import { buildCalendar, fillVacationDates } from "./calendar";
import { getBaseHolidays } from "./holidays";
import { defaultConfig } from "./scenarios";

describe("fillVacationDates", () => {
  it("counts consecutive calendar days including weekends and holidays", () => {
    const config = { ...defaultConfig(2026), vacationDays: 5 };
    const calendar = buildCalendar(config, getBaseHolidays(2026));

    expect(fillVacationDates("2026-10-09", 5, calendar)).toEqual([
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
    ]);
  });

  it("rejects starts on weekends", () => {
    const config = defaultConfig(2026);
    const calendar = buildCalendar(config, getBaseHolidays(2026));

    expect(fillVacationDates("2026-10-10", 5, calendar)).toEqual([]);
  });
});
