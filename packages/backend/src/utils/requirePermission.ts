import type { Request } from 'express'
import { ADMIN_TOKEN, isDevelopEnv, READONLY_TOKEN } from '@utils/env'

export function isAdmin(req: Request): boolean {
  if (ADMIN_TOKEN === '') return false
  if (isDevelopEnv) return true
  const authLine = req.get('Authorization')
  if (!authLine) return false
  const splits = authLine.split(' ')
  return splits[0].toLowerCase() === 'bearer' && splits[1] === ADMIN_TOKEN
}

export function isReadonly(req: Request): boolean {
  if (isDevelopEnv) return true
  if (isAdmin(req)) return true
  const authLine = req.get('Authorization')
  if (!authLine) return false
  const splits = authLine.split(' ')
  return splits[0].toLowerCase() === 'bearer' && splits[1] === READONLY_TOKEN
}
