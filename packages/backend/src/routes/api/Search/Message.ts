import type { APIMapping } from 'hoshimi-types'
import { dbAggregate } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { MessageXKey, MessageXSearchIndex } from '@utils/const'

const responder: APIMapping['Search/Message'] = async ({
  q,
  characterId }) => {
  if (!q) {
    return []
  }
  const matchStage: Record<string, { $eq: string }> | {} = characterId
    ? { characterId: { $eq: characterId } }
    : {}

  const results = await dbAggregate(MessageXKey, [
    {
      $search: {
        index: MessageXSearchIndex,
        text: {
          query: q,
          path: {
            wildcard: '*',
          },
        },
      },
    },
    ...(Object.keys(matchStage).length > 0
      ? [{ $match: matchStage }]
      : []),
    {
      $limit: 30,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        id: 1,
        messageDetailId: 1,
        text: 1,
        characterId: 1,
        characterGroupId: 1,
      },
    },
  ])

  return results
}

export const handler = apiWrapper(responder)
