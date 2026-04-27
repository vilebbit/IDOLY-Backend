import express from 'express'
import * as Sentry from '@sentry/node'
import manifest from './routes'
import checkEnv from '@utils/checkEnv'
import env, { isDevelopEnv, SENTRY_DSN } from './utils/env'

checkEnv()

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: isDevelopEnv ? 1.0 : 0.2,
})
Sentry.setTag('machine', env.BACKEND_INSTANCE_ID)

const app = express()
const port = 8000

app.use(express.static('./static'))
app.use(
  express.json({
    limit: '2mb',
    type: () => true,
  })
)

Object.entries(manifest.routes).forEach(([path, handler]) => {
  app.all(path, async (req, res, next) => {
    try {
      const result = await handler(req, res, next)
      if (result instanceof Response) {
        // Convert Web Response to Express response
        res.status(result.status)
        result.headers.forEach((value, key) => {
          res.setHeader(key, value)
        })
        const body = await result.text()
        res.send(body)
      }
    } catch (error) {
      next(error)
    }
  })
})

app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`)
})
