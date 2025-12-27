import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'

const responder: APIMapping['Character/List'] = async () => {
  const ch = await dbGet('Character')
  return ch.map((x) =>
    pick(x, ['id', 'order', 'characterGroupId', 'name', 'enName', 'color'])
  )
}

export const handler = apiWrapper(responder)
