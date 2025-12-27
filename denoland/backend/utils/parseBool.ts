export default function parseBool(t?: string): boolean {
  if (t === undefined || t.toLowerCase() === "false") {
    return false;
  }
  return true;
}
