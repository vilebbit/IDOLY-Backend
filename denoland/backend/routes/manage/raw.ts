import { Handlers } from '$fresh/server.ts'
import { errorResponse } from '@utils/jsonResponse.ts'
import { isReadonly } from '@utils/requirePermission.ts'
import kv from '@utils/kv.ts'
import { NonExpandedKeys } from '@utils/const.ts'
import { NaiveResourceMapping } from '@utils/types.ts'

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
    const val = NonExpandedKeys.includes(
      key as (typeof NonExpandedKeys)[number]
    )
      ? await kv.getValue(key as (typeof NonExpandedKeys)[number])
      : JSON.stringify(await kv.get(key as keyof NaiveResourceMapping))
    return new Response(val, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
