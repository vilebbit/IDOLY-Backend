import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'

const responder: APIMapping['EventStory/List'] = async () => {
  const ch = await dbGet('EventStory')
  return ch.map((x) => pick(x, ['id', 'order', 'name', 'description']))
}

export const handler = apiWrapper(responder)
