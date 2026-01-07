import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import createErrStatus from '@utils/createErrStatus.ts'
import pick from 'lodash/pick.js'
import { filterByReleaseDate } from '@utils/filter.ts'

const responder: APIMapping['Card'] = async ({ id }) => {
  const filter: any = {
    ...filterByReleaseDate(),
  }

  if (id) {
    filter.id = { $eq: id }
  }

  const cards = await dbGet('Card', filter)

  if (cards.length === 0) {
    return createErrStatus(`No music found with id ${id}`, 404)
  }

  return cards.map((x) =>
    pick(x, [
      'id',
      'assetId',
      'name',
      'description',
      'type',
      'characterId',
      'initialRarity',
      'cardParameterId',
      'vocalRatioPermil',
      'danceRatioPermil',
      'visualRatioPermil',
      'staminaRatioPermil',
      'skillId1',
      'skillId2',
      'skillId3',
      'skillId4',
      'releaseDate',
      'stories',
      'liveAbilityId',
      'activityAbilityId',
    ])
  )
}

export const handler = apiWrapper(responder)
