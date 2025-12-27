import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import filterRelease from '@utils/filterRelease.ts'
import uniq from 'lodash/uniq.js'

const responder: APIMapping['Card/Id'] = async () => {
  const cards = await dbGet('Card').then(filterRelease)
  const charIds = uniq(cards.map((x) => x.characterId))
  const ret: Record<
    string,
    {
      ccid: number
      cardId: string
      nameJa: string
    }[]
  > = {}
  for (const charId of charIds) {
    const characterCards = cards
      .filter((x) => x.characterId === charId)
      .sort(
        (a, b) =>
          Number(a.releaseDate) - Number(b.releaseDate) ||
          (a.id < b.id ? -1 : 1)
      )
    ret[charId] = characterCards.map((v, i) => ({
      ccid: i + 1, // starts from 1
      cardId: v.id,
      nameJa: v.name,
    }))
  }
  return ret
}

export const handler = apiWrapper(responder)
