import type { APIMapping } from 'hoshimi-types/'
import pick from 'lodash/pick.js'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import createErrStatus from '@utils/createErrStatus.ts'

const responder: APIMapping['Message'] = async ({ id }) => {
  const messages = await dbGet('Message', {
    id: {
      $eq: id,
    },
  })
  const msg = messages[0]
  if (!msg) {
    return createErrStatus(`No message found with id ${id}`, 404)
  }
  return pick(msg, [
    'id',
    'characterId',
    'messageGroupId',
    'name',
    'type',
    'details',
  ])
}

export const handler = apiWrapper(responder)
