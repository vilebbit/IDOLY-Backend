import type { APIMapping } from 'hoshimi-types'
import { parseIntNumber } from '@utils/parse'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'

const responder: APIMapping['Notice'] = async ({
  limit: _limit,
  offset: _offset,
  type,
}) => {
  const limit = parseIntNumber(_limit) ?? 5
  const offset = parseIntNumber(_offset) ?? 0
  const allNotices = await dbGet('Notice')
  return allNotices[type].slice(offset, offset + limit)
}

export const handler = apiWrapper(responder)
