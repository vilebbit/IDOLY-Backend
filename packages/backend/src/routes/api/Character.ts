import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { parseMultiString } from '@utils/parse'
import pick from 'lodash/pick'

const responder: APIMapping['Character'] = async ({ ids: _ids }) => {
  const ids = parseMultiString(_ids)
  const ch = await dbGet('Character')
  return ch
    .filter((x) => ids.includes(x.id))
    .map((x) =>
      pick(x, [
        'id',
        'characterGroupId',
        'order',
        'name',
        'enName',
        'cv',
        'age',
        'birthday',
        'height',
        'weight',
        'zodiacSign',
        'hometown',
        'favorite',
        'unfavorite',
        'profile',
        'isNpc',
        'altCharacters',
        'color',
        'isLeftHanded',
        'shortProfile',
        'threeSize',
        'catchphrase',
        'idiom',
      ])
    )
}

export const handler = apiWrapper(responder)
