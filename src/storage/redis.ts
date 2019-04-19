/**
 * @see https://redislabs.com/resources/how-to-redis-enterprise/
 */
import { createClient } from 'redis'
import { promisify } from 'util'
import { logger } from '../log'

export interface RedisGetSetOptions {
  isJSON?: boolean
}
export type RedisFactoryType = ReturnType<typeof createRedis>

function createRedis() {
  const client = createClient({
    url: process.env.REDIS_URL || '//localhost:6379',
    password: process.env.REDIS_PASSWORD,
  })

  client.on('error', redisError => {
    logger.error(redisError)
  })
  const getAsync = promisify(client.get).bind(client)
  const setAsync = promisify(client.set).bind(client)
  const clear = promisify(client.flushdb).bind(client)
  const hasAsync = async (key: string) => !!(await getAsync(key))
  const has = hasAsync

  const get = async (
    key: string,
    options: RedisGetSetOptions = { isJSON: true }
  ) => {
    const value = await getAsync(key)
    if (options.isJSON) {
      return JSON.parse(value)
    } else {
      return value
    }
  }
  const set = async (
    key: string,
    value: any,
    options: RedisGetSetOptions = { isJSON: true }
  ) => {
    const safeValue =
      options.isJSON && value !== null && typeof value === 'object'
        ? JSON.stringify(value as {})
        : value
    return setAsync(key, safeValue)
  }

  return { client, clear, get, set, has }
}

function createRedisUsingEnv(): RedisFactoryType {
  if (
    process.env.CACHE_TYPE !== 'mock-redis' &&
    typeof process.env.REDIS_URL === 'string' &&
    typeof process.env.REDIS_PASSWORD === 'string'
  ) {
    logger.info('[redis] creating client')
    return createRedis()
  } else {
    logger.info('[redis] creating mock')
    const client = {}
    const fakeStore = new Map()
    const get = (key: string, value: any) => fakeStore.get(key)
    const set = (key: string, value: any) => fakeStore.set(key, value)
    const has = (key: string) => fakeStore.has(key)
    const clear = () => fakeStore.clear()
    return ({ client, has, get, set, clear } as {}) as RedisFactoryType
  }
}

/**
 * @todo may want to lazily instantiate
 */
const redisAdapter = createRedisUsingEnv()
// done this way to avoid issues with shadowed variables
const clientExport = redisAdapter.client
const getExport = redisAdapter.get
const setExport = redisAdapter.set
const hasExport = redisAdapter.has
const clearExport = redisAdapter.clear

export {
  clientExport as client,
  getExport as get,
  setExport as set,
  hasExport as has,
  clearExport as clear,
}
