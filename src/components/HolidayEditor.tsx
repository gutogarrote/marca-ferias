import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { isValidHolidayDate } from "../domain/holidays";
import type { Holiday, HolidayOverrides } from "../domain/types";

type Props = {
  year: number;
  holidays: Holiday[];
  overrides: HolidayOverrides;
  onChange: (overrides: HolidayOverrides) => void;
};

export function HolidayEditor({ year, holidays, overrides, onChange }: Props) {
  const [date, setDate] = useState(`${year}-12-24`);
  const [name, setName] = useState("Recesso da empresa");

  const addHoliday = () => {
    if (!isValidHolidayDate(date, year) || !name.trim()) return;
    onChange({
      ...overrides,
      added: [...overrides.added.filter((holiday) => holiday.date !== date), { date, name: name.trim(), scope: "personalizado" }],
      removedDates: overrides.removedDates.filter((removed) => removed !== date),
    });
  };

  const removeHoliday = (holiday: Holiday) => {
    if (holiday.scope === "personalizado") {
      onChange({ ...overrides, added: overrides.added.filter((item) => item.date !== holiday.date) });
      return;
    }
    onChange({ ...overrides, removedDates: Array.from(new Set([...overrides.removedDates, holiday.date])) });
  };

  return (
    <section className="bottom-panel holiday-editor">
      <div className="section-heading">
        <h2>Editar feriados</h2>
        <p>Inclua recessos, emendas ou remova dias que sua política não observa.</p>
      </div>
      <div className="holiday-form">
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do dia não útil" />
        <button type="button" onClick={addHoliday}>
          <Plus size={16} /> Adicionar
        </button>
      </div>
      <div className="holiday-list">
        {holidays.map((holiday) => (
          <span key={holiday.date}>
            <strong>{holiday.date}</strong> {holiday.name}
            <button type="button" title="Remover" onClick={() => removeHoliday(holiday)}>
              <Trash2 size={14} />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}
