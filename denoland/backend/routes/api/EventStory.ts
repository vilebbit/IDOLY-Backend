import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'

const responder: APIMapping['EventStory'] = async ({ id }) => {
  const ev = await dbGet('EventStory', {
    id: {
      $eq: id,
    },
  })
  return (
    ev.map((x) => ({
      ...pick(x, ['id', 'name', 'description', 'order', 'assetId']),
      episodes: x.episodes.map((y) => pick(y, ['episode', 'storyId'])),
    }))?.[0] ?? null
  )
}

export const handler = apiWrapper(responder)
