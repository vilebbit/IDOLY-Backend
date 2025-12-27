import type { PageParams } from "../../../packages/types/denodist/helpers.ts";
import { DefaultLimit, MaxLimit } from "./const.ts";

export function extractPageParams(x: PageParams): {
  lim: number;
  off: number;
} {
  const { limit, offset } = x;
  const limitNum = Number(limit || DefaultLimit);
  const offsetNum = Number(offset || 0);
  if (Number.isNaN(limitNum) || Number.isNaN(offsetNum)) {
    throw Error("Invalid limit or offset");
  }
  if (limitNum > MaxLimit) {
    throw Error("Too large limit value");
  }
  return {
    lim: limitNum,
    off: offsetNum,
  };
}
