import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { buildCalendar, fillVacationDates } from "./domain/calendar";
import { cloneValue } from "./domain/clone";
import { addDays } from "./domain/date";
import { applyHolidayOverrides, getBaseHolidays } from "./domain/holidays";
import { createId } from "./domain/id";
import { suggestVacationStarts } from "./domain/optimizer";
import { createScenario, defaultConfig, refreshVacation, validateFreeLeave, validateMonthlyLeave } from "./domain/scenarios";
import { calculateTotals } from "./domain/totals";
import type { EditMode, PlanningConfig, Scenario } from "./domain/types";
import { ConfigPanel } from "./components/ConfigPanel";
import { HolidayEditor } from "./components/HolidayEditor";
import { ScenarioComparison } from "./components/ScenarioComparison";
import { ScenarioPanel } from "./components/ScenarioPanel";
import { SuggestionsPanel } from "./components/SuggestionsPanel";
import { YearCalendar } from "./components/YearCalendar";

const storageKey = "marca-ferias-prototype";

type StoredState = {
  current: Scenario;
  saved: Scenario[];
};

function sortSaved(items: Array<{ scenario: Scenario; totals: ReturnType<typeof calculateTotals> }>) {
  return items.sort((a, b) => {
    const totalDiff = b.totals.totalContinuousDaysAway - a.totals.totalContinuousDaysAway;
    if (totalDiff !== 0) return totalDiff;
    const extraA = a.totals.monthlyLeavesUsed + a.totals.freeLeavesUsed;
    const extraB = b.totals.monthlyLeavesUsed + b.totals.freeLeavesUsed;
    return extraA - extraB;
  });
}

function cloneScenario(scenario: Scenario, name = `${scenario.name} cópia`): Scenario {
  return {
    ...cloneValue(scenario),
    id: createId(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const [mode, setMode] = useState<EditMode>("vacation");
  const [message, setMessage] = useState<string>();
  const topbarRef = useRef<HTMLElement>(null);
  const [topbarHeight, setTopbarHeight] = useState(86);
  const [current, setCurrent] = useState<Scenario>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return createScenario(defaultConfig(2026));
      return (JSON.parse(raw) as StoredState).current;
    } catch {
      return createScenario(defaultConfig(2026));
    }
  });
  const [saved, setSaved] = useState<Scenario[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      return (JSON.parse(raw) as StoredState).saved ?? [];
    } catch {
      return [];
    }
  });

  const baseHolidays = useMemo(() => getBaseHolidays(current.config.year), [current.config.year]);
  const holidays = useMemo(
    () => applyHolidayOverrides(baseHolidays, current.holidayOverrides),
    [baseHolidays, current.holidayOverrides],
  );
  const calendar = useMemo(() => buildCalendar(current.config, holidays), [current.config, holidays]);
  const scenario = useMemo(() => refreshVacation(current, calendar), [current, calendar]);
  const totals = useMemo(() => calculateTotals(scenario, calendar), [scenario, calendar]);
  const suggestions = useMemo(() => suggestVacationStarts(scenario, calendar), [scenario, calendar]);

  const savedWithTotals = useMemo(() => {
    return sortSaved(
      saved.map((item) => {
        const itemHolidays = applyHolidayOverrides(getBaseHolidays(item.config.year), item.holidayOverrides);
        const itemCalendar = buildCalendar(item.config, itemHolidays);
        const refreshed = refreshVacation(item, itemCalendar);
        return { scenario: refreshed, totals: calculateTotals(refreshed, itemCalendar) };
      }),
    );
  }, [saved]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ current, saved }));
    } catch {
      // localStorage indisponível — execução sem persistência
    }
  }, [current, saved]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(undefined), 3500);
    return () => window.clearTimeout(timeout);
  }, [message]);

  useEffect(() => {
    const topbar = topbarRef.current;
    if (!topbar) return;

    const updateTopbarHeight = () => setTopbarHeight(topbar.offsetHeight);
    updateTopbarHeight();

    const observer = new ResizeObserver(updateTopbarHeight);
    observer.observe(topbar);
    window.addEventListener("resize", updateTopbarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTopbarHeight);
    };
  }, []);

  const updateCurrent = (next: Scenario) => setCurrent({ ...next, updatedAt: new Date().toISOString() });

  const updateConfig = (config: PlanningConfig) => {
    updateCurrent({
      ...scenario,
      config,
      vacationStartDate: config.year === scenario.config.year ? scenario.vacationStartDate : undefined,
      vacationDates: [],
      monthlyLeaveDates: config.year === scenario.config.year ? scenario.monthlyLeaveDates : [],
      freeLeaveDates: config.year === scenario.config.year ? scenario.freeLeaveDates : [],
      holidayOverrides: config.year === scenario.config.year ? scenario.holidayOverrides : { added: [], removedDates: [] },
    });
  };

  const handleDayClick = (date: string) => {
    const day = calendar.find((item) => item.date === date);
    if (!day) return;

    if (mode === "vacation") {
      if (!day.isEligibleWorkday) {
        setMessage("Escolha um dia útil para iniciar as férias.");
        return;
      }
      updateCurrent({ ...scenario, vacationStartDate: date, vacationDates: fillVacationDates(date, scenario.config.vacationDays, calendar) });
      return;
    }

    if (mode === "monthly") {
      if (scenario.monthlyLeaveDates.includes(date)) {
        updateCurrent({ ...scenario, monthlyLeaveDates: scenario.monthlyLeaveDates.filter((leave) => leave !== date) });
        return;
      }
      const error = validateMonthlyLeave(date, scenario, calendar);
      if (error) {
        setMessage(error);
        return;
      }
      updateCurrent({ ...scenario, monthlyLeaveDates: [...scenario.monthlyLeaveDates, date].sort() });
      return;
    }

    if (scenario.freeLeaveDates.includes(date)) {
      updateCurrent({ ...scenario, freeLeaveDates: scenario.freeLeaveDates.filter((leave) => leave !== date) });
      return;
    }
    const error = validateFreeLeave(date, scenario, calendar);
    if (error) {
      setMessage(error);
      return;
    }
    updateCurrent({ ...scenario, freeLeaveDates: [...scenario.freeLeaveDates, date].sort() });
  };

  const saveScenario = () => {
    const refreshed = { ...scenario, updatedAt: new Date().toISOString() };
    setSaved((items) => {
      const exists = items.some((item) => item.id === refreshed.id);
      return exists ? items.map((item) => (item.id === refreshed.id ? refreshed : item)) : [...items, refreshed];
    });
    setMessage("Cenário salvo para comparação.");
  };

  const duplicateCurrent = () => {
    const duplicate = cloneScenario(scenario);
    setCurrent(duplicate);
    setSaved((items) => [...items, duplicate]);
    setMessage("Cenário duplicado.");
  };

  const loadScenario = (item: Scenario) => {
    setCurrent(cloneValue(item));
    setMessage("Cenário carregado.");
  };

  const duplicateSaved = (item: Scenario) => {
    const duplicate = cloneScenario(item);
    setSaved((items) => [...items, duplicate]);
    setCurrent(duplicate);
  };

  const clearScenario = () => {
    updateCurrent({
      ...scenario,
      vacationStartDate: undefined,
      vacationDates: [],
      monthlyLeaveDates: [],
      freeLeaveDates: [],
      notes: "",
    });
  };

  const breakRange = totals.totalBreakStart && totals.totalBreakEnd ? `${totals.totalBreakStart} até ${totals.totalBreakEnd}` : "sem intervalo";
  const modeOptions: Array<{ value: EditMode; label: string }> = [
    { value: "vacation", label: "Férias" },
    { value: "monthly", label: "Folga mensal" },
    { value: "free", label: "Folga livre" },
  ];

  return (
    <div className="app-shell" style={{ "--topbar-height": `${topbarHeight}px` } as CSSProperties}>
      <header className="topbar" ref={topbarRef}>
        <div className="brand-block">
          <span className="eyebrow">Protótipo visual</span>
          <h1>Marca Férias</h1>
        </div>
        <nav className="topbar-mode" aria-label="Modo de edição">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              className={mode === option.value ? "active" : ""}
              type="button"
              onClick={() => setMode(option.value)}
            >
              {option.label}
            </button>
          ))}
        </nav>
        <div className="topbar-status">
          <span>Ano {scenario.config.year}</span>
          <span>São Paulo, SP</span>
          <strong>{totals.totalContinuousDaysAway} dias fora</strong>
        </div>
      </header>

      <div className="workspace-grid">
        <ConfigPanel
          config={scenario.config}
          mode={mode}
          onConfigChange={updateConfig}
          onModeChange={setMode}
          onSave={saveScenario}
          onClear={clearScenario}
        />
        <YearCalendar
          calendar={calendar}
          mode={mode}
          vacationDates={scenario.vacationDates}
          monthlyLeaveDates={scenario.monthlyLeaveDates}
          freeLeaveDates={scenario.freeLeaveDates}
          vacationStartDate={scenario.vacationStartDate}
          totals={totals}
          onDayClick={handleDayClick}
        />
        <ScenarioPanel scenario={scenario} totals={totals} message={message} onScenarioChange={updateCurrent} onDuplicate={duplicateCurrent} />
      </div>

      <div className="bottom-stack">
        <SuggestionsPanel
          suggestions={suggestions}
          onApply={(date) =>
            updateCurrent({ ...scenario, vacationStartDate: date, vacationDates: fillVacationDates(date, scenario.config.vacationDays, calendar) })
          }
        />
        <HolidayEditor
          year={scenario.config.year}
          holidays={holidays}
          overrides={scenario.holidayOverrides ?? { added: [], removedDates: [] }}
          onChange={(holidayOverrides) => updateCurrent({ ...scenario, holidayOverrides })}
        />
        <ScenarioComparison
          saved={savedWithTotals}
          onLoad={loadScenario}
          onDuplicate={duplicateSaved}
          onDelete={(id) => setSaved((items) => items.filter((item) => item.id !== id))}
        />
      </div>

      <footer>
        Regras documentadas no protótipo: férias oficiais em dias corridos; folgas antes, durante ou depois do período oficial; feriados
        locais editáveis. Intervalo atual: {breakRange}. Próximo dia após o afastamento:{" "}
        {totals.totalBreakEnd ? addDays(totals.totalBreakEnd, 1) : "-"}.
      </footer>
    </div>
  );
}
