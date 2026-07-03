import { Copy, Pencil } from "lucide-react";
import { dateLabel } from "../domain/date";
import type { Scenario, ScenarioTotals } from "../domain/types";

type Props = {
  scenario: Scenario;
  totals: ScenarioTotals;
  message?: string;
  onScenarioChange: (scenario: Scenario) => void;
  onDuplicate: () => void;
};

export function ScenarioPanel({ scenario, totals, message, onScenarioChange, onDuplicate }: Props) {
  return (
    <aside className="right-panel">
      <section className="scenario-title">
        <label>
          Nome do cenário
          <input
            value={scenario.name}
            onChange={(event) => onScenarioChange({ ...scenario, name: event.target.value, updatedAt: new Date().toISOString() })}
          />
        </label>
        <button type="button" onClick={onDuplicate}>
          <Copy size={16} /> Duplicar cenário
        </button>
      </section>

      {message && <div className="toast-message">{message}</div>}

      <section className="summary-card total">
        <span>Afastamento total</span>
        <strong>{totals.totalContinuousDaysAway} dias</strong>
        <p>
          {dateLabel(totals.totalBreakStart)} a {dateLabel(totals.totalBreakEnd)}
        </p>
      </section>

      <section className="summary-grid">
        <div>
          <span>Início das férias</span>
          <strong>{dateLabel(totals.officialVacationStart)}</strong>
        </div>
        <div>
          <span>Fim das férias</span>
          <strong>{dateLabel(totals.officialVacationEnd)}</strong>
        </div>
        <div>
          <span>Dias de férias</span>
          <strong>
            {totals.vacationDaysUsed} de {scenario.config.vacationDays}
          </strong>
        </div>
        <div>
          <span>Folgas livres</span>
          <strong>
            {totals.freeLeavesUsed} usadas, {totals.freeLeavesRemaining} restantes
          </strong>
        </div>
      </section>

      <section className="panel-section compact">
        <h2>Folgas mensais usadas</h2>
        <div className="month-tags">
          {Object.entries(totals.monthlyLeavesByMonth).length ? (
            Object.entries(totals.monthlyLeavesByMonth).map(([month, count]) => (
              <span key={month}>
                {month}: {count}
              </span>
            ))
          ) : (
            <p>Nenhuma folga mensal posicionada.</p>
          )}
        </div>
      </section>

      <section className="panel-section compact">
        <h2>Incluídos no afastamento</h2>
        <p>{totals.holidaysIncluded.length} feriado(s)</p>
        <p>{totals.weekendsIncluded.length} dia(s) de descanso</p>
        <details>
          <summary>Ver feriados</summary>
          <ul>
            {totals.holidaysIncluded.map((holiday) => (
              <li key={holiday}>{holiday}</li>
            ))}
          </ul>
        </details>
      </section>

      <section className="panel-section compact">
        <h2>Maior afastamento contínuo encontrado</h2>
        <p>
          <strong>{totals.longestContinuousDaysAway} dias</strong> entre {dateLabel(totals.longestBreakStart)} e{" "}
          {dateLabel(totals.longestBreakEnd)}
        </p>
      </section>

      {totals.warnings.length > 0 && (
        <section className="warnings">
          {totals.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </section>
      )}

      <section className="panel-section compact">
        <h2>
          <Pencil size={15} /> Observações
        </h2>
        <textarea
          value={scenario.notes ?? ""}
          onChange={(event) => onScenarioChange({ ...scenario, notes: event.target.value, updatedAt: new Date().toISOString() })}
          placeholder="Notas livres sobre esta opção"
        />
      </section>
    </aside>
  );
}
