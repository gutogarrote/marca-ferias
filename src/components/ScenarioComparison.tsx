import { Copy, Play, Trash2 } from "lucide-react";
import { dateLabel } from "../domain/date";
import type { Scenario, ScenarioTotals } from "../domain/types";

type SavedScenario = {
  scenario: Scenario;
  totals: ScenarioTotals;
};

type Props = {
  saved: SavedScenario[];
  onLoad: (scenario: Scenario) => void;
  onDuplicate: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
};

export function ScenarioComparison({ saved, onLoad, onDuplicate, onDelete }: Props) {
  return (
    <section className="bottom-panel comparison-panel">
      <div className="section-heading">
        <h2>Comparar cenários</h2>
        <p>Ordenado por maior afastamento total e, em empate, por menor uso de folgas extras.</p>
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Início das férias</th>
              <th>Fim das férias</th>
              <th>Afastamento total</th>
              <th>Dias fora</th>
              <th>Férias</th>
              <th>Mensais</th>
              <th>Livres</th>
              <th>Feriados</th>
              <th>Descanso</th>
              <th>Observações</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {saved.length === 0 ? (
              <tr>
                <td colSpan={12}>Salve um cenário para começar a comparação.</td>
              </tr>
            ) : (
              saved.map(({ scenario, totals }) => (
                <tr key={scenario.id}>
                  <td>{scenario.name}</td>
                  <td>{dateLabel(totals.officialVacationStart)}</td>
                  <td>{dateLabel(totals.officialVacationEnd)}</td>
                  <td>
                    {dateLabel(totals.totalBreakStart)} a {dateLabel(totals.totalBreakEnd)}
                  </td>
                  <td><strong>{totals.totalContinuousDaysAway}</strong></td>
                  <td>{totals.vacationDaysUsed}</td>
                  <td>{totals.monthlyLeavesUsed}</td>
                  <td>{totals.freeLeavesUsed}</td>
                  <td>{totals.holidaysIncluded.length}</td>
                  <td>{totals.weekendsIncluded.length}</td>
                  <td>{scenario.notes}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" title="Tornar atual" onClick={() => onLoad(scenario)}><Play size={14} /></button>
                      <button type="button" title="Duplicar" onClick={() => onDuplicate(scenario)}><Copy size={14} /></button>
                      <button type="button" title="Excluir" onClick={() => onDelete(scenario.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
