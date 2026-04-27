import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import pick from 'lodash/pick'

const responder: APIMapping['EventStory/List'] = async () => {
  const ch = await dbGet('EventStory')
  return ch.map((x) => pick(x, ['id', 'order', 'name', 'description']))
}

export const handler = apiWrapper(responder)
