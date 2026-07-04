import { monthNames, weekdayShort } from "../domain/calendar";
import type { CalendarDay, EditMode } from "../domain/types";
import { DayCell } from "./DayCell";

type Props = {
  month: number;
  days: CalendarDay[];
  mode: EditMode;
  vacationDates: Set<string>;
  monthlyLeaveDates: Set<string>;
  freeLeaveDates: Set<string>;
  breakDates: Set<string>;
  vacationStartDate?: string;
  onDayClick: (date: string) => void;
};

export function MonthGrid({
  month,
  days,
  mode,
  vacationDates,
  monthlyLeaveDates,
  freeLeaveDates,
  breakDates,
  vacationStartDate,
  onDayClick,
}: Props) {
  const firstWeekday = days[0] ? (days[0].weekday + 6) % 7 : 0;
  return (
    <section className="month-grid" aria-label={monthNames[month - 1]}>
      <header>{monthNames[month - 1]}</header>
      <div className="weekdays">
        {weekdayShort.map((weekday, index) => (
          <span key={`${weekday}-${index}`}>{weekday}</span>
        ))}
      </div>
      <div className="days-grid">
        {Array.from({ length: firstWeekday }).map((_, index) => (
          <span className="day-spacer" key={index} />
        ))}
        {days.map((day) => (
          <DayCell
            key={day.date}
            day={day}
            mode={mode}
            isVacation={vacationDates.has(day.date)}
            isMonthlyLeave={monthlyLeaveDates.has(day.date)}
            isFreeLeave={freeLeaveDates.has(day.date)}
            isInBreak={breakDates.has(day.date)}
            isVacationStart={vacationStartDate === day.date}
            onClick={onDayClick}
          />
        ))}
      </div>
    </section>
  );
}
