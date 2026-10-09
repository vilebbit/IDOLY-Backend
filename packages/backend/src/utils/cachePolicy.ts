export const CARD_CACHE_SECONDS = 60 * 60
export const DATA_CACHE_SECONDS = 12 * 60 * 60
export const MEMORY_CACHE_SECONDS = 30 * 60

export function isCardApiPath(pathname: string): boolean {
  if (pathname.startsWith('/api/Card')) return true
  if (pathname === '/api/Skill' || pathname.startsWith('/api/Skill/')) {
    return true
  }
  if (pathname === '/api/LiveAbility') return true
  if (pathname === '/api/ActivityAbility') return true
  return false
}

export function cacheControlForPath(pathname: string): string {
  const ttl = isCardApiPath(pathname)
    ? CARD_CACHE_SECONDS
    : DATA_CACHE_SECONDS
  return `public, max-age=${ttl}, must-revalidate`
}
