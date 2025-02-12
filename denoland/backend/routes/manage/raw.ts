import { Handlers } from 'https://deno.land/x/fresh@1.0.1/server.ts'
import { errorResponse } from '@utils/jsonResponse.ts'
import { isReadonly } from '@utils/requirePermission.ts'
import kv from '@utils/kv.ts'
import { NonExpandedKeys } from '@utils/const.ts'

/**
 * GET /manage/raw?key=name
 *
 * Authorization: Bearer [ADMINISTRATION/READONLY TOKEN]
 */
export const handler: Handlers = {
  async GET(req) {
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
    const val = NonExpandedKeys.includes(key)
      ? await kv.getValue(key)
      : JSON.stringify(await kv.get(key))
    return new Response(val, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
