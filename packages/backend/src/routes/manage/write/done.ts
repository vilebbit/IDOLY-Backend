import type { Request } from 'express'
import jsonResponse, { errorResponse } from '@utils/jsonResponse'
import { isAdmin } from '@utils/requirePermission'
import kv from '@utils/kv'
import { UpdateTimeKey } from '@utils/const'
import observeAdv from '@utils/observeAdv'
import flattenMessages from '@utils/flattenMessage'
import { rawWrapper } from '@utils/apiWrapper'

/**
 * POST /manage/write/done
 *
 * Authorization: Bearer [ADMINISTRATION TOKEN]
 */
async function _handler(req: Request): Promise<Response> {
  if (!isAdmin(req)) {
    return errorResponse('Unauthorized', 403)
  }
  const now = new Date()
  // A bit of privacy...
  now.setMinutes(0)
  now.setSeconds(0)
  await Promise.all([
    kv.setValue(UpdateTimeKey, String(now)),
    observeAdv(),
    flattenMessages(),
  ])

  return jsonResponse({ ok: true })
}

export const handler = rawWrapper(_handler)
