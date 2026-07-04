export function cloneValue<T>(value: T): T {
  if (typeof structuredClone !== "undefined") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}
