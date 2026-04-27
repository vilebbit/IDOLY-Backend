class Kv {
  #kv = new Map<string, { data: unknown; expireTs: number }>()

  get(key: string) {
    const x = this.#kv.get(key)
    if (!x) {
      return null
    }
    if (x.expireTs < Number(new Date()) / 1000) {
      this.#kv.delete(key)
      return null
    }

    return x.data
  }

  set(key: string, data: unknown, expireIn: number) {
    this.#kv.set(key, {
      data,
      expireTs: Number(new Date()) / 1000 + expireIn,
    })
  }
}

const kv = new Kv()
const ONE_HOUR = 1000 * 60 * 60

export async function getCache<T>(key: string): Promise<T | null> {
  const res = await kv.get(key)
  return res as unknown as T | null
}

export async function setCache(
  key: string,
  value: unknown,
  expireIn: number = ONE_HOUR
) {
  await kv.set(key, value, expireIn)
}
