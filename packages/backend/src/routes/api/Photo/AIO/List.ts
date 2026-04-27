import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import omit from 'lodash/omit'

const responder: APIMapping['Photo/AIO/List'] = async ({ name }) => {
  const photoAio = await dbGet('PhotoAllInOne')
  return photoAio
    .filter((x) => x.name === name)
    .map((x) => omit(x, ['abilities']))
}

export const handler = apiWrapper(responder)
