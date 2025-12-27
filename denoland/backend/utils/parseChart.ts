import { MusicChartType } from "hoshimi-types/ProtoEnum";
import type { MusicChartPattern } from "hoshimi-types/ProtoMaster";
import type { MusicChart } from "hoshimi-types/types";
import { UnwrapPromise } from "@utils/types.ts";
import type { APIMapping } from "hoshimi-types/";

export default function parseChart(
  chartId: string,
  chartData: MusicChartPattern[],
): MusicChart {
  const chartFlow = chartData.filter(
    (x) => x.id === chartId && x.type !== MusicChartType.Unknown,
  );

  const ret: UnwrapPromise<ReturnType<APIMapping["MusicChart"]>> = {
    id: chartId,
    desc: "",
    beats: chartFlow.length,
    chart: { 1: [], 2: [], 3: [], 4: [], 5: [] },
  };
  let currBeat = 0;
  let spCount = 0;
  let aCount = 0;
  for (const i of chartFlow.sort((a, b) => a.number - b.number)) {
    currBeat++;
    switch (i.type) {
      case MusicChartType.ActiveSkill: {
        ret.chart[i.position as 1 | 2 | 3 | 4 | 5].push(currBeat);
        aCount++;
        break;
      }
      case MusicChartType.SpecialSkill: {
        ret.chart[i.position as 1 | 2 | 3 | 4 | 5].push(currBeat * -1);
        spCount++;
        break;
      }
    }
  }
  ret.desc = `${spCount}SP${aCount}A`;
  return ret;
}
