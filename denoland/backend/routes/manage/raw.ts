import type { Request as OakRequest } from '@oak/oak'
import { errorResponse } from '@utils/jsonResponse.ts'
import { isReadonly } from '@utils/requirePermission.ts'
import kv from '@utils/kv.ts'
import { NonExpandedKeys } from '@utils/const.ts'
import { rawWrapper } from '@utils/apiWrapper.ts'

/**
 * GET /manage/raw?key=name
 *
 * Authorization: Bearer [ADMINISTRATION/READONLY TOKEN]
 */
async function _handler(req: OakRequest): Promise<Response> {
  if (!isReadonly(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  if (!key) {
    return new Response('Key should be string', {
      status: 400,
    })
  }
  const val = NonExpandedKeys.includes(key as any)
    ? await kv.getValue(key as any)
    : JSON.stringify(await kv.get(key as any))
  return new Response(val, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const handler = rawWrapper(_handler)
