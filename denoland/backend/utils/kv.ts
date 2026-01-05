import * as Sentry from 'sentry'
import { NonExpandedKeys } from './const.ts'
import type { NaiveResourceMapping, UnArray } from './types.ts'
import { MONGODB_CONNECTION, MONGODB_DATABASE } from '@utils/env.ts'

import { AggregatePipeline, Database, MongoClient } from 'mongodb'
import type { Filter } from 'mongodb'

const IS_ONLY = { __isOnly: true }

class Client {
  #client: MongoClient
  #db: Database | null = null
  #dbName: string

  constructor(conn: string, dbName: string) {
    this.#client = new MongoClient(conn)
    this.#dbName = dbName
  }

  getClient(): Promise<Database> {
    return Sentry.startSpan(
      {
        name: 'kv-get-client',
      },
      async () => {
        if (this.#db !== null) {
          return this.#db
        }

        this.#db = this.#client.db(this.#dbName)
        return this.#db
      }
    )
  }
}

const client = new Client(MONGODB_CONNECTION, MONGODB_DATABASE)

export function get<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: Filter<UnArray<NaiveResourceMapping[T]>> = {}
): Promise<UnArray<NaiveResourceMapping[T]>[]> {
  return Sentry.startSpan(
    {
      name: 'kv-get',
      attributes: {
        collectionName,
      },
    },
    async () => {
      const $ = await client.getClient()
      return $.collection<UnArray<NaiveResourceMapping[T]>>(collectionName)
        .find(filter)
        .toArray()
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
        collectionName,
      },
    },
    async () => {
      if (filter.length === 0) {
        return 0
      }
      const $ = await client.getClient()
      return (await $.collection(collectionName).insertMany(filter))
        .insertedCount
    }
  )
}

export async function del<T extends keyof NaiveResourceMapping>(
  collectionName: T
): Promise<void> {
  const $ = await client.getClient()
  await $.collection<UnArray<NaiveResourceMapping[T]>>(
    collectionName
  ).deleteMany({})
}

export async function delWithFilter<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: Filter<UnArray<NaiveResourceMapping[T]>>
): Promise<number> {
  const $ = await client.getClient()
  return await $.collection<UnArray<NaiveResourceMapping[T]>>(
    collectionName
  ).deleteMany(filter)
}

export function setValue<T extends (typeof NonExpandedKeys)[number]>(
  key: T,
  value: string
): Promise<void> {
  return Sentry.startSpan(
    {
      name: 'kv-set',
      attributes: {
        key,
      },
    },
    async () => {
      const $ = await client.getClient()
      await $.collection(key).updateOne(
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
      attributes: { key },
    },
    async () => {
      const $ = await client.getClient()
      return $.collection(key)
        .findOne(IS_ONLY)
        .then((x) => x?.value ?? '')
    }
  )
}

export function aggregate<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  pipeline: AggregatePipeline<NaiveResourceMapping[T]>[]
): Promise<UnArray<NaiveResourceMapping[T]>[]> {
  return Sentry.startSpan(
    {
      name: 'kv-aggregate',
      attributes: {
        collectionName,
      },
    },
    async () => {
      const $ = await client.getClient()
      return $.collection<UnArray<NaiveResourceMapping[T]>>(collectionName)
        .aggregate<UnArray<NaiveResourceMapping[T]>>(pipeline)
        .toArray()
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
