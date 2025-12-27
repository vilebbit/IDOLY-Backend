import type { ResourceMapping } from 'hoshimi-types/'
import { RouterMiddleware } from '@oak/oak'
import { NonExpandedKeys } from './const.ts'

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : never

export type UnArray<T> = T extends (infer R)[] ? R : never

export type NaiveResourceMapping = Omit<
  ResourceMapping,
  (typeof NonExpandedKeys)[number]
>

export const FieldStatus = Symbol('Status')

export type ErrorWithStatus = {
  [FieldStatus]: number
  message: string
  ok: false
}

// oyetanishq/deno-file-based-routing

export type Handler = RouterMiddleware<string, Record<string, any>>

export type Route = {
  name: string
  handler: Handler
}
