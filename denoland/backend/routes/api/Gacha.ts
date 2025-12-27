import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import { GachaType } from 'hoshimi-types/ProtoEnum'
import pick from 'lodash/pick.js'
import uniqBy from 'lodash/uniqBy.js'

const responder: APIMapping['Gacha'] = async () => {
  const [Gachas, Conditions, Cards] = await Promise.all([
    dbGet('Gacha'),
    dbGet('Condition'),
    dbGet('Card'),
  ])
  const items = Gachas.filter((x) =>
    [GachaType.Normal, GachaType.Premium].includes(x.gachaType)
  )
    .sort((a, b) => a.order - b.order)
    .map((x) => {
      const condition = Conditions.find((y) => y.id === x.viewConditionId)

      if (!condition) {
        return null
      }
      if (condition.settings.length !== 1) {
        return null
      }
      if (!condition.settings[0].term) {
        return null
      }

      const { nowAfter, nowBefore } = condition.settings[0].term
      const { name, gachaType, description, pickupCardIds, bannerAssetId } = x

      if (pickupCardIds.length === 0) {
        return null
      }

      return {
        name,
        description,
        gachaType,
        bannerAssetId,
        pickupCards: pickupCardIds
          .map((x) => Cards.find((r) => r.id === x)!)
          .map((x) =>
            pick(x, ['id', 'name', 'assetId', 'characterId', 'type'])
          ),
        nowAfter: Number(nowAfter),
        nowBefore: Number(nowBefore),
      }
    })
    .filter((x): x is Exclude<typeof x, null> => x !== null)
    .filter((x) => {
      const now = Number(new Date())
      return x.nowAfter < now && x.nowBefore > now
    })

  return uniqBy(
    items,
    (x) =>
      `${x.name}||${x.bannerAssetId}||${x.pickupCards
        .map((x) => x.id)
        .sort()
        .join(',')}`
  )
}

export const handler = apiWrapper(responder)
