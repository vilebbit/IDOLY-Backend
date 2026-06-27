import type { APIMapping } from 'hoshimi-types'
import { parseIntNumber } from '@utils/parse'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { errorResponse } from '@utils/jsonResponse'

const responder: APIMapping['Notice'] = async ({
  limit: _limit,
  offset: _offset,
  type,
}) => {
  if (!['notices', 'malfunctionNotices', 'prNotices'].includes(type)) {
    throw Error(`Invalid type ${type}`)
  }
  const limit = parseIntNumber(_limit) ?? 5
  const offset = parseIntNumber(_offset) ?? 0
  const allNotices = await dbGet(`Notice_${type}`)
  return allNotices.slice(offset, offset + limit)
}

export const handler = apiWrapper(responder)
