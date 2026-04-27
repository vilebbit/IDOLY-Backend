import type { APIMapping } from 'hoshimi-types'
import pick from 'lodash/pick'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { parseMultiString } from '@utils/parse'
import { filterByReleaseTime } from '@utils/filter'

const responder: APIMapping['Appearance/Hair'] = async ({
  characterId: _characterId,
}) => {
  const characterId = parseMultiString(_characterId)?.[0]
  const hairs = await dbGet('Hair', {
    characterId: characterId,
    ...filterByReleaseTime(),
  })
  const ret = hairs
    .sort((a, b) => a.order - b.order)
    .map((x) =>
      pick(x, [
        'id',
        'order',
        'name',
        'sdHairAssetId',
        'fittingCostumeId',
        'wearableCostumeIds',
        'notWearableCostumeIds',
      ])
    )
  return ret
}

export const handler = apiWrapper(responder)
