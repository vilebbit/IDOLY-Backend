import { MessageXKey } from "./const.ts";
import { dbGet } from "./dbGet.ts";
import kv from "./kv.ts";

export default async function flattenMessages() {
  const messages = await dbGet("Message");
  const flattenedMessages = messages
    .map((commu) =>
      commu.details.map((line) => ({
        ...line,
        name: commu.name,
        id: commu.id,
        characterGroupId: commu.characterId,
      }))
    )
    .reduce((a, b) => [...a, ...b]);

  await kv.del(MessageXKey);
  await kv.put(MessageXKey, flattenedMessages);
}
