import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'
import { parseMultiString } from '@utils/parse'

const responder: APIMapping['Skill'] = async ({ ids: _ids }) => {
  const ids = parseMultiString(_ids)
  const allSkills = await dbGet('Skill', {
    $or: ids.map((id) => ({ id: { $eq: id } })),
  })
  return ids.map((id) => allSkills.find((skill) => skill.id === id)!)
}

export const handler = apiWrapper(responder)
