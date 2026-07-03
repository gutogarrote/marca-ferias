export const iso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseIso = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (date: string, days: number) => {
  const value = parseIso(date);
  value.setDate(value.getDate() + days);
  return iso(value);
};

export const monthKey = (date: string) => date.slice(0, 7);

export const dateLabel = (date?: string) => {
  if (!date) return "Não definido";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parseIso(date));
};

export const fullDateLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parseIso(date));

export const countInclusiveDays = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  return Math.round((parseIso(end).getTime() - parseIso(start).getTime()) / 86400000) + 1;
};
