import { Wand2 } from "lucide-react";
import { dateLabel } from "../domain/date";
import type { Suggestion } from "../domain/types";

type Props = {
  suggestions: Suggestion[];
  onApply: (date: string) => void;
};

export function SuggestionsPanel({ suggestions, onApply }: Props) {
  return (
    <section className="bottom-panel suggestions-panel">
      <div className="section-heading">
        <h2>
          <Wand2 size={18} /> Sugestões de melhores inícios
        </h2>
        <p>Simula todos os dias úteis mantendo as folgas já posicionadas.</p>
      </div>
      <div className="suggestion-list">
        {suggestions.map((suggestion, index) => (
          <button key={suggestion.date} type="button" onClick={() => onApply(suggestion.date)}>
            <span>#{index + 1}</span>
            <strong>{dateLabel(suggestion.date)}</strong>
            <small>
              {suggestion.totalContinuousDaysAway} dias fora · até {dateLabel(suggestion.totalBreakEnd)}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}
