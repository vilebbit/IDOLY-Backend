import type { Request as OakRequest } from '@oak/oak'
import jsonResponse, { errorResponse } from '@utils/jsonResponse.ts'
import { isAdmin } from '@utils/requirePermission.ts'
import kv from '@utils/kv.ts'
import { CommuXKey } from '@utils/const.ts'
import { rawWrapper } from '@utils/apiWrapper.ts'

/**
 * PUT /manage/writeCommu
 *
 * Authorization: Bearer [ADMINISTRATION TOKEN]
 * body: {
 *     title: "",
 *     lines: [{
 *        name, text
 *     }],
 * }
 */
async function _handler(req: OakRequest): Promise<Response> {
  if (!isAdmin(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const json: Record<string, any> = await req.body.json()
  if (!json.title || !json.advAssetId || !Array.isArray(json.lines)) {
    return new Response('Invalid title, advAssetId, or lines found', {
      status: 400,
    })
  }
  const { title, advAssetId, lines } = json
  const deletedCount = await kv.delWithFilter(CommuXKey, { advAssetId })
  return await kv
    .put(
      CommuXKey,
      lines.map(({ name, text }) => ({
        name,
        text,
        advAssetId,
        title,
      }))
    )
    .then(() => jsonResponse({ ok: true, deleted: deletedCount }))
    .catch((x) => errorResponse(x, 500))
}

export const handler = rawWrapper(_handler)
