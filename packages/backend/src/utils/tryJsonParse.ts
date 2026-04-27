export default function tryJsonParse(s: string): any | undefined {
  try {
    return JSON.parse(s)
  } catch (_) {
    return undefined
  }
}
