export default function dedup<T>(s: T[]): T[] {
  return [...new Set(s)];
}
