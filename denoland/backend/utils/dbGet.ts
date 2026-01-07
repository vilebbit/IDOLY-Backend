import * as Sentry from 'sentry'
import { NonExpandedKeys } from './const.ts'
import kv from './kv.ts'
import { UnArray } from './types.ts'
import { Filter } from 'mongodb'
import { getCache, setCache } from './cache.ts'
import type { AcceptableDbKey, ResourceMapping } from 'hoshimi-types/'

function isNonExpandedKey(
  key: string
): key is (typeof NonExpandedKeys)[number] {
  return NonExpandedKeys.includes(key as (typeof NonExpandedKeys)[number])
}

/**
 * Use MongoDB-based operation API if possible.
 */
export function dbGet<T extends AcceptableDbKey>(
  s: T,
  filter: Filter<UnArray<ResourceMapping[T]>> = {}
): Promise<ResourceMapping[T]> {
  return Sentry.startSpan(
    {
      name: 'db-get',
    },
    async (span) => {
      const startAt = performance.now()
      if (isNonExpandedKey(s)) {
        const result = await kv.getValue(s as (typeof NonExpandedKeys)[number])
        const endAt = performance.now()
        span.setAttribute('dbRequestTime', endAt - startAt)
        return JSON.parse(result)
      }

      // If no filter is applied, try to get from cache
      if (Object.keys(filter).length === 0) {
        const cached = await getCache<ResourceMapping[T]>(s)
        if (cached) {
          const endAt = performance.now()
          span.setAttribute('dbRequestTime', endAt - startAt)
          span.setAttribute('cacheHit', true)
          return cached
        }
      }

      const result = await kv.get(s, filter)

      // If no filter is applied, set cache
      if (Object.keys(filter).length === 0) {
        await setCache(s, result)
      }

      const endAt = performance.now()
      span.setAttribute('dbRequestTime', endAt - startAt)
      // @ts-nocheck: TODO: recognize the correct type
      return result
    }
  )
}

export const dbAggregate = kv.aggregate
