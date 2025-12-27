import { Octokit } from "octokit";
import { OctoObservedKey } from "./const.ts";
import { dbGet } from "./dbGet.ts";
import { GHREPO_ADV, GHTOKEN_ADV } from "./env.ts";
import kv from "./kv.ts";

const octokit = new Octokit({
  auth: GHTOKEN_ADV,
});

export default async function observeAdv(): Promise<void> {
  const currOctoDbRevision = String((await dbGet("Octo")).revision);
  const lastOctoDbRevision = await kv.getValue(OctoObservedKey);
  if (currOctoDbRevision !== lastOctoDbRevision) {
    await Promise.all([
      octokit.request(
        `POST /repos/${GHREPO_ADV}/actions/workflows/observe_full.yml/dispatches`,
        {
          ref: "master",
          inputs: {
            revision: currOctoDbRevision,
          },
        },
      ),
      kv.setValue(OctoObservedKey, currOctoDbRevision),
    ]);
  }
}
