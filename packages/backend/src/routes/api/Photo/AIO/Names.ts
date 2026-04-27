import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import dedup from '@utils/dedup'

const responder: APIMapping['Photo/AIO/Names'] = async () => {
  const photoAio = await dbGet('PhotoAllInOne')
  return dedup(photoAio.map((x) => x.name))
}

export const handler = apiWrapper(responder)
