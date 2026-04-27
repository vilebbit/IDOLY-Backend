import * as Sentry from '@sentry/node'
import jsonResponse, { notModifiedResponse } from '@utils/jsonResponse'
import ping from './ping'
import { FieldStatus } from './types'
import { ErrorWithStatus } from './types'
import { Request, Response as ExpressResponse } from 'express'
import env from './env'
import getOriginalUrl from './getOriginalUrl'

function mergeSearchParams(params: any): Record<string, string> {
  const ret: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    ret[k] = String(v)
  }
  return ret
}

async function buildResponse(
  req: Request,
  f: (...t: any) => Promise<any>
): Promise<Response> {
  const remoteAddr = req.ip ?? 'unknown'
  ping(req, remoteAddr).catch(console.log)

  return Sentry.startSpan(
    {
      name: 'api-request',
      attributes: {},
    },
    async (span: any) => {
      const url = getOriginalUrl(req)
      span.setAttribute('path', String(url))
      const params = mergeSearchParams(req.query)
      const result = await f(params).catch((e) =>
        typeof e === 'object' && FieldStatus in e
          ? e
          : {
              ok: false,
              message: String(e),
              [FieldStatus]: 400,
            }
      )
      let status = 200
      if (FieldStatus in (result as ErrorWithStatus)) {
        status = result[FieldStatus]
      }
      span.setAttribute('status', status)
      const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(JSON.stringify(result))
      )
      const eTag = `"${Buffer.from(hash).toString('hex')}"`
      const commonCacheTags = {
        ...(status === 200
          ? {
              'Cache-Control':
                'public, max-age=3600, stale-while-revalidate=3600',
              ETag: `W/${eTag}`,
            }
          : {}),
      }

      const reqETag = req.get('If-None-Match')
      if (reqETag) {
        // Check ETag
        if (reqETag.replace(/^W\//, '') === eTag.replace(/^W\//, '')) {
          // ETag matches
          return notModifiedResponse(commonCacheTags)
        }
      }

      return jsonResponse(
        result,
        {
          ...commonCacheTags,
          'X-Sentry-Ref': span.spanContext().traceId,
          'X-Instance-Id': env.BACKEND_INSTANCE_ID,
        },
        status
      )
    }
  )
}

export function rawWrapper(f: (req: Request) => Promise<Response>) {
  return async function handler(req: Request, res: ExpressResponse) {
    const response = await f(req)
    res.status(response.status)
    res.set(Object.fromEntries(response.headers.entries()))
    const body = await response.text()
    res.send(body)
  }
}

export default function apiWrapper(f: (...t: any) => Promise<any>) {
  return async function handler(req: Request, res: ExpressResponse) {
    const response = await buildResponse(req, f)
    res.status(response.status)
    res.set(Object.fromEntries(response.headers.entries()))
    const body = await response.text()
    res.send(body)
  }
}
