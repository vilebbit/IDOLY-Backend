export function parseNumber(s?: string): number | null {
  return Number.isNaN(Number(s)) ? null : Number(s);
}

export function parseIntNumber(s?: string): number | null {
  const n = parseNumber(s);
  if (n === null) return null;
  return Number(n.toFixed(0));
}

// TODO: determine query parameter parsing
export function parseMultiString(s: string[] | string): string[] {
  if (!s) return [];
  if (typeof s === "string") {
    return s.split(",").map((x) => x.trim());
  }
  return s;
}
