import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import parseChart from '@utils/parseChart'
import createErrStatus from '@utils/createErrStatus'

const responder: APIMapping['MusicChart'] = async ({ chartId }) => {
  if (!chartId) {
    return createErrStatus('chartId not found')
  }
  const ch = await dbGet('MusicChartPattern', {
    id: {
      $eq: chartId,
    },
  })

  return parseChart(chartId, ch)
}

export const handler = apiWrapper(responder)
