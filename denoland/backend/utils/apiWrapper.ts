import * as Sentry from 'sentry'
import jsonResponse, { notModifiedResponse } from '@utils/jsonResponse.ts'
import ping from './ping.ts'
import { FieldStatus } from './types.ts'
import { ErrorWithStatus } from './types.ts'
import { encodeHex } from 'encoding/hex'
import { Context } from '@oak/oak'
import type { Request as OakRequest } from '@oak/oak'
import env from './env.ts'

function mergeSearchParams(sp: URLSearchParams): Record<string, string> {
  const ret: Record<string, string> = {}
  for (const [k, v] of sp.entries()) {
    ret[k] = v
  }
  return ret
}

async function buildResponse(
  ctx: Context,
  f: (...t: any) => Promise<any>
): Promise<Response> {
  const req = ctx.request
  const remoteAddr = req.ip
  ping(req, remoteAddr).catch(console.log)

  return Sentry.startSpan(
    {
      name: 'api-request',
      attributes: {},
    },
    async (span) => {
      const url = req.url
      span.setAttribute('path', String(url))
      const params = mergeSearchParams(url.searchParams)
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
      const eTag = `"${encodeHex(hash)}"`
      const commonCacheTags = {
        ...(status === 200
          ? {
              'Cache-Control':
                'public, max-age=3600, stale-while-revalidate=3600',
              ETag: `W/${eTag}`,
            }
          : {}),
      }

      const reqETag = req.headers.get('If-None-Match')
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

export function rawWrapper(f: (req: OakRequest) => Promise<Response>) {
  return async function handler(ctx: Context) {
    const response = await f(ctx.request)
    ctx.response.status = response.status
    ctx.response.body = response.body
    ctx.response.headers = response.headers
  }
}

export default function apiWrapper(f: (...t: any) => Promise<any>) {
  return async function handler(ctx: Context) {
    const response = await buildResponse(ctx, f)
    ctx.response.status = response.status
    ctx.response.body = response.body
    ctx.response.headers = response.headers
  }
}
