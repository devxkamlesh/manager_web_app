import { createClient } from 'redis'
import type { RedisClientType } from 'redis'

let redis: RedisClientType | null = null

export function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    redis = createClient({ url: process.env.REDIS_URL })
    
    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
    
    redis.on('connect', () => {
      console.log('Connected to Redis')
    })
    
    redis.connect().catch(console.error)
  }
  
  return redis
}

export async function cacheSet(key: string, value: any, ttl: number = 3600) {
  const client = getRedisClient()
  if (!client) return false
  
  try {
    await client.setEx(key, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Redis SET error:', error)
    return false
  }
}

export async function cacheGet(key: string) {
  const client = getRedisClient()
  if (!client) return null
  
  try {
    const value = await client.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Redis GET error:', error)
    return null
  }
}

export async function cacheDel(key: string) {
  const client = getRedisClient()
  if (!client) return false
  
  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis DEL error:', error)
    return false
  }
}