import { addDays } from "../domain/date";
import type { CalendarDay, EditMode, ScenarioTotals } from "../domain/types";
import { MonthGrid } from "./MonthGrid";

type Props = {
  calendar: CalendarDay[];
  mode: EditMode;
  vacationDates: string[];
  monthlyLeaveDates: string[];
  freeLeaveDates: string[];
  vacationStartDate?: string;
  totals: ScenarioTotals;
  onDayClick: (date: string) => void;
};

export function YearCalendar({
  calendar,
  mode,
  vacationDates,
  monthlyLeaveDates,
  freeLeaveDates,
  vacationStartDate,
  totals,
  onDayClick,
}: Props) {
  const vacationSet = new Set(vacationDates);
  const monthlySet = new Set(monthlyLeaveDates);
  const freeSet = new Set(freeLeaveDates);
  const breakDates = new Set<string>();
  if (totals.totalBreakStart && totals.totalBreakEnd) {
    for (let cursor = totals.totalBreakStart; cursor <= totals.totalBreakEnd; cursor = addDays(cursor, 1)) {
      breakDates.add(cursor);
    }
  }

  return (
    <main className="calendar-workspace">
      <div className="calendar-legend" aria-label="Legenda">
        <span><i className="legend-workday" /> Dia útil</span>
        <span><i className="legend-weekend" /> Descanso</span>
        <span><i className="legend-holiday" /> Feriado</span>
        <span><i className="legend-vacation" /> Férias</span>
        <span><i className="legend-monthly" /> Folga mensal</span>
        <span><i className="legend-free" /> Folga livre</span>
      </div>
      <div className="year-calendar">
        {Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          return (
            <MonthGrid
              key={month}
              month={month}
              days={calendar.filter((day) => day.month === month)}
              mode={mode}
              vacationDates={vacationSet}
              monthlyLeaveDates={monthlySet}
              freeLeaveDates={freeSet}
              breakDates={breakDates}
              vacationStartDate={vacationStartDate}
              onDayClick={onDayClick}
            />
          );
        })}
      </div>
    </main>
  );
}
