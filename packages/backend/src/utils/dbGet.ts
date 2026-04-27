import * as Sentry from '@sentry/node'
import { NonExpandedKeys } from './const'
import kv from './kv'
import { UnArray } from './types'
import { Filter } from 'mongodb'
import { getCache, setCache } from './cache'
import type { AcceptableDbKey, ResourceMapping } from 'hoshimi-types'

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
  filter: Filter<UnArray<ResourceMapping[T]>> = {},
  forceCache = false
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

      const useCache = Object.keys(filter).length === 0 || forceCache
      span.setAttribute('useCache', useCache)

      if (useCache) {
        const cached = await getCache<ResourceMapping[T]>(s)
        if (cached) {
          const endAt = performance.now()
          span.setAttribute('dbRequestTime', endAt - startAt)
          span.setAttribute('cacheHit', true)
          return cached
        } else {
          span.setAttribute('cacheHit', false)
        }
      }

      // @ts-expect-error TODO: fix
      const result = await kv.get(s, filter)

      if (useCache) {
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
