import { CalendarDays, Eraser, Save } from "lucide-react";
import type { EditMode, PlanningConfig } from "../domain/types";

type Props = {
  config: PlanningConfig;
  mode: EditMode;
  onConfigChange: (config: PlanningConfig) => void;
  onModeChange: (mode: EditMode) => void;
  onSave: () => void;
  onClear: () => void;
};

export function ConfigPanel({ config, mode, onConfigChange, onModeChange, onSave, onClear }: Props) {
  const setNumber = (key: "year" | "vacationDays" | "monthlyPaidLeaves" | "freePaidLeaves", value: string) => {
    onConfigChange({ ...config, [key]: Math.max(0, Number(value)) });
  };
  const toggleWeekend = (weekday: number) => {
    const has = config.weekendDays.includes(weekday);
    onConfigChange({
      ...config,
      weekendDays: has ? config.weekendDays.filter((day) => day !== weekday) : [...config.weekendDays, weekday].sort(),
    });
  };

  return (
    <aside className="left-panel">
      <section className="panel-section">
        <h2>Configurações</h2>
        <label>
          Ano
          <input type="number" value={config.year} min="2020" max="2035" onChange={(event) => setNumber("year", event.target.value)} />
        </label>
        <label>
          Localidade
          <input type="text" value="São Paulo, SP" readOnly />
        </label>
        <label>
          Dias de férias
          <input type="number" value={config.vacationDays} min="0" onChange={(event) => setNumber("vacationDays", event.target.value)} />
        </label>
        <label>
          Folgas mensais
          <input
            type="number"
            value={config.monthlyPaidLeaves}
            min="0"
            onChange={(event) => setNumber("monthlyPaidLeaves", event.target.value)}
          />
        </label>
        <label>
          Folgas livres
          <input type="number" value={config.freePaidLeaves} min="0" onChange={(event) => setNumber("freePaidLeaves", event.target.value)} />
        </label>
        <div className="rule-pill">Férias oficiais contam dias corridos</div>
      </section>

      <section className="panel-section">
        <h2>Dias de descanso</h2>
        <div className="weekday-toggle">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((label, index) => (
            <button
              key={label}
              className={config.weekendDays.includes(index) ? "selected" : ""}
              type="button"
              onClick={() => toggleWeekend(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2>Modo de edição</h2>
        <div className="segmented">
          <button className={mode === "vacation" ? "active" : ""} type="button" onClick={() => onModeChange("vacation")}>
            Férias
          </button>
          <button className={mode === "monthly" ? "active" : ""} type="button" onClick={() => onModeChange("monthly")}>
            Folga mensal
          </button>
          <button className={mode === "free" ? "active" : ""} type="button" onClick={() => onModeChange("free")}>
            Folga livre
          </button>
        </div>
      </section>

      <section className="panel-section action-row">
        <button className="primary-action" type="button" onClick={onSave}>
          <Save size={16} /> Salvar cenário
        </button>
        <button type="button" onClick={onClear}>
          <Eraser size={16} /> Limpar
        </button>
        <span className="mini-note">
          <CalendarDays size={14} /> Clique no calendário para editar.
        </span>
      </section>
    </aside>
  );
}
