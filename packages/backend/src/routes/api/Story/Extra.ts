import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { omit, pick } from 'lodash'

const responder: APIMapping['Story/Extra'] = async () => {
  const dbStory = await dbGet('ExtraStory')
  return dbStory
    .filter((x) => x.id.startsWith('ex-story-part-special'))
    .map((x) => {
      const { episodes } = x
      return {
        ...pick(x, [
          'id',
          'assetId',
          'name',
          'description',
          'order',
          'episodes',
        ]),
        episodes: episodes.map((x) =>
          omit(x, ['viewConditionId', 'unlockConditionId'])
        ),
      }
    })
}

export const handler = apiWrapper(responder)
