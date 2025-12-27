import type { APIMapping } from "hoshimi-types/";
import { dbGet } from "@utils/dbGet.ts";
import apiWrapper from "@utils/apiWrapper.ts";

const responder: APIMapping["CardParameter"] = async ({
  id,
  level: _level,
}) => {
  const cardParam = await dbGet("CardParameter");
  const level = parseInt(_level ?? "");

  return cardParam
    .filter((x) => (!Number.isNaN(level) ? x.level === level : true))
    .filter((x) => (id ? x.id === id : true));
};

export const handler = apiWrapper(responder);
