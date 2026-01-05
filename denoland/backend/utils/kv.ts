import * as Sentry from 'sentry'
import { NonExpandedKeys } from './const.ts'
import type { NaiveResourceMapping, UnArray } from './types.ts'
import { MONGODB_CONNECTION, MONGODB_DATABASE } from '@utils/env.ts'

import { AggregatePipeline, Database, MongoClient } from 'mongodb'
import type { Filter } from 'mongodb'

const IS_ONLY = { __isOnly: true }

class Client {
  static #db: Database | null = null
  static #dbName: string
  static #conn: string

  static setup(conn: string, dbName: string) {
    Client.#conn = conn
    Client.#dbName = dbName
  }

  static getClient(): Promise<Database> {
    return Sentry.startSpan(
      {
        name: 'kv-get-client',
      },
      async () => {
        if (Client.#db !== null) {
          return this.#db
        }

        const client = new MongoClient(Client.#conn)
        const db = client.db(this.#dbName)
        this.#db = db
        return db
      }
    )
  }
}

Client.setup(MONGODB_CONNECTION, MONGODB_DATABASE)

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
      const $ = await Client.getClient()
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
      const $ = await Client.getClient()
      return (await $.collection(collectionName).insertMany(filter))
        .insertedCount
    }
  )
}

export async function del<T extends keyof NaiveResourceMapping>(
  collectionName: T
): Promise<void> {
  const $ = await Client.getClient()
  await $.collection<UnArray<NaiveResourceMapping[T]>>(
    collectionName
  ).deleteMany({})
}

export async function delWithFilter<T extends keyof NaiveResourceMapping>(
  collectionName: T,
  filter: Filter<UnArray<NaiveResourceMapping[T]>>
): Promise<number> {
  const $ = await Client.getClient()
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
      const $ = await Client.getClient()
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
      const $ = await Client.getClient()
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
      const $ = await Client.getClient()
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
