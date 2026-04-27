import type { APIMapping } from 'hoshimi-types'
import { dbGet } from '@utils/dbGet'
import apiWrapper from '@utils/apiWrapper'

const responder: APIMapping['Skill/All'] = () => dbGet('Skill')

export const handler = apiWrapper(responder)
