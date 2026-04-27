import type { Request } from 'express'

// dafuq: expressjs/express#4697
export default function getOriginalUrl(req: Request) {
  const fullUrl =
    req.protocol +
    '://' +
    (req.get('host') ?? 'unknown.local:8000') +
    req.originalUrl
  return new URL(fullUrl)
}
