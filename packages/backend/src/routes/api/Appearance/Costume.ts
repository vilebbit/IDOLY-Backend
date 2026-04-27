import type { APIMapping } from 'hoshimi-types'
import pick from 'lodash/pick'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { parseMultiString } from '@utils/parse'
import { filterByReleaseDate } from '@utils/filter'

const responder: APIMapping['Appearance/Costume'] = async ({
  characterId: _characterId,
}) => {
  const characterId = parseMultiString(_characterId)?.[0]
  const costumes = await dbGet('Costume', {
    characterId: characterId,
    ...filterByReleaseDate(),
  })
  const ret = costumes
    .sort((a, b) => a.order - b.order)
    .map((x) => pick(x, ['id', 'order', 'name', 'sdAssetId', 'defaultHairId']))
  return ret
}

export const handler = apiWrapper(responder)
