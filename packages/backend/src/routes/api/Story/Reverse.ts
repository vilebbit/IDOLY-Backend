import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import createErrStatus from '@utils/createErrStatus'

const responder: APIMapping['Story/Reverse'] = async ({ advAssetId }) => {
  const dbStory = await dbGet('Story')
  const ret = dbStory.find((x) => x.advAssetIds.includes(advAssetId))
  if (!ret) {
    return createErrStatus(`advAssetId not found: ${advAssetId}`, 404)
  }
  return {
    id: ret.id,
  }
}

export const handler = apiWrapper(responder)
