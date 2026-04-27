import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'

const responder: APIMapping['Message/Group'] = async ({ messageGroupId }) => {
  const messages = await dbGet('Message')
  return messages
    .filter((r) => r.messageGroupId === messageGroupId)
    .map(({ id, name }) => ({ id, name }))
}

export const handler = apiWrapper(responder)
