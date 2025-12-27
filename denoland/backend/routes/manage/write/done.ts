import jsonResponse, { errorResponse } from '@utils/jsonResponse.ts'
import { isAdmin } from '@utils/requirePermission.ts'
import kv from '@utils/kv.ts'
import { UpdateTimeKey } from '@utils/const.ts'
import observeAdv from '@utils/observeAdv.ts'
import flattenMessages from '@utils/flattenMessage.ts'
import { rawWrapper } from '@utils/apiWrapper.ts'

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
