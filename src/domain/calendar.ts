import { iso } from "./date";
import type { CalendarDay, Holiday, PlanningConfig } from "./types";

export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const weekdayShort = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function buildCalendar(config: PlanningConfig, holidays: Holiday[]): CalendarDay[] {
  const holidayByDate = new Map(holidays.map((holiday) => [holiday.date, holiday]));
  const days: CalendarDay[] = [];

  for (let month = 0; month < 12; month += 1) {
    const date = new Date(config.year, month, 1);
    while (date.getMonth() === month) {
      const dateIso = iso(date);
      const weekday = date.getDay();
      const holiday = holidayByDate.get(dateIso);
      const isWeekend = config.weekendDays.includes(weekday);
      days.push({
        date: dateIso,
        year: config.year,
        month: month + 1,
        day: date.getDate(),
        weekday,
        isWeekend,
        isHoliday: Boolean(holiday),
        holidayName: holiday?.name,
        isEligibleWorkday: !isWeekend && !holiday,
      });
      date.setDate(date.getDate() + 1);
    }
  }

  return days;
}

export function calendarByDate(days: CalendarDay[]) {
  return new Map(days.map((day) => [day.date, day]));
}

export function fillVacationDates(startDate: string | undefined, vacationDays: number, calendar: CalendarDay[]) {
  if (!startDate || vacationDays <= 0) return [];
  const byDate = calendarByDate(calendar);
  const start = byDate.get(startDate);
  if (!start?.isEligibleWorkday) return [];

  const dates: string[] = [];
  let pointer = new Date(start.year, start.month - 1, start.day);
  let guard = 0;
  while (dates.length < vacationDays && guard < 430) {
    const current = iso(pointer);
    const day = byDate.get(current);
    if (day) dates.push(current);
    pointer.setDate(pointer.getDate() + 1);
    guard += 1;
  }
  return dates;
}
