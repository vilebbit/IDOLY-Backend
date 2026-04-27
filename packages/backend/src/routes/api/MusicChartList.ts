// @ts-nocheck：This page is a bit of chaotic...

import type { APIMapping } from 'hoshimi-types'
import { MusicChartType } from 'hoshimi-types/ProtoEnum'
import { dbAggregate, dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { UnwrapPromise } from '@utils/types'
import firstMatches from '@utils/firstMatches'

const responder: APIMapping['MusicChartList'] = async () => {
  const [chartIds, chartACounts, chartSPCounts, musicItems] = await Promise.all(
    [
      dbAggregate('MusicChartPattern', [
        {
          $group: {
            _id: '$id',
          },
        },
      ]).then((x) => x.map((y) => y._id)) as Promise<string[]>,
      dbAggregate('MusicChartPattern', [
        { $match: { type: MusicChartType.ActiveSkill } },
        {
          $group: {
            _id: '$id',
            cnt: { $count: {} },
          },
        },
      ]) as Promise<{ _id: string; cnt: number }[]>,
      dbAggregate('MusicChartPattern', [
        { $match: { type: MusicChartType.SpecialSkill } },
        {
          $group: {
            _id: '$id',
            cnt: { $count: {} },
          },
        },
      ]) as Promise<{ _id: string; cnt: number }[]>,
      dbGet('Music'),
    ]
  )

  const ret: UnwrapPromise<ReturnType<typeof responder>> = []
  const ingestedMusicItems = new Set()

  for (const i of chartIds) {
    const musicId = i.replace(/^chart-/, 'music-').replace(/-[0-9]+$/, '')
    ingestedMusicItems.add(musicId)
    const maybeChartListItem = firstMatches(ret, 'musicId', musicId)
    const aCount = chartACounts.find((r) => r._id === i)?.cnt ?? 0
    const spCount = chartSPCounts.find((r) => r._id === i)?.cnt ?? 0
    const chartDesc = `${spCount}SP${aCount}A`
    if (maybeChartListItem) {
      maybeChartListItem.charts.push({
        id: i,
        desc: chartDesc,
      })
      continue
    }
    const maybeMusic = firstMatches(musicItems, 'id', musicId)
    if (maybeMusic === null) continue
    ret.push({
      musicId: maybeMusic.id,
      title: maybeMusic.name,
      assetId: maybeMusic.assetId,
      charts: [
        {
          id: i,
          desc: chartDesc,
        },
      ],
    })
  }

  for (const i of musicItems) {
    const musicId = i.id
    if (ingestedMusicItems.has(musicId)) continue
    // Music with no charts
    ret.push({
      musicId,
      title: i.name,
      assetId: i.assetId,
      charts: [],
    })
  }

  return ret.sort(
    (a, b) =>
      (musicItems.find((x) => x.id === a.musicId)?.order ?? Infinity) -
      (musicItems.find((x) => x.id === b.musicId)?.order ?? Infinity)
  )
}

export const handler = apiWrapper(responder)
