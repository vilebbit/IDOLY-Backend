import type { APIMapping } from 'hoshimi-types'
import apiWrapper from '@utils/apiWrapper'
import kv from '@utils/kv'
import { UpdateTimeKey } from '@utils/const'

const responder: APIMapping['Version'] = async () => {
  const updateDate = await kv.getValue(UpdateTimeKey)
  const version = updateDate ?? 'latest'
  return { version }
}

export const handler = apiWrapper(responder)
