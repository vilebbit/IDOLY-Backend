import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import pick from 'lodash/pick.js'
import createErrStatus from '@utils/createErrStatus.ts'
import calcPropValue from '../../../utils/calcPropValue.ts'
import { filterByReleaseDate } from '@utils/filter.ts'

const responder: APIMapping['Card/List'] = async ({
  level: _level,
  rarity: _rarity,
}) => {
  const [cards, cardParam, cardRarity] = await Promise.all([
    dbGet(
      'Card',
      {
        ...filterByReleaseDate(),
      },
      true
    ),
    dbGet('CardParameter'),
    dbGet('CardRarity'),
  ])

  const level = Number.parseInt(_level)
  const rarity = Number.parseInt(_rarity)
  if (Number.isNaN(level) || Number.isNaN(rarity)) {
    return createErrStatus('Invalid level/rarity')
  }
  const rarityArgs = cardRarity.find((x) => x.rarity === rarity)
  if (!rarityArgs) {
    return createErrStatus(
      `CardRarity args not found for rarity ${rarity}`,
      404
    )
  }

  return cards.map((card) => {
    const {
      cardParameterId,
      vocalRatioPermil,
      danceRatioPermil,
      visualRatioPermil,
      staminaRatioPermil,
    } = card
    const paramArgs = cardParam.find(
      (x) => x.level === level && x.id === cardParameterId
    )
    if (!paramArgs) {
      return createErrStatus(
        `CardParameter args not found for cardParameterId ${cardParameterId}`,
        404
      )
    }
    const paramValue = Number(paramArgs.value)
    return {
      ...pick(card, [
        'id',
        'assetId',
        'name',
        'characterId',
        'type',
        'initialRarity',
        'releaseDate',
      ]),
      vocalPt: calcPropValue(
        vocalRatioPermil,
        paramValue,
        rarityArgs.parameterBonusPermil
      ),
      dancePt: calcPropValue(
        danceRatioPermil,
        paramValue,
        rarityArgs.parameterBonusPermil
      ),
      visualPt: calcPropValue(
        visualRatioPermil,
        paramValue,
        rarityArgs.parameterBonusPermil
      ),
      staminaPt: calcPropValue(
        staminaRatioPermil,
        Number(paramArgs.staminaValue),
        rarityArgs.parameterBonusPermil
      ),
    }
  })
}

export const handler = apiWrapper(responder)
