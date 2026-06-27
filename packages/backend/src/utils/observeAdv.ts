import { OctoObservedKey } from './const'
import { GHREPO_ADV, GHTOKEN_ADV } from './env'
import kv from './kv'
import tryJsonParse from './tryJsonParse'
const { Octokit } = require('octokit')

const octokit = new Octokit({
  auth: GHTOKEN_ADV,
})

export default async function observeAdv(): Promise<void> {
  const currOctoDbRevision = String(
    tryJsonParse(await kv.getValue('Octo')).revision ?? 'unknown'
  )
  const lastOctoDbRevision = await kv.getValue(OctoObservedKey)
  if (currOctoDbRevision !== lastOctoDbRevision) {
    await Promise.all([
      octokit.request(
        `POST /repos/${GHREPO_ADV}/actions/workflows/observe_full.yml/dispatches`,
        {
          ref: 'master',
          inputs: {
            revision: currOctoDbRevision,
          },
        }
      ),
      kv.setValue(OctoObservedKey, currOctoDbRevision),
    ])
  }
}
