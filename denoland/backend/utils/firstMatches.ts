export default function firstMatches<T>(
  arr: T[],
  key: string | number,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // deno-lint-ignore no-explicit-any
  value: any,
): T | null {
  for (const i of arr) {
    // @ts-expect-error should not throw
    if (i?.[key] === value) {
      return i;
    }
  }
  return null;
}
