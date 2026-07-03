import { addDays, iso, parseIso } from "./date";
import type { Holiday, HolidayOverrides } from "./types";

const fixedHolidays = [
  { month: 1, day: 1, name: "Confraternização Universal", scope: "nacional" },
  { month: 1, day: 25, name: "Aniversário de São Paulo", scope: "municipal" },
  { month: 4, day: 21, name: "Tiradentes", scope: "nacional" },
  { month: 5, day: 1, name: "Dia do Trabalho", scope: "nacional" },
  { month: 7, day: 9, name: "Revolução Constitucionalista", scope: "estadual" },
  { month: 9, day: 7, name: "Independência do Brasil", scope: "nacional" },
  { month: 10, day: 12, name: "Nossa Senhora Aparecida", scope: "nacional" },
  { month: 11, day: 2, name: "Finados", scope: "nacional" },
  { month: 11, day: 15, name: "Proclamação da República", scope: "nacional" },
  { month: 11, day: 20, name: "Consciência Negra", scope: "nacional" },
  { month: 12, day: 25, name: "Natal", scope: "nacional" },
] as const;

function easterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return iso(new Date(year, month - 1, day));
}

export function getBaseHolidays(year: number): Holiday[] {
  const easter = easterDate(year);
  const movable: Holiday[] = [
    { date: addDays(easter, -48), name: "Carnaval", scope: "nacional" },
    { date: addDays(easter, -47), name: "Carnaval", scope: "nacional" },
    { date: addDays(easter, -2), name: "Sexta-feira Santa", scope: "nacional" },
    { date: addDays(easter, 60), name: "Corpus Christi", scope: "municipal" },
  ];

  return [
    ...fixedHolidays.map((holiday) => ({
      date: iso(new Date(year, holiday.month - 1, holiday.day)),
      name: holiday.name,
      scope: holiday.scope,
    })),
    ...movable,
  ].sort((a, b) => a.date.localeCompare(b.date)) as Holiday[];
}

export function applyHolidayOverrides(base: Holiday[], overrides?: HolidayOverrides) {
  const removed = new Set(overrides?.removedDates ?? []);
  const merged = [...base.filter((holiday) => !removed.has(holiday.date)), ...(overrides?.added ?? [])];
  return Array.from(new Map(merged.map((holiday) => [holiday.date, holiday])).values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function isValidHolidayDate(date: string, year: number) {
  const parsed = parseIso(date);
  return !Number.isNaN(parsed.getTime()) && parsed.getFullYear() === year;
}
