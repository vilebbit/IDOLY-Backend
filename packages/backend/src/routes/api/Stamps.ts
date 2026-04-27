import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'

const responder: APIMapping['Stamps'] = async () => {
  const assets = await dbGet('Octo').then((x) => x.assetBundleList)

  return assets
    .map((x) => x.name)
    .filter((x) => x.startsWith('img_message_stamp_'))
    .map((x) => x.replace(/^img_message_stamp_/, ''))
    .sort()
}

export const handler = apiWrapper(responder)
