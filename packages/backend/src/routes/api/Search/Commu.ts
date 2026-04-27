import type { APIMapping } from 'hoshimi-types'
import { dbAggregate } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { CommuXKey, CommuXSearchIndex } from '@utils/const'

const responder: APIMapping['Search/Commu'] = async ({ q }) => {
  if (!q) {
    return []
  }
  const results = await dbAggregate(CommuXKey, [
    {
      $search: {
        index: CommuXSearchIndex,
        text: {
          query: q,
          path: {
            wildcard: '*',
          },
        },
      },
    },
    {
      $limit: 30,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        text: 1,
        advAssetId: 1,
        title: 1,
      },
    },
  ])

  return results
}

export const handler = apiWrapper(responder)
