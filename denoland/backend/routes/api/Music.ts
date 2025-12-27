import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import createErrStatus from '@utils/createErrStatus.ts'
import omit from 'lodash/omit.js'

const responder: APIMapping['Music'] = async ({ id }) => {
  const musics = await dbGet('Music', {
    id: {
      $eq: id,
    },
  })
  const item = musics[0]
  if (!item) {
    return createErrStatus(`No music found with id ${id}`, 404)
  }

  return omit(item, ['volumePermyriads', 'vocalVolumePermyriads'])
}

export const handler = apiWrapper(responder)
