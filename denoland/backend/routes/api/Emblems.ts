import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'

const responder: APIMapping['Emblems'] = async ({ prefix }) => {
  const emblems = await dbGet('Emblem')
  const prefixes = prefix.split(',')

  const data = emblems
    .filter((x) => prefixes.filter((p) => x.assetId.startsWith(p)).length > 0)
    .sort((a, b) => a.order - b.order)
    .map((x) =>
      pick(x, ['name', 'assetId', 'isViewableInInactive', 'description'])
    )

  return data
}

export const handler = apiWrapper(responder)
