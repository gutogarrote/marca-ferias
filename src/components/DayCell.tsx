import { fullDateLabel } from "../domain/date";
import type { CalendarDay, EditMode } from "../domain/types";

type Props = {
  day: CalendarDay;
  mode: EditMode;
  isVacation: boolean;
  isMonthlyLeave: boolean;
  isFreeLeave: boolean;
  isInBreak: boolean;
  isVacationStart: boolean;
  onClick: (date: string) => void;
};

export function DayCell({
  day,
  mode,
  isVacation,
  isMonthlyLeave,
  isFreeLeave,
  isInBreak,
  isVacationStart,
  onClick,
}: Props) {
  const state = isVacation
    ? "vacation"
    : isMonthlyLeave
      ? "monthly"
      : isFreeLeave
        ? "free"
        : day.isHoliday
          ? "holiday"
          : day.isWeekend
            ? "weekend"
            : "workday";
  const marker = isVacation ? "F" : isMonthlyLeave ? "M" : isFreeLeave ? "L" : day.isHoliday ? "H" : "";
  const title = [
    fullDateLabel(day.date),
    day.isHoliday ? day.holidayName : undefined,
    isVacation ? "Férias" : undefined,
    isMonthlyLeave ? "Folga mensal" : undefined,
    isFreeLeave ? "Folga livre" : undefined,
    isVacation ? "Conta no período oficial" : day.isEligibleWorkday ? "Dia útil elegível" : "Não é dia útil",
    `Modo atual: ${mode === "vacation" ? "Férias" : mode === "monthly" ? "Folga mensal" : "Folga livre"}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <button
      className={`day-cell ${state} ${isInBreak ? "in-break" : ""} ${isVacationStart ? "vacation-start" : ""} ${
        !day.isEligibleWorkday && mode !== "vacation" ? "invalid-target" : ""
      }`}
      type="button"
      title={title}
      onClick={() => onClick(day.date)}
    >
      <span className="day-number">{day.day}</span>
      {marker && <span className="day-marker">{marker}</span>}
    </button>
  );
}
