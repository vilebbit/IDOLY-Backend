import type { APIMapping } from './apiMapping.ts'
import type { ResourceMapping } from './resourceMapping.ts'

export type { ResourceMapping } from './resourceMapping.ts'
export type { APIMapping } from './apiMapping.ts'

export type AcceptableDbKey = keyof ResourceMapping
export type AcceptableApiPath = keyof APIMapping
