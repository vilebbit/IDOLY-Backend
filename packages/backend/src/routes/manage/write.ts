import type { Request } from 'express'
import jsonResponse, { errorResponse } from '@utils/jsonResponse'
import { isAdmin } from '@utils/requirePermission'
import kv from '@utils/kv'
import tryJsonParse from '@utils/tryJsonParse'
import { MetadataKeys, SplitStoreKeys } from '@utils/const'
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
  const typ = (SplitStoreKeys as readonly string[]).includes(key)
    ? 'split'
    : json.type === 'value' || (MetadataKeys as readonly string[]).includes(key)
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
  } else if (typ === 'value') {
    return await kv
      .setValue(key, JSON.stringify(value))
      .then(() => jsonResponse({ ok: true, lines: 1 }))
      .catch((x) => errorResponse(x, 500))
  } else if (typeof value === 'object' && typ === 'split') {
    const nonSplitObject: Record<string, unknown> = {}
    const results = []
    for (const [oKey, oValue] of Object.entries(value)) {
      if (Array.isArray(oValue)) {
        const actualDbKey = `${key}_${oKey}`
        await kv
          .del(actualDbKey as any)
          .catch((e) => console.error(`Failed to clean ${actualDbKey}: ${e}`))
        results.push(
          await kv
            .put(actualDbKey as any, oValue)
            .then(() => ({ ok: true, lines: oValue.length, oKey }))
            .catch((x) => ({ ok: false, lines: 0, oKey, error: x }))
        )
      } else {
        nonSplitObject[oKey] = oValue
      }
    }
    if (Object.keys(nonSplitObject).length > 0) {
      results.push(
        await kv
          .setValue(key, JSON.stringify(nonSplitObject))
          .then(() => ({ ok: true, lines: 1, oKey: '(root)' }))
          .catch((x) => ({ ok: false, lines: 0, oKey: '(root)', error: x }))
      )
    }

    const isAllOk = !results.some((x) => !x.ok)
    if (isAllOk) {
      return jsonResponse({
        ok: true,
        lines: results.map((x) => x.lines).reduce((a, b) => a + b),
        oKeys: results.map((x) => x.oKey),
      })
    } else {
      return errorResponse(JSON.stringify(results), 500)
    }
  }
  return errorResponse("Value should be an JSON'd array or an value", 400)
}

export const handler = rawWrapper(_handler)
