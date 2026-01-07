import type { Request as OakRequest } from '@oak/oak'
import { errorResponse } from '@utils/jsonResponse.ts'
import { isReadonly } from '@utils/requirePermission.ts'
import { dbGet } from '@utils/dbGet.ts'
import { rawWrapper } from '@utils/apiWrapper.ts'

/**
 * GET /manage/octo/resource?name=
 *
 * Authorization: Bearer [ADMINISTRATION/READONLY TOKEN]
 */
async function _handler(req: OakRequest): Promise<Response> {
  if (!isReadonly(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const url = new URL(req.url)
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
