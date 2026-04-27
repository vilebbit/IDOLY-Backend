import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import createErrStatus from '@utils/createErrStatus'

const responder: APIMapping['ActivityAbility'] = async ({ id }) => {
  const abilities = await dbGet('ActivityAbility')
  const item = abilities.find((x) => x.id === id)
  if (!item) {
    return createErrStatus(`No music found with id ${id}`, 404)
  }
  return item
}

export const handler = apiWrapper(responder)
