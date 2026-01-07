import type { APIMapping } from 'hoshimi-types/'
import pick from 'lodash/pick.js'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import { parseMultiString } from '@utils/parse.ts'
import { filterByReleaseTime } from '@utils/filter.ts'

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
