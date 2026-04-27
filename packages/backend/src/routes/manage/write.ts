import type { Request } from 'express'
import jsonResponse, { errorResponse } from '@utils/jsonResponse'
import { isAdmin } from '@utils/requirePermission'
import kv from '@utils/kv'
import tryJsonParse from '@utils/tryJsonParse'
import { NonExpandedKeys } from '@utils/const'
import { rawWrapper } from '@utils/apiWrapper'

/**
 * PUT /manage/write
 *
 * Authorization: Bearer [ADMINISTRATION TOKEN]
 * body: {
 *     key: "".
 *     value:"",
 *     type: array (default) | value
 * }
 */
async function _handler(req: Request): Promise<Response> {
  if (!isAdmin(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const json: Record<string, string> = await req.body
  if (!json.key || !json.value) {
    return new Response('No key or value found', {
      status: 400,
    })
  }

  const key = json.key
  const typ =
    json.type === 'value' || NonExpandedKeys.includes(key as any)
      ? 'value'
      : 'array'
  const value = tryJsonParse(json.value)
  if (value === undefined) {
    return errorResponse('Invalid JSON', 400)
  }
  if (typeof key !== 'string') {
    return errorResponse('Key should be string', 400)
  }
  if (Array.isArray(value) && typ === 'array') {
    await kv.del(key as any)
    return await kv
      .put(key as any, value)
      .then((x) => jsonResponse({ ok: true, lines: x }))
      .catch((x) => errorResponse(x, 500))
  }
  if (typ === 'value') {
    return await kv
      .setValue(key as any, JSON.stringify(value))
      .then(() => jsonResponse({ ok: true, lines: 1 }))
      .catch((x) => errorResponse(x, 500))
  }
  return errorResponse("Value should be an JSON'd array or an value", 400)
}

export const handler = rawWrapper(_handler)
