import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'

const responder: APIMapping['Stamps'] = async () => {
  const assets = await dbGet(
    'Octo_assetBundleList',
    {
      name: {
        $regex: '^img_message_stamp_',
      },
    },
    ['name']
  )

  return assets
    .map((x) => x.name)
    .map((x) => x.replace(/^img_message_stamp_/, ''))
    .sort()
}

export const handler = apiWrapper(responder)
