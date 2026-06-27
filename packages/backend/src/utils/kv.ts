import * as Sentry from '@sentry/node'
import { NonExpandedKeys } from './const'
import type { NaiveResourceMapping, UnArray } from './types'
import { MONGODB_CONNECTION, MONGODB_DATABASE } from '@utils/env'

import { MongoClient } from 'mongodb'
import type { Filter, Document } from 'mongodb'
type AggregatePipeline = any[]

const IS_ONLY = { __isOnly: true }

let client: MongoClient
let clientPromise: Promise<MongoClient> | null

async function getDb() {
  if (!clientPromise) {
    client = new MongoClient(MONGODB_CONNECTION)
    clientPromise = client.connect().catch((err) => {
      clientPromise = null
      throw err
    })
  }

  await clientPromise
  return client.db(MONGODB_DATABASE)
}

export function get<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: Filter<UnArray<NaiveResourceMapping[T]>> = {},
  project?: Partial<Record<keyof UnArray<NaiveResourceMapping[T]>, 1 | 0>>
): Promise<UnArray<NaiveResourceMapping[T]>[]> {
  return Sentry.startSpan(
    {
      name: 'kv-get',
      attributes: {
        collectionName: String(collectionName),
      },
    },
    async () => {
      const $ = await getDb()
      let ptr = await $.collection<any>(collectionName as string).find(
        filter as any
      )
      if (project !== undefined) {
        ptr = ptr.project(project)
      }
      return ptr.toArray() as unknown as UnArray<NaiveResourceMapping[T]>[]
    }
  )
}

export function put<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: UnArray<NaiveResourceMapping[T]>[]
): Promise<number> {
  return Sentry.startSpan(
    {
      name: 'kv-put',
      attributes: {
        collectionName: String(collectionName),
      },
    },
    async () => {
      if (filter.length === 0) {
        return 0
      }
      const $ = await getDb()
      return (
        await $.collection<UnArray<NaiveResourceMapping[T]> & Document>(
          collectionName as string
        ).insertMany(filter as any[])
      ).insertedCount
    }
  )
}

export async function del<T extends keyof NaiveResourceMapping>(
  collectionName: T
): Promise<void> {
  const $ = await getDb()
  await $.collection<any>(collectionName as string).deleteMany({})
}

export async function delWithFilter<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: Filter<UnArray<NaiveResourceMapping[T]>>
): Promise<number> {
  const $ = await getDb()
  const result = await $.collection<
    UnArray<NaiveResourceMapping[T]> & Document
  >(collectionName as string).deleteMany(filter as any)
  return result.deletedCount
}

export function setValue<T extends (typeof NonExpandedKeys)[number]>(
  key: T,
  value: string
): Promise<void> {
  return Sentry.startSpan(
    {
      name: 'kv-set',
      attributes: {
        key: String(key),
      },
    },
    async () => {
      const $ = await getDb()
      await $.collection(key as string).updateOne(
        IS_ONLY,
        { $set: { value } },
        { upsert: true }
      )
    }
  )
}

export function getValue<T extends (typeof NonExpandedKeys)[number]>(
  key: T
): Promise<string> {
  return Sentry.startSpan(
    {
      name: 'kv-get-value',
      attributes: { key: String(key) },
    },
    async () => {
      const $ = await getDb()
      return $.collection(key as string)
        .findOne(IS_ONLY)
        .then((x: any) => x?.value ?? '')
    }
  )
}

export function aggregate<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  pipeline: AggregatePipeline
): Promise<UnArray<NaiveResourceMapping[T]>[]> {
  return Sentry.startSpan(
    {
      name: 'kv-aggregate',
      attributes: {
        collectionName: String(collectionName),
      },
    },
    async () => {
      const $ = await getDb()
      return (await $.collection<any>(collectionName as string)
        .aggregate<UnArray<NaiveResourceMapping[T]>>(pipeline)
        .toArray()) as unknown as UnArray<NaiveResourceMapping[T]>[]
    }
  )
}

export default {
  get,
  put,
  del,
  delWithFilter,
  setValue,
  getValue,
  aggregate,
}
