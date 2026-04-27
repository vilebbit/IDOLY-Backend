import type { ResourceMapping } from 'hoshimi-types'
import type { RequestHandler } from 'express'
import type { NonExpandedKeys } from './const'

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

export type Handler = RequestHandler

export type Route = {
  name: string
  handler: Handler
}
