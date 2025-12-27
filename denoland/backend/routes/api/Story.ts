import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'
import createErrStatus from '@utils/createErrStatus.ts'

const responder: APIMapping['Story'] = async ({ id }) => {
  const dbStory = await dbGet('Story', {
    id: {
      $eq: id,
    },
  })
  const ret = dbStory[0]
  if (!ret) {
    return createErrStatus(`Story not found: ${id}`, 404)
  }
  return pick(ret, ['id', 'name', 'sectionName', 'description', 'advAssetIds'])
}

export const handler = apiWrapper(responder)
