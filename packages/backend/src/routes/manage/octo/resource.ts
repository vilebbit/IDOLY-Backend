import type { Request } from 'express'
import { errorResponse } from '@utils/jsonResponse'
import { isReadonly } from '@utils/requirePermission'
import { dbGet } from '@utils/dbGet'
import { rawWrapper } from '@utils/apiWrapper'
import getOriginalUrl from '@utils/getOriginalUrl'

/**
 * GET /manage/octo/resource?name=
 *
 * Authorization: Bearer [ADMINISTRATION/READONLY TOKEN]
 */
async function _handler(req: Request): Promise<Response> {
  if (!isReadonly(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const url = getOriginalUrl(req)
  const name = url.searchParams.get('name')
  if (!name) {
    return new Response('ID should be string', {
      status: 400,
    })
  }
  const octoDb = await dbGet('Octo')
  const item = octoDb.resourceList.filter((x) => x.name === name)?.[0]
  if (!item) {
    return new Response(`Asset not found: ${name}`, {
      status: 404,
    })
  }
  return new Response(JSON.stringify(item), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const handler = rawWrapper(_handler)
