import type { APIMapping } from 'hoshimi-types/'
import { dbGet } from '@utils/dbGet.ts'
import apiWrapper from '@utils/apiWrapper.ts'
import dedup from '@utils/dedup.ts'
import flattenDepth from 'lodash/flattenDepth.js'

async function getAllSkillDetailsString(): Promise<string[]> {
  const skills = await dbGet('Skill')
  return flattenDepth(
    skills.map((x) =>
      x.levels.map((y) => y.skillDetails.map((z) => z.efficacyId))
    ),
    3
    // I guess TS cannot handle such type...
  ) as unknown as string[]
}

const responder: APIMapping['Skill/EffectTypes'] = async () => {
  const skillDetails = await getAllSkillDetailsString()
  return dedup(skillDetails.map((x) => x.split('-')[1]))
}

export const handler = apiWrapper(responder)
